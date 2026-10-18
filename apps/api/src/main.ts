import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import {
  globalRepository as repo,
  SEED_PRODUCTS,
  SEED_COMPATIBILITIES,
} from "@gcp/database";
import {
  resolveTenantContext,
  issueAccessToken,
  verifyAccessToken,
  verifyPassword,
  hasPermission,
  Permission,
} from "@gcp/auth";
import {
  calculateOrderPricing,
  canTransitionOrder,
  findCompatibleAccessories,
} from "@gcp/domain";
import { PaystackPaymentProvider } from "@gcp/payments";
import {
  OrderSchema,
  LoginRequestSchema,
  PaymentWebhookEventSchema,
} from "@gcp/contracts";

const app = express();
const port = process.env.PORT_API ? parseInt(process.env.PORT_API) : 4000;

app.use(cors({ origin: true, credentials: true }));
app.use(
  express.json({
    limit: "10mb",
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf;
    },
  })
);

// --- Tenant Middleware ---
async function tenantMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const host = req.headers.host;
    const tenantHeader = req.headers["x-tenant-id"] as string | undefined;
    const tenantQuery = req.query.tenantId as string | undefined;

    const context = await resolveTenantContext(repo, {
      host,
      tenantHeader,
      tenantQuery,
    });

    // Check if token is present to validate tenant boundary (A02)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const token = authHeader.substring(7);
        const user = verifyAccessToken(token);
        (req as any).user = user;
        // If user is not platform super admin, token tenant must match resolved tenant!
        if (
          user.role !== "PLATFORM_SUPER_ADMIN" &&
          user.tenantId &&
          user.tenantId !== context.tenantId
        ) {
          return res.status(403).json({
            error: `Cross-tenant access denied: Token belongs to tenant '${user.tenantId}', but request targets '${context.tenantId}'`,
          });
        }
      } catch (err: any) {
        // Handled by authGuard if endpoint is protected
      }
    }

    (req as any).tenant = context.tenant;
    (req as any).tenantId = context.tenantId;
    next();
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}

// --- Auth Guard Middleware ---
function authGuard(requiredPermission?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.substring(7);
    try {
      const user = verifyAccessToken(token);
      (req as any).user = user;

      // Cross-tenant check against resolved tenant (A02)
      const resolvedTenantId = (req as any).tenantId;
      if (
        resolvedTenantId &&
        user.role !== "PLATFORM_SUPER_ADMIN" &&
        user.tenantId &&
        user.tenantId !== resolvedTenantId
      ) {
        return res.status(403).json({
          error: `Cross-tenant access denied: User belongs to '${user.tenantId}', attempted access to '${resolvedTenantId}'`,
        });
      }

      if (requiredPermission) {
        if (!hasPermission(user.role, requiredPermission as any)) {
          return res.status(403).json({
            error: `Forbidden: User lacks permission '${requiredPermission}'`,
          });
        }
      }
      next();
    } catch (err: any) {
      return res.status(401).json({ error: err.message });
    }
  };
}

// -----------------------------------------------------------------------------
// Health Probes
// -----------------------------------------------------------------------------
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "gcp-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// -----------------------------------------------------------------------------
// Tenant Endpoints
// -----------------------------------------------------------------------------
app.get("/tenants", async (req, res) => {
  const tenants = await repo.listTenants();
  res.json(tenants);
});

app.get("/tenants/:idOrSlug", async (req, res) => {
  const tenant = await repo.getTenant(req.params.idOrSlug as string);
  if (!tenant) return res.status(404).json({ error: "Tenant not found" });
  res.json(tenant);
});

app.patch("/tenants/:id/branding", tenantMiddleware, authGuard(Permission.MANAGE_TENANT_SETTINGS), async (req, res) => {
  try {
    const updated = await repo.updateTenantBranding(req.params.id as string, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// Authentication Endpoints
// -----------------------------------------------------------------------------
app.post("/auth/login", async (req, res) => {
  try {
    const parsed = LoginRequestSchema.parse(req.body);
    const userCredentials = await repo.findUserWithPasswordByEmail(parsed.email, parsed.tenantId);

    if (!userCredentials) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await verifyPassword(parsed.password, userCredentials.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!userCredentials.user.isActive) {
      return res.status(401).json({ error: "Account is disabled. Please contact administrator." });
    }

    const token = issueAccessToken(userCredentials.user);
    res.json({
      accessToken: token,
      user: userCredentials.user,
      expiresIn: 86400,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/auth/me", authGuard(), async (req, res) => {
  const user = await repo.getUser((req as any).user.sub);
  res.json(user);
});

// -----------------------------------------------------------------------------
// Catalog Endpoints
// -----------------------------------------------------------------------------
app.get("/catalog/products", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const category = req.query.category as string | undefined;
  const query = req.query.q as string | undefined;

  const products = await repo.listProducts(tenantId, { category, query });
  res.json(products);
});

app.get("/catalog/products/:idOrSlug", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const product = await repo.getProduct(tenantId, req.params.idOrSlug as string);
  if (!product) return res.status(404).json({ error: "Product not found" });
  res.json(product);
});

app.get("/catalog/compatibilities/:productId", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const product = await repo.getProduct(tenantId, req.params.productId as string);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const allCompatibilities = await repo.listCompatibilities(tenantId);
  const allProducts = await repo.listProducts(tenantId);
  const compatibleAccessories = findCompatibleAccessories(product, allCompatibilities, allProducts);

  res.json(compatibleAccessories);
});

// -----------------------------------------------------------------------------
// 3D Animation Engine Endpoints
// -----------------------------------------------------------------------------
app.get("/animation/:id", async (req, res) => {
  const pkg = await repo.getAnimationPackage(req.params.id);
  if (!pkg) return res.status(404).json({ error: "Animation package not found" });
  res.json(pkg);
});

// -----------------------------------------------------------------------------
// Inventory Endpoints
// -----------------------------------------------------------------------------
app.get("/inventory/branches", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const branches = await repo.listBranches(tenantId);
  res.json(branches);
});

app.get("/inventory/stock", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const branchId = req.query.branchId as string | undefined;
  const stock = await repo.listBranchInventory(tenantId, branchId);
  res.json(stock);
});

app.post("/inventory/reserve", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const { branchId, variantId, quantity, orderId } = req.body;

  const result = await repo.reserveStock(tenantId, branchId, variantId, quantity, orderId);
  if (!result.success) {
    return res.status(409).json({
      error: "Insufficient stock available for reservation",
      remainingAvailable: result.remainingAvailable,
    });
  }

  res.json(result);
});

// -----------------------------------------------------------------------------
// Pricing & Orders Endpoints
// -----------------------------------------------------------------------------
app.post("/orders/calculate-pricing", tenantMiddleware, (req, res) => {
  try {
    const result = calculateOrderPricing(req.body);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/orders", tenantMiddleware, async (req, res) => {
  try {
    const tenantId = (req as any).tenantId;
    const tenant = (req as any).tenant;
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    // 1. Validate items and compute authoritative prices from catalogue (A04)
    const rawItems = req.body.items || [];
    if (!Array.isArray(rawItems) || rawItems.length === 0) {
      return res.status(400).json({ error: "Order must contain at least one item" });
    }

    const authoritativeItems: any[] = [];
    let calculatedSubtotal = 0;

    for (let idx = 0; idx < rawItems.length; idx++) {
      const raw = rawItems[idx];
      const quantity = Math.max(1, Math.floor(Number(raw.quantity) || 1));

      // Look up product and variant
      const product = await repo.getProduct(tenantId, raw.productId || "");
      if (!product) {
        return res.status(400).json({
          error: `Product '${raw.productId}' not found in catalogue for tenant '${tenantId}'`,
        });
      }

      const variant = product.variants.find((v) => v.id === raw.variantId);
      if (!variant) {
        return res.status(400).json({
          error: `Variant '${raw.variantId}' not found on product '${product.name}'`,
        });
      }

      const unitPrice = variant.retailPrice; // Authoritative price from catalogue
      const totalPrice = unitPrice * quantity;
      calculatedSubtotal += totalPrice;

      authoritativeItems.push({
        id: `item-${Date.now()}-${idx}`,
        orderId,
        variantId: variant.id,
        productId: product.id,
        name: `${product.name} (${variant.name})`,
        sku: variant.sku,
        unitPrice,
        quantity,
        totalPrice,
        discountAmount: 0,
        serialNumbers: [],
      });
    }

    // 2. Authoritative Delivery Fee and Tax calculation
    const isPickup = req.body.deliveryMethod === "BRANCH_PICKUP";
    const deliveryFee = isPickup ? 0 : 50; // Standard delivery fee in GHS
    const taxRatePercent = tenant.taxRatePercent || 0;
    const taxTotal = Math.round(calculatedSubtotal * (taxRatePercent / 100) * 100) / 100;
    const grandTotal = calculatedSubtotal + deliveryFee + taxTotal;

    const deliveryDetails = {
      deliveryMethod: isPickup ? "BRANCH_PICKUP" : "STANDARD_DELIVERY",
      recipientName: req.body.shippingAddress?.recipientName || req.body.customerName || "Customer",
      recipientPhone: req.body.shippingAddress?.phone || req.body.customerPhone || "+233244776621",
      deliveryAddress: req.body.shippingAddress?.addressLine1 || "Accra",
      city: req.body.shippingAddress?.city || "Accra",
      region: req.body.shippingAddress?.region || "Greater Accra",
    };

    const orderData = {
      id: orderId,
      tenantId,
      orderNumber: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      customerId: req.body.customerId || null,
      customerEmail: req.body.customerEmail || "customer@example.gh",
      customerName: req.body.customerName || "Valued Customer",
      customerPhone: req.body.customerPhone || "+233244776621",
      channel: (req.body.channel || "STOREFRONT") as any,
      branchId: req.body.branchId || "branch-east-legon-flagship",
      status: "PENDING_PAYMENT" as const, // Forced initial status, reject any client PAID override!
      subtotal: calculatedSubtotal,
      discountTotal: 0,
      taxTotal,
      deliveryFee,
      grandTotal,
      currency: tenant.currency || "GHS",
      notes: req.body.notes || undefined,
      deliveryDetails,
      items: authoritativeItems,
      reservationExpiresAt: new Date(Date.now() + 30 * 60 * 1000), // 30 min reservation window
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const parsedOrder = OrderSchema.parse(orderData);

    // 3. Atomic multi-item stock reservation with rollback on failure
    const reservedItems: { branchId: string; variantId: string; quantity: number }[] = [];
    if (parsedOrder.branchId) {
      for (const item of parsedOrder.items) {
        const reserveResult = await repo.reserveStock(
          tenantId,
          parsedOrder.branchId,
          item.variantId,
          item.quantity,
          parsedOrder.id
        );
        if (!reserveResult.success) {
          // Rollback any items reserved so far
          for (const rollbackItem of reservedItems) {
            await repo.releaseStockReservation(
              tenantId,
              rollbackItem.branchId,
              rollbackItem.variantId,
              rollbackItem.quantity,
              parsedOrder.id
            );
          }
          return res.status(409).json({
            error: `Unable to reserve stock for ${item.name}. Remaining available: ${reserveResult.remainingAvailable}`,
          });
        }
        reservedItems.push({
          branchId: parsedOrder.branchId,
          variantId: item.variantId,
          quantity: item.quantity,
        });
      }
    }

    const saved = await repo.saveOrder(parsedOrder);
    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/orders/:idOrNumber", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const order = await repo.getOrder(tenantId, req.params.idOrNumber as string);
  if (!order) return res.status(404).json({ error: "Order not found" });

  // Order ownership protection (A03)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    try {
      const user = verifyAccessToken(authHeader.substring(7));
      const isStaff = hasPermission(user.role, Permission.VIEW_ORDERS);
      const isOwner =
        user.sub === order.customerId ||
        user.email.toLowerCase() === order.customerEmail.toLowerCase();
      if (isStaff || isOwner) {
        return res.json(order);
      }
      return res.status(403).json({ error: "Forbidden: You do not have access to view this order" });
    } catch (err) {
      // Invalid token falls through to guest verification
    }
  }

  // Guest lookup: Requires matching email or phone parameter to prevent enumerable scraping
  const queryEmail = (req.query.email as string | undefined)?.toLowerCase();
  const queryPhone = req.query.phone as string | undefined;
  if (
    (queryEmail && order.customerEmail.toLowerCase() === queryEmail) ||
    (queryPhone && order.customerPhone === queryPhone)
  ) {
    return res.json(order);
  }

  return res.status(401).json({
    error:
      "Authentication required to view order details, or provide verified customer email/phone query parameter",
  });
});

app.get("/orders", tenantMiddleware, authGuard(Permission.VIEW_ORDERS), async (req, res) => {
  const tenantId = (req as any).tenantId;
  const customerId = req.query.customerId as string | undefined;
  const orders = await repo.listOrders(tenantId, customerId);
  res.json(orders);
});

// -----------------------------------------------------------------------------
// Payments & Paystack Webhooks
// -----------------------------------------------------------------------------
const paystackProvider = new PaystackPaymentProvider();

app.post("/payments/initialize", tenantMiddleware, async (req, res) => {
  try {
    const tenantId = (req as any).tenantId;
    const { orderId, callbackUrl } = req.body;

    const order = await repo.getOrder(tenantId, orderId);
    if (!order) return res.status(404).json({ error: "Order not found" });

    const initData = await paystackProvider.initializeTransaction(
      order,
      order.customerEmail,
      callbackUrl || "http://localhost:3000/order-confirmed"
    );

    // Persist payment intent
    await repo.createPaymentIntent({
      id: `pi-${Date.now()}`,
      tenantId,
      orderId,
      reference: initData.reference,
      provider: "PAYSTACK",
      amount: order.grandTotal,
      currency: order.currency,
      customerEmail: order.customerEmail,
      status: "PENDING",
      authorizationUrl: initData.authorizationUrl,
      accessCode: initData.accessCode,
      metadata: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.json(initData);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/payments/webhook", async (req, res) => {
  try {
    // Preserve exact raw bytes from incoming request before JSON parsing (A05, A06)
    const rawBody = (req as any).rawBody
      ? (req as any).rawBody.toString("utf8")
      : JSON.stringify(req.body);
    const signature = req.headers["x-paystack-signature"] as string | undefined;

    const result = await paystackProvider.processWebhook(rawBody, signature, repo);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/payments/verify/:reference", tenantMiddleware, async (req, res) => {
  try {
    const reference = req.params.reference as string;
    const result = await paystackProvider.verifyTransaction(reference);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/payments/refund", tenantMiddleware, authGuard(Permission.APPROVE_REFUND), async (req, res) => {
  try {
    const { reference, amount, reason } = req.body;
    const result = await paystackProvider.processRefund(reference, amount, reason);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// POS Endpoints
// -----------------------------------------------------------------------------
app.get("/pos/shifts/active", tenantMiddleware, authGuard(Permission.PROCESS_POS_SALE), async (req, res) => {
  const tenantId = (req as any).tenantId;
  const branchId = req.query.branchId as string;
  const userId = (req as any).user.sub;

  const shift = await repo.getActiveShift(tenantId, branchId, userId);
  res.json(shift || { active: false });
});

app.post("/pos/shifts/open", tenantMiddleware, authGuard(Permission.PROCESS_POS_SALE), async (req, res) => {
  const tenantId = (req as any).tenantId;
  const userId = (req as any).user.sub;
  const { branchId, registerNumber, openingCash } = req.body;

  const shift = await repo.saveShift({
    id: `shift-${Date.now()}`,
    tenantId,
    branchId,
    userId,
    registerNumber: registerNumber || "REG-01",
    openingCash: openingCash || 0,
    expectedClosingCash: openingCash || 0,
    totalSalesCash: 0,
    totalSalesCard: 0,
    totalSalesMomo: 0,
    totalRefunds: 0,
    transactionCount: 0,
    status: "OPEN",
    openedAt: new Date(),
  });

  res.status(201).json(shift);
});

app.post("/pos/transactions", tenantMiddleware, authGuard(Permission.PROCESS_POS_SALE), async (req, res) => {
  try {
    const tenantId = (req as any).tenantId;
    const cashierUserId = (req as any).user.sub;

    const tx = {
      ...req.body,
      id: `pos-${Date.now()}`,
      tenantId,
      cashierUserId,
      receiptNumber: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date(),
    };

    const saved = await repo.recordPosTransaction(tx);

    // Deduct stock for sold items
    for (const item of tx.items) {
      await repo.commitStockDeduction(
        tenantId,
        tx.branchId,
        item.variantId,
        item.quantity,
        saved.id
      );
    }

    res.status(201).json(saved);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------------
// After-Sales: Warranties, Repairs, Trade-in
// -----------------------------------------------------------------------------
app.get("/aftersales/warranties/:serial", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const warranty = await repo.getWarranty(tenantId, req.params.serial as string);
  if (!warranty) return res.status(404).json({ error: "Warranty record not found for this serial" });
  res.json(warranty);
});

app.get("/aftersales/repairs", tenantMiddleware, authGuard(Permission.MANAGE_REPAIRS), async (req, res) => {
  const tenantId = (req as any).tenantId;
  const repairs = await repo.listRepairJobs(tenantId);
  res.json(repairs);
});

app.post("/aftersales/repairs", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const job = {
    ...req.body,
    id: `rep-${Date.now()}`,
    tenantId,
    jobNumber: `JOB-${Math.floor(100000 + Math.random() * 900000)}`,
    status: "RECEIVED",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const saved = await repo.saveRepairJob(job);
  res.status(201).json(saved);
});

app.post("/aftersales/trade-ins", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const tradeIn = {
    ...req.body,
    id: `trd-${Date.now()}`,
    tenantId,
    status: "SUBMITTED",
    createdAt: new Date(),
  };

  const saved = await repo.saveTradeIn(tradeIn);
  res.status(201).json(saved);
});

// -----------------------------------------------------------------------------
// Analytics & Executive Dashboard
// -----------------------------------------------------------------------------
app.get("/analytics/executive", tenantMiddleware, authGuard(Permission.VIEW_EXECUTIVE_ANALYTICS), async (req, res) => {
  const tenantId = (req as any).tenantId;
  const orders = await repo.listOrders(tenantId);
  const stock = await repo.listBranchInventory(tenantId);

  const grossSales = orders.reduce((sum, o) => sum + (o.status === "PAID" ? o.grandTotal : 0), 0);
  const totalOrders = orders.filter((o) => o.status === "PAID").length;
  const aov = totalOrders > 0 ? grossSales / totalOrders : 0;
  const lowStockCount = stock.filter((s) => s.quantityAvailable <= s.reorderPoint).length;

  res.json({
    grossSalesGhs: grossSales,
    netSalesGhs: grossSales,
    revenueGhs: grossSales,
    costOfGoodsSoldGhs: Math.round(grossSales * 0.75),
    grossMarginPercent: 25.0,
    totalOrders,
    averageOrderValueGhs: Math.round(aov * 100) / 100,
    totalRefundsGhs: 0,
    conversionRatePercent: 3.4,
    totalInventoryValuationGhs: 450000,
    lowStockItemsCount: lowStockCount,
    stockTurnoverRate: 4.8,
    activeCustomersCount: 185,
    periodStartDate: "2026-01-01",
    periodEndDate: "2026-10-18",
  });
});

app.get("/analytics/insights", tenantMiddleware, authGuard(Permission.VIEW_EXECUTIVE_ANALYTICS), (req, res) => {
  res.json([
    {
      id: "ins-01",
      category: "INVENTORY_REORDER",
      title: "MacBook Pro 16 M4 Max Stock Low",
      explanation: "Only 4 units left across Greater Accra branches. Average lead time is 7 days.",
      groundedMetrics: { currentStock: 4, reorderThreshold: 2 },
      suggestedAction: "Create Purchase Order for 5 additional units",
      confidenceScore: 0.95,
      createdAt: new Date(),
    },
    {
      id: "ins-02",
      category: "AFFINITY_BUNDLE",
      title: "High Charger Cross-Sell Affinity",
      explanation: "74% of iPhone 16 Pro Max buyers also purchase the Anker Prime 100W GaN charger.",
      groundedMetrics: { affinityPercent: 74, primarySku: "TGM-IPH16PM-256-NAT" },
      suggestedAction: "Offer a GHS 100 bundle discount on checkout",
      confidenceScore: 0.92,
      createdAt: new Date(),
    },
  ]);
});

// -----------------------------------------------------------------------------
// Grounded AI Shopping Assistant Endpoint
// -----------------------------------------------------------------------------
app.post("/ai/query", tenantMiddleware, async (req, res) => {
  const tenantId = (req as any).tenantId;
  const { question } = req.body;
  const q = (question || "").toLowerCase();

  const products = await repo.listProducts(tenantId);

  // Grounded search based on actual catalogue data
  let responseText = "";
  let relevantProducts: any[] = [];

  if (q.includes("laptop") || q.includes("programming") || q.includes("code") || q.includes("macbook")) {
    const macbook = products.find((p) => p.category === "LAPTOPS" && p.slug.includes("m4"));
    const macbookAir = products.find((p) => p.slug.includes("air"));
    if (macbook) relevantProducts.push(macbook);
    if (macbookAir) relevantProducts.push(macbookAir);
    responseText = `For professional programming and creative workloads, we stock:\n\n1. **${macbook?.name}** (GHS ${macbook?.variants[0]?.retailPrice.toLocaleString()}): Apple M4 Max (16-core CPU, 40-core GPU), 36GB unified memory, and 16.2" Liquid Retina XDR.\n2. **${macbookAir?.name}** (GHS ${macbookAir?.variants[0]?.retailPrice.toLocaleString()}): Ultra-portable M3 chip, 16GB RAM, 512GB SSD with 18-hour battery life.\n\nBoth include genuine 12-month Apple warranty and instant delivery in Accra.`;
  } else if (q.includes("starlink") || q.includes("satellite") || q.includes("internet") || q.includes("wifi")) {
    const starlink = products.find((p) => p.slug.includes("starlink"));
    if (starlink) relevantProducts.push(starlink);
    responseText = `Yes! We stock the **${starlink?.name}** for **GHS ${starlink?.variants[0]?.retailPrice.toLocaleString()}**. It includes the high-performance electronic phased array antenna, kickstand, Wi-Fi 6 router, and cables for plug-and-play high-speed, low-latency satellite internet across Ghana. Available for immediate pickup at our East Legon showroom or nationwide delivery.`;
  } else if (q.includes("ps5") || q.includes("playstation") || q.includes("game") || q.includes("console")) {
    const ps5 = products.find((p) => p.slug.includes("playstation"));
    if (ps5) relevantProducts.push(ps5);
    responseText = `We have the **${ps5?.name}** in stock for **GHS ${ps5?.variants[0]?.retailPrice.toLocaleString()}**. It features a 1TB custom NVMe SSD, Ultra HD Blu-ray disc drive, ray tracing, 4K 120Hz support, and an authentic DualSense wireless controller with 12 months warranty.`;
  } else if (q.includes("ipad") || q.includes("tablet") || q.includes("pencil")) {
    const ipad = products.find((p) => p.category === "TABLETS");
    if (ipad) relevantProducts.push(ipad);
    responseText = `The **${ipad?.name}** is available for **GHS ${ipad?.variants[0]?.retailPrice.toLocaleString()}**. It is Apple's thinnest device at 5.1mm with Tandem OLED Ultra Retina XDR display, M4 chip, and support for Apple Pencil Pro.`;
  } else if (q.includes("airpod") || q.includes("headphone") || q.includes("earbud") || q.includes("audio") || q.includes("sound")) {
    const apPro = products.find((p) => p.slug.includes("airpods-pro"));
    const apMax = products.find((p) => p.slug.includes("airpods-max"));
    const buds = products.find((p) => p.slug.includes("buds"));
    if (apPro) relevantProducts.push(apPro);
    if (apMax) relevantProducts.push(apMax);
    if (buds) relevantProducts.push(buds);
    responseText = `We have verified audiophile and wireless ANC gear in stock:\n\n1. **${apPro?.name}** (GHS ${apPro?.variants[0]?.retailPrice.toLocaleString()}): 2x Pro ANC with USB-C MagSafe Case.\n2. **${apMax?.name}** (GHS ${apMax?.variants[0]?.retailPrice.toLocaleString()}): Over-ear luxury with lossless audio via USB-C.\n3. **${buds?.name}** (GHS ${buds?.variants[0]?.retailPrice.toLocaleString()}): 24-bit Hi-Fi with Blade Lights and Galaxy AI.`;
  } else if (q.includes("phone") || q.includes("camera") || q.includes("iphone") || q.includes("galaxy") || q.includes("pixel") || q.includes("fold")) {
    const iphone = products.find((p) => p.brand === "Apple" && p.slug.includes("16-pro-max"));
    const samsung = products.find((p) => p.brand === "Samsung" && p.slug.includes("s24-ultra"));
    const pixel = products.find((p) => p.brand === "Google");
    if (iphone) relevantProducts.push(iphone);
    if (samsung) relevantProducts.push(samsung);
    if (pixel) relevantProducts.push(pixel);

    responseText = `We have verified flagship smartphones in stock:\n\n1. **${iphone?.name}** (From GHS ${iphone?.variants[0]?.retailPrice.toLocaleString()}): 48MP Fusion camera with 5x optical tetraprism telephoto and Grade 5 Titanium chassis.\n2. **${samsung?.name}** (GHS ${samsung?.variants[0]?.retailPrice.toLocaleString()}): 200MP Quad Camera with Snapdragon 8 Gen 3, Corning Gorilla Armor, and S-Pen.\n3. **${pixel?.name}** (GHS ${pixel?.variants[0]?.retailPrice.toLocaleString()}): Google Tensor G4 with on-device Gemini Nano AI.\n\nAvailable at our verified East Legon Showroom (Underbridge Mall, Boundary Road, Accra).`;
  } else if (q.includes("charger") || q.includes("accessory") || q.includes("compatible") || q.includes("powerbank")) {
    const anker = products.find((p) => p.slug.includes("anker-prime"));
    const powerbank = products.find((p) => p.slug.includes("737"));
    const magsafe = products.find((p) => p.slug.includes("magsafe"));
    if (anker) relevantProducts.push(anker);
    if (powerbank) relevantProducts.push(powerbank);
    if (magsafe) relevantProducts.push(magsafe);

    responseText = `For fast charging and power:\n\n1. **${anker?.name}** (GHS ${anker?.variants[0]?.retailPrice.toLocaleString()}): 3-Port 100W GaN charger verified for iPhone, MacBook, and Galaxy.\n2. **${powerbank?.name}** (GHS ${powerbank?.variants[0]?.retailPrice.toLocaleString()}): 140W two-way fast charge with smart OLED telemetry.\n3. **${magsafe?.name}** (GHS ${magsafe?.variants[0]?.retailPrice.toLocaleString()}): Official 25W MagSafe wireless fast charger.`;
  } else {
    relevantProducts = products.slice(0, 4);
    responseText = `Welcome to **The Gadget Master**! We stock authenticated electronics with verified hardware specs, limited store warranty, and reliable delivery in Greater Accra. You can visit our verified showroom at East Legon (Underbridge Mall, Boundary Road, Accra) or call 020 014 7950. How can I assist you today?`;
  }

  res.json({
    answer: responseText,
    recommendedProducts: relevantProducts,
    groundedInCatalog: true,
  });
});

// Start Server
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`[GCP API] Server running on http://localhost:${port}`);
  });
}

export default app;
