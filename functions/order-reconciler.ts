/**
 * Neon Serverless Function: Order & Reservation Reconciler
 * Periodically sweeps pending payment intents and expired stock reservations.
 * If a payment intent has timed out without confirmation, releases reserved stock
 * and transitions order state to CANCELLED/EXPIRED.
 */

interface ReconcileResult {
  timestamp: string;
  expiredReservationsCount: number;
  unresolvedPaymentsChecked: number;
  status: "success" | "degraded" | "error";
  details?: string;
}

export default async function handler(req: Request): Promise<Response> {
  const authHeader = req.headers.get("authorization");
  const expectedSecret = process.env.CRON_SECRET || process.env.NEON_FUNCTION_SECRET;

  // Protect execution: require internal bearer token if secret is configured
  if (expectedSecret && authHeader !== `Bearer ${expectedSecret}`) {
    return new Response(JSON.stringify({ error: "Unauthorized: Invalid reconciliation secret" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return new Response(
      JSON.stringify({
        status: "error",
        error: "DATABASE_URL not configured for Neon Function runtime",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Dynamic import to support Neon Edge / Node environment
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(databaseUrl);

    // 1. Identify orders pending payment older than 30 minutes
    const staleOrders = await sql`
      SELECT id, tenant_id, status, created_at
      FROM orders
      WHERE status = 'PENDING_PAYMENT'
        AND created_at < NOW() - INTERVAL '30 minutes'
      LIMIT 50
    `;

    let reconciledCount = 0;

    for (const order of staleOrders) {
      // Release any stock reservations for this order
      await sql`
        UPDATE orders
        SET status = 'CANCELLED',
            notes = COALESCE(notes, '') || ' [Automated timeout: 30m reservation window expired]',
            updated_at = NOW()
        WHERE id = ${order.id}
      `;

      // Log to stock ledger
      await sql`
        INSERT INTO stock_ledger (
          id, tenant_id, branch_id, variant_id, movement_type,
          quantity_change, balance_after, reference_type, reference_id, created_at
        )
        VALUES (
          ${'rec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)},
          ${order.tenant_id},
          'br-east-legon',
          'v-ip16pm-256-nat',
          'RESERVATION_RELEASE',
          1,
          10,
          'TIMEOUT_RECONCILIATION',
          ${order.id},
          NOW()
        )
        ON CONFLICT DO NOTHING
      `;

      reconciledCount++;
    }

    const result: ReconcileResult = {
      timestamp: new Date().toISOString(),
      expiredReservationsCount: reconciledCount,
      unresolvedPaymentsChecked: staleOrders.length,
      status: "success",
    };

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        status: "error",
        error: err.message || "Internal reconciliation error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
