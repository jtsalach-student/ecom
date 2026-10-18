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

export class MultiTenantRepository {
  private tenants = new Map<string, Tenant>([[SEED_TENANT.id, SEED_TENANT]]);
  private users = new Map<string, User>(SEED_USERS.map((u) => [u.id, u]));
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

  // --- Tenants ---
  async getTenant(idOrSlug: string): Promise<Tenant | null> {
    for (const t of this.tenants.values()) {
      if (t.id === idOrSlug || t.slug === idOrSlug || t.primaryDomain === idOrSlug) {
        return t;
      }
    }
    return null;
  }

  async listTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async createTenant(tenant: Tenant): Promise<Tenant> {
    this.tenants.set(tenant.id, tenant);
    return tenant;
  }

  async updateTenantBranding(tenantId: string, branding: Partial<Tenant["branding"]>): Promise<Tenant> {
    const tenant = this.tenants.get(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);
    tenant.branding = { ...tenant.branding, ...branding };
    tenant.updatedAt = new Date();
    this.tenants.set(tenantId, tenant);
    return tenant;
  }

  // --- Users & Auth ---
  async findUserByEmail(email: string, tenantId?: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) {
        if (!tenantId || u.tenantId === tenantId || u.tenantId === null) {
          return u;
        }
      }
    }
    return null;
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async createUser(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  // --- Branches ---
  async listBranches(tenantId: string): Promise<Branch[]> {
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
    const key = `${branchId}_${variantId}`;
    const inv = this.branchInventories.get(key);
    if (inv && inv.tenantId === tenantId) {
      return inv;
    }
    return null;
  }

  async listBranchInventory(tenantId: string, branchId?: string): Promise<BranchInventory[]> {
    return Array.from(this.branchInventories.values()).filter(
      (i) => i.tenantId === tenantId && (!branchId || i.branchId === branchId)
    );
  }

  async reserveStock(
    tenantId: string,
    branchId: string,
    variantId: string,
    quantity: number,
    orderId: string
  ): Promise<{ success: boolean; remainingAvailable: number }> {
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

    // Record ledger entry
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
    const key = `${branchId}_${variantId}`;
    const inv = this.branchInventories.get(key);
    if (inv && inv.tenantId === tenantId) {
      inv.quantityReserved = Math.max(0, inv.quantityReserved - quantity);
      inv.quantityAvailable = inv.quantityOnHand - inv.quantityReserved;
      inv.updatedAt = new Date();
      this.branchInventories.set(key, inv);

      this.stockLedger.push({
        id: `ledg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        tenantId,
        branchId,
        variantId,
        movementType: "RESERVATION_RELEASE",
        quantityChange: quantity,
        balanceAfter: inv.quantityAvailable,
        referenceType: "ORDER_CANCELLATION",
        referenceId: orderId,
        createdAt: new Date(),
      });
    }
  }

  async commitStockDeduction(
    tenantId: string,
    branchId: string,
    variantId: string,
    quantity: number,
    orderId: string
  ): Promise<void> {
    const key = `${branchId}_${variantId}`;
    const inv = this.branchInventories.get(key);
    if (inv && inv.tenantId === tenantId) {
      inv.quantityOnHand = Math.max(0, inv.quantityOnHand - quantity);
      inv.quantityReserved = Math.max(0, inv.quantityReserved - quantity);
      inv.quantityAvailable = inv.quantityOnHand - inv.quantityReserved;
      inv.updatedAt = new Date();
      this.branchInventories.set(key, inv);

      this.stockLedger.push({
        id: `ledg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        tenantId,
        branchId,
        variantId,
        movementType: "SALE_ORDER",
        quantityChange: -quantity,
        balanceAfter: inv.quantityOnHand,
        referenceType: "ORDER_FULFILLMENT",
        referenceId: orderId,
        createdAt: new Date(),
      });
    }
  }

  // --- Orders ---
  async getOrder(tenantId: string, orderIdOrNumber: string): Promise<Order | null> {
    for (const o of this.orders.values()) {
      if (o.tenantId === tenantId && (o.id === orderIdOrNumber || o.orderNumber === orderIdOrNumber)) {
        return o;
      }
    }
    return null;
  }

  async listOrders(tenantId: string, customerId?: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (o) => o.tenantId === tenantId && (!customerId || o.customerId === customerId)
    );
  }

  async saveOrder(order: Order): Promise<Order> {
    this.orders.set(order.id, order);
    return order;
  }

  // --- Payments ---
  async createPaymentIntent(intent: PaymentIntent): Promise<PaymentIntent> {
    this.paymentIntents.set(intent.id, intent);
    return intent;
  }

  async getPaymentIntentByReference(reference: string): Promise<PaymentIntent | null> {
    for (const p of this.paymentIntents.values()) {
      if (p.reference === reference) {
        return p;
      }
    }
    return null;
  }

  async updatePaymentIntent(intent: PaymentIntent): Promise<PaymentIntent> {
    this.paymentIntents.set(intent.id, intent);
    return intent;
  }

  async recordPaymentEvent(event: PaymentWebhookEvent): Promise<PaymentWebhookEvent> {
    this.paymentEvents.push(event);
    return event;
  }

  async hasProcessedWebhook(signature: string): Promise<boolean> {
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
    for (const w of this.warranties.values()) {
      if (w.tenantId === tenantId && w.serialNumber === serialNumber) {
        return w;
      }
    }
    return null;
  }

  async saveWarranty(warranty: WarrantyRecord): Promise<WarrantyRecord> {
    this.warranties.set(warranty.id, warranty);
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
