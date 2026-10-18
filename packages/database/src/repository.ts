import {
  Tenant,
  User,
  Branch,
  ProductListing,
  ProductCompatibility,
  AnimationPackage,
  BranchInventory,
  StockLedgerEntry,
  Order,
  PaymentIntent,
  PaymentWebhookEvent,
  CashierShift,
  PosTransaction,
  WarrantyRecord,
  RepairJobCard,
  TradeInValuation,
} from "@gcp/contracts";
import {
  SEED_TENANT,
  SEED_BRANCHES,
  SEED_USERS,
  SEED_PRODUCTS,
  SEED_COMPATIBILITIES,
  SEED_ANIMATION_PACKAGE_IPHONE16,
  SEED_BRANCH_INVENTORIES,
  SEED_SERIALIZED_DEVICES,
} from "./seed-data.js";
import { getNeonSql } from "./client.js";

export interface UserWithCredentials {
  user: User;
  passwordHash: string;
}

export class MultiTenantRepository {
  private sql = getNeonSql();

  // Test doubles / Local in-memory caches
  private tenants = new Map<string, Tenant>([[SEED_TENANT.id, SEED_TENANT]]);
  private users = new Map<string, User>(SEED_USERS.map((u) => [u.id, u]));
  private userPasswordHashes = new Map<string, string>();
  private branches = new Map<string, Branch>(SEED_BRANCHES.map((b) => [b.id, b]));
  private products = new Map<string, ProductListing>(SEED_PRODUCTS.map((p) => [p.id, p]));
  private compatibilities: ProductCompatibility[] = [...SEED_COMPATIBILITIES];
  private animationPackages = new Map<string, AnimationPackage>([
    [SEED_ANIMATION_PACKAGE_IPHONE16.id, SEED_ANIMATION_PACKAGE_IPHONE16],
  ]);
  private branchInventories = new Map<string, BranchInventory>(
    SEED_BRANCH_INVENTORIES.map((i) => [`${i.branchId}_${i.variantId}`, i])
  );
  private stockLedger: StockLedgerEntry[] = [];
  private orders = new Map<string, Order>();
  private paymentIntents = new Map<string, PaymentIntent>();
  private paymentEvents: PaymentWebhookEvent[] = [];
  private shifts = new Map<string, CashierShift>();
  private posTransactions = new Map<string, PosTransaction>();
  private warranties = new Map<string, WarrantyRecord>();
  private repairJobs = new Map<string, RepairJobCard>();
  private tradeIns = new Map<string, TradeInValuation>();

  constructor() {
    // Default fallback hash for seed users in test environments (GadgetMaster2026!)
    const defaultHash = "$2b$10$JOvUtZRdVDciI3DJc.5OyehpOzREjbGn.GJFWiytEIJgpTr7nqDVa";
    for (const u of SEED_USERS) {
      this.userPasswordHashes.set(u.id, defaultHash);
    }
  }

  /**
   * Helper to execute tagged template SQL queries against Neon PostgreSQL returning typed arrays
   */
  private async runSql<T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]> {
    if (!this.sql) {
      if (process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
        throw new Error("Neon Database Client uninitialized: production requires durable database connection.");
      }
      return [];
    }
    try {
      const result = await (this.sql as any)(strings, ...values);
      if (Array.isArray(result)) return result as T[];
      return [];
    } catch (err: any) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(`Neon SQL execution failed: ${err.message || String(err)}`);
      }
      console.warn("Neon SQL execution error:", err);
      return [];
    }
  }

  // --- Tenants ---
  async getTenant(idOrSlug: string): Promise<Tenant | null> {
    const rows = await this.runSql`
      SELECT * FROM tenants
      WHERE id = ${idOrSlug} OR slug = ${idOrSlug} OR primary_domain = ${idOrSlug}
      LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        name: r.name,
        slug: r.slug,
        primaryDomain: r.primary_domain,
        additionalDomains: Array.isArray(r.additional_domains) ? r.additional_domains : [],
        currency: r.currency || "GHS",
        locale: r.locale || "en-GH",
        timezone: r.timezone || "Africa/Accra",
        taxRatePercent: Number(r.tax_rate_percent) || 0,
        subscriptionPlan: r.subscription_plan as any,
        subscriptionStatus: r.subscription_status as any,
        branding: typeof r.branding === "object" && r.branding !== null ? r.branding : {},
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      };
    }

    for (const t of this.tenants.values()) {
      if (t.id === idOrSlug || t.slug === idOrSlug || t.primaryDomain === idOrSlug) {
        return t;
      }
    }
    return null;
  }

  async listTenants(): Promise<Tenant[]> {
    const rows = await this.runSql`SELECT * FROM tenants ORDER BY created_at ASC`;
    if (rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        primaryDomain: r.primary_domain,
        additionalDomains: Array.isArray(r.additional_domains) ? r.additional_domains : [],
        currency: r.currency || "GHS",
        locale: r.locale || "en-GH",
        timezone: r.timezone || "Africa/Accra",
        taxRatePercent: Number(r.tax_rate_percent) || 0,
        subscriptionPlan: r.subscription_plan as any,
        subscriptionStatus: r.subscription_status as any,
        branding: typeof r.branding === "object" && r.branding !== null ? r.branding : {},
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      }));
    }
    return Array.from(this.tenants.values());
  }

  async createTenant(tenant: Tenant): Promise<Tenant> {
    this.tenants.set(tenant.id, tenant);
    await this.runSql`
      INSERT INTO tenants (
        id, name, slug, primary_domain, additional_domains, currency, locale,
        timezone, tax_rate_percent, subscription_plan, subscription_status, branding,
        created_at, updated_at
      )
      VALUES (
        ${tenant.id}, ${tenant.name}, ${tenant.slug}, ${tenant.primaryDomain},
        ${JSON.stringify(tenant.additionalDomains)}, ${tenant.currency}, ${tenant.locale},
        ${tenant.timezone}, ${tenant.taxRatePercent}, ${tenant.subscriptionPlan},
        ${tenant.subscriptionStatus}, ${JSON.stringify(tenant.branding)},
        ${tenant.createdAt}, ${tenant.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        branding = EXCLUDED.branding,
        updated_at = NOW()
    `;
    return tenant;
  }

  async updateTenantBranding(tenantId: string, branding: Partial<Tenant["branding"]>): Promise<Tenant> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);
    tenant.branding = { ...tenant.branding, ...branding };
    tenant.updatedAt = new Date();
    this.tenants.set(tenantId, tenant);

    await this.runSql`
      UPDATE tenants
      SET branding = ${JSON.stringify(tenant.branding)},
          updated_at = NOW()
      WHERE id = ${tenantId}
    `;
    return tenant;
  }

  // --- Users & Auth ---
  async findUserWithPasswordByEmail(email: string, tenantId?: string): Promise<UserWithCredentials | null> {
    const rows = await this.runSql`
      SELECT id, tenant_id, email, password_hash, full_name, phone, role, branch_id, is_active, mfa_enabled, created_at, updated_at
      FROM users
      WHERE LOWER(email) = LOWER(${email})
      LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      if (tenantId && r.tenant_id && r.tenant_id !== tenantId) {
        return null;
      }
      const user: User = {
        id: r.id,
        tenantId: r.tenant_id,
        email: r.email,
        fullName: r.full_name,
        phone: r.phone || undefined,
        role: r.role,
        branchId: r.branch_id,
        isActive: r.is_active,
        mfaEnabled: r.mfa_enabled,
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      };
      return { user, passwordHash: r.password_hash || "" };
    }

    // In-memory fallback
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        if (!tenantId || u.tenantId === tenantId || u.tenantId === null) {
          const hash = this.userPasswordHashes.get(u.id) || "";
          return { user: u, passwordHash: hash };
        }
      }
    }
    return null;
  }

  async findUserByEmail(email: string, tenantId?: string): Promise<User | null> {
    const res = await this.findUserWithPasswordByEmail(email, tenantId);
    return res ? res.user : null;
  }

  async getUser(id: string): Promise<User | null> {
    const rows = await this.runSql`
      SELECT id, tenant_id, email, full_name, phone, role, branch_id, is_active, mfa_enabled, created_at, updated_at
      FROM users
      WHERE id = ${id}
      LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        tenantId: r.tenant_id,
        email: r.email,
        fullName: r.full_name,
        phone: r.phone || undefined,
        role: r.role,
        branchId: r.branch_id,
        isActive: r.is_active,
        mfaEnabled: r.mfa_enabled,
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      };
    }
    return this.users.get(id) || null;
  }

  async createUser(user: User, passwordHash?: string): Promise<User> {
    this.users.set(user.id, user);
    if (passwordHash) {
      this.userPasswordHashes.set(user.id, passwordHash);
    }

    await this.runSql`
      INSERT INTO users (
        id, tenant_id, email, password_hash, full_name, phone, role, branch_id,
        is_active, mfa_enabled, created_at, updated_at
      )
      VALUES (
        ${user.id}, ${user.tenantId}, ${user.email}, ${passwordHash || null},
        ${user.fullName}, ${user.phone || null}, ${user.role}, ${user.branchId},
        ${user.isActive}, ${user.mfaEnabled}, ${user.createdAt}, ${user.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        phone = EXCLUDED.phone,
        role = EXCLUDED.role,
        updated_at = NOW()
    `;
    return user;
  }

  // --- Branches ---
  async listBranches(tenantId: string): Promise<Branch[]> {
    const rows = await this.runSql`
      SELECT * FROM branches
      WHERE tenant_id = ${tenantId} AND is_active = true
      ORDER BY name ASC
    `;
    if (rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        tenantId: r.tenant_id,
        name: r.name,
        code: r.code,
        address: r.address,
        city: r.city,
        region: r.region,
        country: r.country,
        phone: r.phone,
        isWarehouse: r.is_warehouse,
        isActive: r.is_active,
        createdAt: new Date(r.created_at),
      }));
    }
    return Array.from(this.branches.values()).filter((b) => b.tenantId === tenantId && b.isActive);
  }

  // --- Products & Catalog ---
  async listProducts(
    tenantId: string,
    filters?: { category?: string; query?: string; onlyPublished?: boolean }
  ): Promise<ProductListing[]> {
    return Array.from(this.products.values()).filter((p) => {
      if (p.tenantId !== tenantId) return false;
      if (filters?.onlyPublished !== false && !p.isPublished) return false;
      if (filters?.category && p.category !== filters.category) return false;
      if (filters?.query) {
        const q = filters.query.toLowerCase();
        const matchName = p.name.toLowerCase().includes(q);
        const matchBrand = p.brand.toLowerCase().includes(q);
        const matchModel = p.model.toLowerCase().includes(q);
        const matchTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchName && !matchBrand && !matchModel && !matchTag) return false;
      }
      return true;
    });
  }

  async getProduct(tenantId: string, idOrSlug: string): Promise<ProductListing | null> {
    for (const p of this.products.values()) {
      if (p.tenantId === tenantId && (p.id === idOrSlug || p.slug === idOrSlug)) {
        return p;
      }
    }
    return null;
  }

  async saveProduct(product: ProductListing): Promise<ProductListing> {
    this.products.set(product.id, product);
    return product;
  }

  // --- Compatibilities ---
  async listCompatibilities(tenantId?: string): Promise<ProductCompatibility[]> {
    return this.compatibilities;
  }

  // --- 3D Animation Packages ---
  async getAnimationPackage(id: string): Promise<AnimationPackage | null> {
    return this.animationPackages.get(id) || null;
  }

  async saveAnimationPackage(pkg: AnimationPackage): Promise<AnimationPackage> {
    this.animationPackages.set(pkg.id, pkg);
    return pkg;
  }

  // --- Inventory & Concurrency ---
  async getBranchInventory(tenantId: string, branchId: string, variantId: string): Promise<BranchInventory | null> {
    const rows = await this.runSql`
      SELECT * FROM branch_inventory
      WHERE tenant_id = ${tenantId} AND branch_id = ${branchId} AND variant_id = ${variantId}
      LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        tenantId: r.tenant_id,
        branchId: r.branch_id,
        variantId: r.variant_id,
        quantityOnHand: Number(r.quantity_on_hand),
        quantityReserved: Number(r.quantity_reserved),
        quantityAvailable: Number(r.quantity_available),
        reorderPoint: Number(r.reorder_point) || 5,
        reorderQuantity: Number(r.reorder_quantity) || 10,
        updatedAt: new Date(r.last_counted_at || Date.now()),
      };
    }

    const key = `${branchId}_${variantId}`;
    const inv = this.branchInventories.get(key);
    if (inv && inv.tenantId === tenantId) {
      return inv;
    }
    return null;
  }

  async listBranchInventory(tenantId: string, branchId?: string): Promise<BranchInventory[]> {
    const rows = branchId
      ? await this.runSql`SELECT * FROM branch_inventory WHERE tenant_id = ${tenantId} AND branch_id = ${branchId}`
      : await this.runSql`SELECT * FROM branch_inventory WHERE tenant_id = ${tenantId}`;

    if (rows.length > 0) {
      return rows.map((r: any) => ({
        id: r.id,
        tenantId: r.tenant_id,
        branchId: r.branch_id,
        variantId: r.variant_id,
        quantityOnHand: Number(r.quantity_on_hand),
        quantityReserved: Number(r.quantity_reserved),
        quantityAvailable: Number(r.quantity_available),
        reorderPoint: Number(r.reorder_point) || 5,
        reorderQuantity: Number(r.reorder_quantity) || 10,
        updatedAt: new Date(r.last_counted_at || Date.now()),
      }));
    }

    return Array.from(this.branchInventories.values()).filter(
      (i) => i.tenantId === tenantId && (!branchId || i.branchId === branchId)
    );
  }

  /**
   * Atomic row-level stock reservation on Neon PostgreSQL
   * Ensures that simultaneous attempts yield exactly 1 committed allocation and other attempts fail
   */
  async reserveStock(
    tenantId: string,
    branchId: string,
    variantId: string,
    quantity: number,
    orderId: string
  ): Promise<{ success: boolean; remainingAvailable: number }> {
    if (this.sql) {
      const rows = await this.runSql`
        UPDATE branch_inventory
        SET quantity_reserved = quantity_reserved + ${quantity},
            quantity_available = quantity_on_hand - (quantity_reserved + ${quantity})
        WHERE tenant_id = ${tenantId}
          AND branch_id = ${branchId}
          AND variant_id = ${variantId}
          AND (quantity_on_hand - quantity_reserved) >= ${quantity}
        RETURNING quantity_available, quantity_on_hand, quantity_reserved;
      `;

      if (rows.length > 0) {
        const avail = Number(rows[0].quantity_available);

        // Record durable ledger entry
        await this.runSql`
          INSERT INTO stock_ledger (
            id, tenant_id, branch_id, variant_id, movement_type,
            quantity_change, balance_after, reference_type, reference_id, created_at
          )
          VALUES (
            ${'ledg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)},
            ${tenantId}, ${branchId}, ${variantId}, 'RESERVATION_LOCK',
            ${-quantity}, ${avail}, 'ORDER_RESERVATION', ${orderId}, NOW()
          )
        `;

        const key = `${branchId}_${variantId}`;
        const inv = this.branchInventories.get(key);
        if (inv) {
          inv.quantityReserved = Number(rows[0].quantity_reserved);
          inv.quantityAvailable = avail;
        }

        return { success: true, remainingAvailable: avail };
      } else {
        const cur = await this.runSql`
          SELECT (quantity_on_hand - quantity_reserved) as avail
          FROM branch_inventory
          WHERE tenant_id = ${tenantId} AND branch_id = ${branchId} AND variant_id = ${variantId}
        `;
        const remaining = cur.length > 0 ? Number(cur[0].avail) : 0;
        return { success: false, remainingAvailable: Math.max(0, remaining) };
      }
    }

    // In-memory fallback
    const key = `${branchId}_${variantId}`;
    const inv = this.branchInventories.get(key);
    if (!inv || inv.tenantId !== tenantId) {
      return { success: false, remainingAvailable: 0 };
    }

    const available = inv.quantityOnHand - inv.quantityReserved;
    if (available < quantity) {
      return { success: false, remainingAvailable: available };
    }

    inv.quantityReserved += quantity;
    inv.quantityAvailable = inv.quantityOnHand - inv.quantityReserved;
    inv.updatedAt = new Date();
    this.branchInventories.set(key, inv);

    this.stockLedger.push({
      id: `ledg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      tenantId,
      branchId,
      variantId,
      movementType: "RESERVATION_LOCK",
      quantityChange: -quantity,
      balanceAfter: inv.quantityAvailable,
      referenceType: "ORDER_RESERVATION",
      referenceId: orderId,
      createdAt: new Date(),
    });

    return { success: true, remainingAvailable: inv.quantityAvailable };
  }

  async releaseStockReservation(
    tenantId: string,
    branchId: string,
    variantId: string,
    quantity: number,
    orderId: string
  ): Promise<void> {
    await this.runSql`
      UPDATE branch_inventory
      SET quantity_reserved = GREATEST(0, quantity_reserved - ${quantity}),
          quantity_available = quantity_on_hand - GREATEST(0, quantity_reserved - ${quantity})
      WHERE tenant_id = ${tenantId} AND branch_id = ${branchId} AND variant_id = ${variantId}
    `;
    await this.runSql`
      INSERT INTO stock_ledger (
        id, tenant_id, branch_id, variant_id, movement_type,
        quantity_change, balance_after, reference_type, reference_id, created_at
      )
      VALUES (
        ${'ledg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)},
        ${tenantId}, ${branchId}, ${variantId}, 'RESERVATION_RELEASE',
        ${quantity}, 0, 'ORDER_CANCELLATION', ${orderId}, NOW()
      )
    `;

    const key = `${branchId}_${variantId}`;
    const inv = this.branchInventories.get(key);
    if (inv && inv.tenantId === tenantId) {
      inv.quantityReserved = Math.max(0, inv.quantityReserved - quantity);
      inv.quantityAvailable = inv.quantityOnHand - inv.quantityReserved;
      inv.updatedAt = new Date();
      this.branchInventories.set(key, inv);
    }
  }

  async commitStockDeduction(
    tenantId: string,
    branchId: string,
    variantId: string,
    quantity: number,
    orderId: string
  ): Promise<void> {
    await this.runSql`
      UPDATE branch_inventory
      SET quantity_on_hand = GREATEST(0, quantity_on_hand - ${quantity}),
          quantity_reserved = GREATEST(0, quantity_reserved - ${quantity}),
          quantity_available = GREATEST(0, quantity_on_hand - ${quantity}) - GREATEST(0, quantity_reserved - ${quantity})
      WHERE tenant_id = ${tenantId} AND branch_id = ${branchId} AND variant_id = ${variantId}
    `;
    await this.runSql`
      INSERT INTO stock_ledger (
        id, tenant_id, branch_id, variant_id, movement_type,
        quantity_change, balance_after, reference_type, reference_id, created_at
      )
      VALUES (
        ${'ledg-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7)},
        ${tenantId}, ${branchId}, ${variantId}, 'SALE_ORDER',
        ${-quantity}, 0, 'ORDER_FULFILLMENT', ${orderId}, NOW()
      )
    `;

    const key = `${branchId}_${variantId}`;
    const inv = this.branchInventories.get(key);
    if (inv && inv.tenantId === tenantId) {
      inv.quantityOnHand = Math.max(0, inv.quantityOnHand - quantity);
      inv.quantityReserved = Math.max(0, inv.quantityReserved - quantity);
      inv.quantityAvailable = inv.quantityOnHand - inv.quantityReserved;
      inv.updatedAt = new Date();
      this.branchInventories.set(key, inv);
    }
  }

  // --- Orders ---
  async getOrder(tenantId: string, orderIdOrNumber: string): Promise<Order | null> {
    const rows = await this.runSql`
      SELECT * FROM orders
      WHERE tenant_id = ${tenantId} AND (id = ${orderIdOrNumber} OR order_number = ${orderIdOrNumber})
      LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      const itemRows = await this.runSql`
        SELECT * FROM order_items WHERE order_id = ${r.id}
      `;
      return {
        id: r.id,
        tenantId: r.tenant_id,
        orderNumber: r.order_number,
        customerId: r.customer_id,
        customerEmail: r.customer_email,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        channel: r.channel,
        branchId: r.branch_id,
        status: r.status,
        items: itemRows.map((it: any) => ({
          id: it.id || `item-${r.id}-${it.variant_id}`,
          orderId: r.id,
          variantId: it.variant_id,
          productId: it.product_id,
          name: it.name,
          sku: it.sku,
          unitPrice: Number(it.unit_price),
          quantity: Number(it.quantity),
          totalPrice: Number(it.total_price),
          discountAmount: Number(it.discount_amount) || 0,
          serialNumbers: Array.isArray(it.serial_numbers) ? it.serial_numbers : [],
        })),
        subtotal: Number(r.subtotal),
        discountTotal: Number(r.discount_total),
        taxTotal: Number(r.tax_total),
        deliveryFee: Number(r.delivery_fee),
        grandTotal: Number(r.grand_total),
        currency: r.currency,
        deliveryDetails: typeof r.delivery_details === "object" ? r.delivery_details : {},
        reservationExpiresAt: r.reservation_expires_at ? new Date(r.reservation_expires_at) : undefined,
        paidAt: r.paid_at ? new Date(r.paid_at) : undefined,
        notes: r.notes || undefined,
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      };
    }

    for (const o of this.orders.values()) {
      if (o.tenantId === tenantId && (o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber)) {
        return o;
      }
    }
    return null;
  }

  async listOrders(tenantId: string, customerId?: string): Promise<Order[]> {
    const rows = customerId
      ? await this.runSql`SELECT * FROM orders WHERE tenant_id = ${tenantId} AND customer_id = ${customerId} ORDER BY created_at DESC`
      : await this.runSql`SELECT * FROM orders WHERE tenant_id = ${tenantId} ORDER BY created_at DESC`;

    if (rows.length > 0) {
      const orders: Order[] = [];
      for (const r of rows) {
        const itemRows = await this.runSql`SELECT * FROM order_items WHERE order_id = ${r.id}`;
        orders.push({
          id: r.id,
          tenantId: r.tenant_id,
          orderNumber: r.order_number,
          customerId: r.customer_id,
          customerEmail: r.customer_email,
          customerName: r.customer_name,
          customerPhone: r.customer_phone,
          channel: r.channel,
          branchId: r.branch_id,
          status: r.status,
          items: itemRows.map((it: any) => ({
            id: it.id || `item-${r.id}-${it.variant_id}`,
            orderId: r.id,
            variantId: it.variant_id,
            productId: it.product_id,
            name: it.name,
            sku: it.sku,
            unitPrice: Number(it.unit_price),
            quantity: Number(it.quantity),
            totalPrice: Number(it.total_price),
            discountAmount: Number(it.discount_amount) || 0,
            serialNumbers: Array.isArray(it.serial_numbers) ? it.serial_numbers : [],
          })),
          subtotal: Number(r.subtotal),
          discountTotal: Number(r.discount_total),
          taxTotal: Number(r.tax_total),
          deliveryFee: Number(r.delivery_fee),
          grandTotal: Number(r.grand_total),
          currency: r.currency,
          deliveryDetails: typeof r.delivery_details === "object" ? r.delivery_details : {},
          reservationExpiresAt: r.reservation_expires_at ? new Date(r.reservation_expires_at) : undefined,
          paidAt: r.paid_at ? new Date(r.paid_at) : undefined,
          notes: r.notes || undefined,
          createdAt: new Date(r.created_at),
          updatedAt: new Date(r.updated_at),
        });
      }
      return orders;
    }

    return Array.from(this.orders.values()).filter(
      (o) => o.tenantId === tenantId && (!customerId || o.customerId === customerId)
    );
  }

  async saveOrder(order: Order): Promise<Order> {
    this.orders.set(order.id, order);

    await this.runSql`
      INSERT INTO orders (
        id, tenant_id, order_number, customer_id, customer_email, customer_name,
        customer_phone, channel, branch_id, status, subtotal, discount_total,
        tax_total, delivery_fee, grand_total, currency, notes, delivery_details,
        reservation_expires_at, paid_at, created_at, updated_at
      )
      VALUES (
        ${order.id}, ${order.tenantId}, ${order.orderNumber}, ${order.customerId || null},
        ${order.customerEmail}, ${order.customerName}, ${order.customerPhone},
        ${order.channel}, ${order.branchId || null}, ${order.status}, ${order.subtotal},
        ${order.discountTotal}, ${order.taxTotal}, ${order.deliveryFee}, ${order.grandTotal},
        ${order.currency}, ${order.notes || null}, ${JSON.stringify(order.deliveryDetails)},
        ${order.reservationExpiresAt || null}, ${order.paidAt || null},
        ${order.createdAt}, ${order.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        paid_at = EXCLUDED.paid_at,
        notes = EXCLUDED.notes,
        updated_at = NOW()
    `;

    for (const item of order.items) {
      const itemId = `item-${order.id}-${item.variantId}`;
      await this.runSql`
        INSERT INTO order_items (
          id, tenant_id, order_id, variant_id, product_id, name, sku,
          unit_price, quantity, total_price, discount_amount, serial_numbers
        )
        VALUES (
          ${itemId}, ${order.tenantId}, ${order.id}, ${item.variantId},
          ${item.productId}, ${item.name}, ${item.sku}, ${item.unitPrice},
          ${item.quantity}, ${item.totalPrice}, ${item.discountAmount},
          ${JSON.stringify(item.serialNumbers || [])}
        )
        ON CONFLICT (id) DO NOTHING
      `;
    }

    return order;
  }

  // --- Payments ---
  async createPaymentIntent(intent: PaymentIntent): Promise<PaymentIntent> {
    this.paymentIntents.set(intent.id, intent);
    await this.runSql`
      INSERT INTO payment_intents (
        id, tenant_id, order_id, reference, provider, amount, currency,
        status, payment_method, metadata, created_at, updated_at
      )
      VALUES (
        ${intent.id}, ${intent.tenantId}, ${intent.orderId}, ${intent.reference},
        ${intent.provider}, ${intent.amount}, ${intent.currency}, ${intent.status},
        ${intent.paymentMethod || null}, ${JSON.stringify(intent.metadata || {})},
        ${intent.createdAt}, ${intent.updatedAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        updated_at = NOW()
    `;
    return intent;
  }

  async getPaymentIntentByReference(reference: string): Promise<PaymentIntent | null> {
    const rows = await this.runSql`
      SELECT * FROM payment_intents WHERE reference = ${reference} LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        tenantId: r.tenant_id,
        orderId: r.order_id,
        reference: r.reference,
        provider: r.provider,
        amount: Number(r.amount),
        currency: r.currency,
        customerEmail: r.customer_email || "customer@example.gh",
        status: r.status,
        paymentMethod: r.payment_method || undefined,
        metadata: typeof r.metadata === "object" ? r.metadata : {},
        createdAt: new Date(r.created_at),
        updatedAt: new Date(r.updated_at),
      };
    }

    for (const p of this.paymentIntents.values()) {
      if (p.reference === reference) {
        return p;
      }
    }
    return null;
  }

  async updatePaymentIntent(intent: PaymentIntent): Promise<PaymentIntent> {
    this.paymentIntents.set(intent.id, intent);
    await this.runSql`
      UPDATE payment_intents
      SET status = ${intent.status},
          payment_method = ${intent.paymentMethod || null},
          metadata = ${JSON.stringify(intent.metadata || {})},
          updated_at = NOW()
      WHERE id = ${intent.id}
    `;
    return intent;
  }

  async recordPaymentEvent(event: PaymentWebhookEvent): Promise<PaymentWebhookEvent> {
    this.paymentEvents.push(event);
    await this.runSql`
      INSERT INTO payment_events (
        id, tenant_id, reference, event_type, payload, signature, is_processed, created_at
      )
      VALUES (
        ${event.id}, ${event.tenantId}, ${event.reference}, ${event.event},
        ${JSON.stringify(event.rawPayload)}, ${event.signature}, ${event.isProcessed},
        ${event.createdAt}
      )
      ON CONFLICT (id) DO NOTHING
    `;
    return event;
  }

  async hasProcessedWebhook(signature: string): Promise<boolean> {
    const rows = await this.runSql`
      SELECT 1 FROM payment_events WHERE signature = ${signature} AND is_processed = true LIMIT 1
    `;
    if (rows.length > 0) return true;
    return this.paymentEvents.some((e) => e.signature === signature && e.isProcessed);
  }

  // --- POS ---
  async getActiveShift(tenantId: string, branchId: string, userId: string): Promise<CashierShift | null> {
    for (const s of this.shifts.values()) {
      if (s.tenantId === tenantId && s.branchId === branchId && s.userId === userId && s.status === "OPEN") {
        return s;
      }
    }
    return null;
  }

  async saveShift(shift: CashierShift): Promise<CashierShift> {
    this.shifts.set(shift.id, shift);
    return shift;
  }

  async recordPosTransaction(tx: PosTransaction): Promise<PosTransaction> {
    this.posTransactions.set(tx.id, tx);
    return tx;
  }

  async listPosTransactions(tenantId: string, branchId?: string): Promise<PosTransaction[]> {
    return Array.from(this.posTransactions.values()).filter(
      (tx) => tx.tenantId === tenantId && (!branchId || tx.branchId === branchId)
    );
  }

  // --- After-Sales ---
  async getWarranty(tenantId: string, serialNumber: string): Promise<WarrantyRecord | null> {
    const rows = await this.runSql`
      SELECT * FROM warranties
      WHERE tenant_id = ${tenantId} AND serial_number = ${serialNumber}
      LIMIT 1
    `;
    if (rows.length > 0) {
      const r = rows[0];
      return {
        id: r.id,
        tenantId: r.tenant_id,
        orderId: r.order_id || undefined,
        posTransactionId: r.pos_transaction_id || undefined,
        productId: r.product_id || "prod-iphone-16-pro-max",
        variantId: r.variant_id,
        serialNumber: r.serial_number,
        customerName: r.customer_name,
        customerPhone: r.customer_phone,
        customerEmail: r.customer_email || "customer@example.gh",
        startDate: new Date(r.start_date),
        endDate: new Date(r.end_date),
        warrantyTerms: r.warranty_terms || "12 Months Comprehensive Limited Warranty",
        status: r.status,
      };
    }

    for (const w of this.warranties.values()) {
      if (w.tenantId === tenantId && w.serialNumber === serialNumber) {
        return w;
      }
    }
    return null;
  }

  async saveWarranty(warranty: WarrantyRecord): Promise<WarrantyRecord> {
    this.warranties.set(warranty.id, warranty);
    await this.runSql`
      INSERT INTO warranties (
        id, tenant_id, order_id, pos_transaction_id, product_id, variant_id,
        serial_number, customer_name, customer_phone, customer_email,
        start_date, end_date, warranty_terms, status
      )
      VALUES (
        ${warranty.id}, ${warranty.tenantId}, ${warranty.orderId || null},
        ${warranty.posTransactionId || null}, ${warranty.productId}, ${warranty.variantId},
        ${warranty.serialNumber}, ${warranty.customerName}, ${warranty.customerPhone},
        ${warranty.customerEmail}, ${warranty.startDate}, ${warranty.endDate},
        ${warranty.warrantyTerms}, ${warranty.status}
      )
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status
    `;
    return warranty;
  }

  async listRepairJobs(tenantId: string): Promise<RepairJobCard[]> {
    return Array.from(this.repairJobs.values()).filter((j) => j.tenantId === tenantId);
  }

  async saveRepairJob(job: RepairJobCard): Promise<RepairJobCard> {
    this.repairJobs.set(job.id, job);
    return job;
  }

  async saveTradeIn(tradeIn: TradeInValuation): Promise<TradeInValuation> {
    this.tradeIns.set(tradeIn.id, tradeIn);
    return tradeIn;
  }

  async listTradeIns(tenantId: string): Promise<TradeInValuation[]> {
    return Array.from(this.tradeIns.values()).filter((t) => t.tenantId === tenantId);
  }
}

// Global singleton repository instance
export const globalRepository = new MultiTenantRepository();
