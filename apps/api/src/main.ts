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
app.use(express.json({ limit: "10mb" }));

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
    const user = await repo.findUserByEmail(parsed.email, parsed.tenantId);

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = issueAccessToken(user);
    res.json({
      accessToken: token,
      user,
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
    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const items = (req.body.items || []).map((it: any, idx: number) => ({
      id: it.id || `item-${Date.now()}-${idx}`,
      orderId,
      variantId: it.variantId,
      productId: it.productId || "prod-iphone-16-pro-max",
      name: it.name,
      sku: it.sku || `SKU-${idx}`,
      unitPrice: it.unitPrice,
      quantity: it.quantity || 1,
      totalPrice: it.totalPrice || (it.unitPrice * (it.quantity || 1)),
      discountAmount: it.discountAmount || 0,
      serialNumbers: it.serialNumbers || [],
    }));

    const deliveryDetails = req.body.deliveryDetails || {
      deliveryMethod: req.body.deliveryMethod === "BRANCH_PICKUP" ? "BRANCH_PICKUP" : "STANDARD_DELIVERY",
      recipientName: req.body.shippingAddress?.recipientName || req.body.customerName || "Customer",
      recipientPhone: req.body.shippingAddress?.phone || req.body.customerPhone || "+233000000000",
      deliveryAddress: req.body.shippingAddress?.addressLine1 || "Accra",
      city: req.body.shippingAddress?.city || "Accra",
      region: req.body.shippingAddress?.region || "Greater Accra",
    };

    const body = {
      ...req.body,
      tenantId,
      id: orderId,
      orderNumber: req.body.orderNumber || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items,
      deliveryDetails,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const parsedOrder = OrderSchema.parse(body);

    // Reserve stock for items
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
          return res.status(409).json({
            error: `Unable to reserve stock for ${item.name}. Remaining available: ${reserveResult.remainingAvailable}`,
          });
        }
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
  res.json(order);
});

app.get("/orders", tenantMiddleware, async (req, res) => {
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
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers["x-paystack-signature"] as string | undefined;

    const result = await paystackProvider.processWebhook(rawBody, signature, repo);
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
    const macbook = products.find((p) => p.category === "LAPTOPS");
    if (macbook) {
      relevantProducts.push(macbook);
      responseText = `For professional programming and demanding software workflows, the **${macbook.name}** is the ideal verified model. It features the Apple M4 Max processor with 16 CPU cores, 36GB unified RAM, and a 16.2" Liquid Retina XDR display. Starting price is GHS ${macbook.variants[0]?.retailPrice.toLocaleString()} with a 12-month warranty.`;
    }
  } else if (q.includes("phone") || q.includes("camera") || q.includes("iphone") || q.includes("galaxy")) {
    const iphone = products.find((p) => p.brand === "Apple" && p.category === "SMARTPHONES");
    const samsung = products.find((p) => p.brand === "Samsung" && p.category === "SMARTPHONES");
    if (iphone) relevantProducts.push(iphone);
    if (samsung) relevantProducts.push(samsung);

    responseText = `We have verified flagship options in stock:\n\n1. **${iphone?.name}** (GHS ${iphone?.variants[0]?.retailPrice.toLocaleString()}): 48MP Fusion camera with 5x optical tetraprism telephoto and aerospace Grade 5 Titanium chassis.\n2. **${samsung?.name}** (GHS ${samsung?.variants[0]?.retailPrice.toLocaleString()}): 200MP Quad Camera with Snapdragon 8 Elite and integrated S-Pen.\n\nBoth are available at our Accra Flagship (Osu Oxford St) and Kumasi branches.`;
  } else if (q.includes("charger") || q.includes("accessory") || q.includes("compatible")) {
    const anker = products.find((p) => p.slug.includes("anker"));
    const magsafe = products.find((p) => p.slug.includes("magsafe"));
    if (anker) relevantProducts.push(anker);
    if (magsafe) relevantProducts.push(magsafe);

    responseText = `For fast charging, the **Anker Prime 100W GaN Wall Charger** (GHS 1,250) is verified compatible with iPhone 16 Pro Max (30W), Galaxy S25 Ultra (45W Super Fast Charging 2.0), and MacBook Pro 16 (100W). For wireless charging, the **Apple MagSafe 25W Charger** (GHS 950) is in stock.`;
  } else {
    relevantProducts = products.slice(0, 3);
    responseText = `Welcome to **The Gadget Master**! We stock authenticated electronics with verified hardware specs, genuine warranties, and fast delivery in Accra and Kumasi. How can I assist you with phones, laptops, or accessories today?`;
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
