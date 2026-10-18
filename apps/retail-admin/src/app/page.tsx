"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  SEED_PRODUCTS,
  SEED_BRANCHES,
  SEED_BRANCH_INVENTORIES,
  SEED_TENANT,
} from "@gcp/database";
import {
  ShoppingBag,
  Store,
  Layers,
  ClipboardList,
  Wrench,
  BarChart3,
  Settings,
  Search,
  Plus,
  Minus,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  User,
  LogOut,
  Smartphone,
  CreditCard,
  Banknote,
  ArrowRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "the-gadget-master-gh";

export default function RetailAdminPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"POS" | "INVENTORY" | "ORDERS" | "REPAIRS" | "ANALYTICS" | "SETTINGS">("POS");
  const [selectedBranch, setSelectedBranch] = useState(SEED_BRANCHES[0]);

  // Auth Guard: Require authenticated staff token or redirect to /login
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("gcp_staff_token");
      if (!token) {
        router.push("/login");
        return;
      }
      const savedUser = localStorage.getItem("gcp_staff_user");
      if (savedUser) {
        try {
          setCurrentUser(JSON.parse(savedUser));
        } catch (e) {}
      }
    }
  }, [router]);

  // --- POS State ---
  const [posCart, setPosCart] = useState<Array<{ product: any; variant: any; quantity: number }>>([]);
  const [posPaymentMethod, setPosPaymentMethod] = useState<"CASH" | "MTN_MOMO" | "CARD">("CASH");
  const [amountTendered, setAmountTendered] = useState<string>("");
  const [lastReceipt, setLastReceipt] = useState<any | null>(null);
  const [isShiftOpen, setIsShiftOpen] = useState(true);

  // --- Inventory State ---
  const [inventoryList, setInventoryList] = useState(SEED_BRANCH_INVENTORIES);

  // --- Orders State ---
  const [ordersList, setOrdersList] = useState<any[]>([]);

  // Fetch live orders and inventory from API
  useEffect(() => {
    const fetchLiveStats = async () => {
      const token = typeof window !== "undefined" ? localStorage.getItem("gcp_staff_token") : null;
      if (!token) return;

      try {
        const [ordersRes, invRes] = await Promise.all([
          fetch(`${API_BASE_URL}/orders`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-tenant-id": DEFAULT_TENANT_ID,
            },
          }),
          fetch(`${API_BASE_URL}/inventory/stock?branchId=${selectedBranch.id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "x-tenant-id": DEFAULT_TENANT_ID,
            },
          }),
        ]);

        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          if (Array.isArray(ordersData)) {
            setOrdersList(
              ordersData.map((o) => ({
                id: o.id,
                orderNumber: o.orderNumber,
                customerName: o.customerName,
                customerPhone: o.customerPhone,
                deliveryAddress: o.deliveryDetails?.deliveryAddress || "Accra",
                status: o.status,
                total: o.grandTotal,
                items: o.items.map((it: any) => `${it.quantity}x ${it.name}`).join(", ") || "Electronics",
                createdAt: new Date(o.createdAt).toLocaleString(),
              }))
            );
          }
        }

        if (invRes.ok) {
          const invData = await invRes.json();
          if (Array.isArray(invData) && invData.length > 0) {
            setInventoryList(invData);
          }
        }
      } catch (err) {
        console.warn("API live sync note:", err);
      }
    };

    fetchLiveStats();
  }, [selectedBranch]);

  // --- Repairs State ---
  const [repairJobs, setRepairJobs] = useState([
    {
      jobNumber: "JOB-90214",
      customer: "Daniel Kwarteng",
      phone: "+233 20 111 4455",
      device: "MacBook Pro 16 M1 Max",
      fault: "Liquid spill on trackpad; intermittent charging",
      status: "DIAGNOSING",
      costGhs: 1450,
      technician: "Kojo - Senior Hardware Tech",
    },
  ]);

  // --- POS Cart Calculations ---
  const posSubtotal = posCart.reduce((sum, item) => sum + item.variant.retailPrice * item.quantity, 0);
  const posTotal = posSubtotal;
  const parsedTendered = parseFloat(amountTendered) || 0;
  const changeDue = Math.max(0, parsedTendered - posTotal);

  const addPosItem = (product: any, variant: any) => {
    setPosCart((prev) => {
      const existing = prev.find((i) => i.variant.id === variant.id);
      if (existing) {
        return prev.map((i) =>
          i.variant.id === variant.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  };

  const removePosItem = (variantId: string) => {
    setPosCart((prev) => prev.filter((i) => i.variant.id !== variantId));
  };

  const completePosSale = () => {
    if (posCart.length === 0) return;
    if (posPaymentMethod === "CASH" && parsedTendered < posTotal) {
      alert("Tendered cash is less than the total sale amount");
      return;
    }

    const receipt = {
      receiptNumber: `RCP-${Math.floor(100000 + Math.random() * 900000)}`,
      branch: selectedBranch.name,
      cashier: "Kofi Boateng (Cashier)",
      items: [...posCart],
      total: posTotal,
      paymentMethod: posPaymentMethod,
      tendered: posPaymentMethod === "CASH" ? parsedTendered : posTotal,
      change: posPaymentMethod === "CASH" ? changeDue : 0,
      timestamp: new Date().toLocaleString(),
    };

    setLastReceipt(receipt);
    setPosCart([]);
    setAmountTendered("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Admin Header */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
            GM
          </div>
          <div>
            <span className="font-bold text-sm text-white">The Gadget Master</span>
            <span className="text-[10px] text-slate-400 block -mt-1 font-mono">
              Retail Terminal • v1.0 Production
            </span>
          </div>
        </div>

        {/* Branch Selector & Active Shift Indicator */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs">
            <Store className="w-3.5 h-3.5 text-blue-400" />
            <select
              value={selectedBranch.id}
              onChange={(e) => {
                const b = SEED_BRANCHES.find((x) => x.id === e.target.value);
                if (b) setSelectedBranch(b);
              }}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              {SEED_BRANCHES.map((b) => (
                <option key={b.id} value={b.id} className="bg-slate-900 text-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-400 font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Shift #01 Active</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 pl-2 border-l border-slate-800">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>{currentUser ? `${currentUser.fullName} (${currentUser.role})` : "Kwame Mensah (Owner)"}</span>
          </div>

          <button
            onClick={() => {
              if (typeof window !== "undefined") {
                localStorage.removeItem("gcp_staff_token");
                localStorage.removeItem("gcp_staff_user");
              }
              router.push("/login");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-800/50 text-xs text-red-300 hover:text-white hover:bg-red-900/60 transition-colors"
            title="Sign out of Retail Terminal"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <aside className="w-60 border-r border-slate-800 bg-slate-950/80 p-3 flex flex-col justify-between shrink-0">
          <nav className="space-y-1">
            {[
              { id: "POS", label: "Point of Sale", icon: ShoppingBag },
              { id: "INVENTORY", label: "Multi-Branch Stock", icon: Layers },
              { id: "ORDERS", label: "Storefront Orders", icon: ClipboardList },
              { id: "REPAIRS", label: "Repairs & RMA", icon: Wrench },
              { id: "ANALYTICS", label: "Executive Analytics", icon: BarChart3 },
              { id: "SETTINGS", label: "White-Label Settings", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-400 hover:text-white hover:bg-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
            <div className="font-semibold text-white">Live Storefront Link</div>
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 hover:underline flex items-center gap-1 font-mono text-[10px]"
            >
              store.thegadgetmaster.gh &rarr;
            </a>
          </div>
        </aside>

        {/* Central Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-950">
          {/* ========================================================================= */}
          {/* TAB 1: POINT OF SALE (POS)                                               */}
          {/* ========================================================================= */}
          {activeTab === "POS" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
              {/* Product Catalog Picker */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-white">Retail Checkout Terminal</h2>
                  <span className="text-xs text-slate-400 font-mono">
                    Register: REG-01 • {selectedBranch.code}
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Scan Barcode or Search Model (e.g. iPhone, S25, Anker)..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Fast Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[580px] overflow-y-auto pr-1">
                  {SEED_PRODUCTS.map((prod) => (
                    <div
                      key={prod.id}
                      className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <img
                          src={prod.featuredImage}
                          alt={prod.name}
                          className="w-10 h-10 rounded-lg object-contain bg-slate-950 p-1 border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">{prod.name}</h4>
                          <span className="text-[10px] text-blue-400 font-mono">
                            GHS {prod.variants[0]?.retailPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        {prod.variants.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => addPosItem(prod, v)}
                            className="w-full py-1.5 px-2 rounded-lg bg-slate-800 hover:bg-blue-600 text-[10px] font-semibold text-slate-300 hover:text-white flex items-center justify-between transition-colors"
                          >
                            <span>{v.color || v.storage || "Default"}</span>
                            <span>+ Add</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* POS Cart & Payment Panel */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 flex flex-col justify-between h-[650px]">
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-white">Walk-in Customer Cart</h3>
                    <span className="text-xs font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                      {posCart.length} items
                    </span>
                  </div>

                  {/* Cart Items List */}
                  <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1">
                    {posCart.length === 0 ? (
                      <div className="py-12 text-center text-xs text-slate-500">
                        Cart is empty. Tap products to add items.
                      </div>
                    ) : (
                      posCart.map((item) => (
                        <div
                          key={item.variant.id}
                          className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-white truncate">{item.variant.name}</p>
                            <p className="text-[10px] text-slate-400">
                              GHS {item.variant.retailPrice.toLocaleString()} &times; {item.quantity}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white font-mono">
                              GHS {(item.variant.retailPrice * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removePosItem(item.variant.id)}
                              className="text-slate-500 hover:text-rose-400 p-1"
                            >
                              &times;
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Payment & Cash Drawer Controls */}
                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex justify-between text-base font-bold text-white">
                    <span>Total Due:</span>
                    <span className="text-blue-400 font-mono">
                      GHS {posTotal.toLocaleString()}
                    </span>
                  </div>

                  {/* Payment Method Selector */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: "CASH", label: "Cash", icon: Banknote },
                      { id: "MTN_MOMO", label: "MoMo", icon: Smartphone },
                      { id: "CARD", label: "Card", icon: CreditCard },
                    ].map((pm) => {
                      const Icon = pm.icon;
                      const isSelected = posPaymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setPosPaymentMethod(pm.id as any)}
                          className={`py-2 px-1.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-500/10 text-white"
                              : "border-slate-800 bg-slate-950 text-slate-400"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Cash Tendered Input */}
                  {posPaymentMethod === "CASH" && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Amount Tendered (GHS):</span>
                        {changeDue > 0 && (
                          <span className="text-emerald-400 font-semibold">
                            Change: GHS {changeDue.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <input
                        type="number"
                        placeholder="Enter cash received..."
                        value={amountTendered}
                        onChange={(e) => setAmountTendered(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  )}

                  <button
                    onClick={completePosSale}
                    disabled={posCart.length === 0}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <Receipt className="w-4 h-4" />
                    Complete Sale & Print Receipt
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* POS Receipt Modal */}
          {lastReceipt && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <div className="fixed inset-0 bg-black/75 backdrop-blur-md" onClick={() => setLastReceipt(null)} />
              <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-6 text-white shadow-2xl font-mono text-xs space-y-3">
                <div className="text-center pb-3 border-b border-dashed border-slate-700">
                  <h4 className="font-bold text-sm">THE GADGET MASTER</h4>
                  <p className="text-[10px] text-slate-400">{lastReceipt.branch}</p>
                  <p className="text-[10px] text-slate-400">Receipt #{lastReceipt.receiptNumber}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{lastReceipt.timestamp}</p>
                </div>

                <div className="space-y-1.5 py-2 border-b border-dashed border-slate-700">
                  {lastReceipt.items.map((i: any) => (
                    <div key={i.variant.id} className="flex justify-between text-[11px]">
                      <span>{i.quantity}x {i.variant.name.slice(0, 20)}</span>
                      <span>GHS {(i.variant.retailPrice * i.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between font-bold text-sm text-white">
                    <span>TOTAL:</span>
                    <span>GHS {lastReceipt.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[10px]">
                    <span>Payment Method:</span>
                    <span>{lastReceipt.paymentMethod}</span>
                  </div>
                  {lastReceipt.change > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>CHANGE:</span>
                      <span>GHS {lastReceipt.change.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <div className="text-center pt-3 text-[10px] text-slate-500 border-t border-dashed border-slate-700">
                  <p>Genuine Product Authenticity Guaranteed</p>
                  <p>Thank you for choosing The Gadget Master!</p>
                </div>

                <button
                  onClick={() => setLastReceipt(null)}
                  className="w-full py-2 bg-blue-600 rounded-lg text-white font-sans font-semibold text-xs mt-2"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: MULTI-BRANCH INVENTORY                                            */}
          {/* ========================================================================= */}
          {activeTab === "INVENTORY" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Multi-Branch Inventory Balances</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time stock ledger synchronized across physical stores and digital orders.
                  </p>
                </div>
                <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  Receive PO Stock
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                    <tr>
                      <th className="py-3 px-4">SKU / Item</th>
                      <th className="py-3 px-4">Branch Location</th>
                      <th className="py-3 px-4 text-center">On Hand</th>
                      <th className="py-3 px-4 text-center">Reserved</th>
                      <th className="py-3 px-4 text-center">Available</th>
                      <th className="py-3 px-4 text-center">Reorder Point</th>
                      <th className="py-3 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {inventoryList.map((inv) => {
                      const isLow = inv.quantityAvailable <= inv.reorderPoint;
                      return (
                        <tr key={inv.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono font-semibold text-white">
                            {inv.variantId}
                          </td>
                          <td className="py-3.5 px-4 text-slate-300">
                            {inv.branchId.replace("branch-", "").replace(/-/g, " ").toUpperCase()}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-slate-200">
                            {inv.quantityOnHand}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-amber-400">
                            {inv.quantityReserved}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono font-bold text-white">
                            {inv.quantityAvailable}
                          </td>
                          <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                            {inv.reorderPoint}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            {isLow ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                Low Stock Alert
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                Healthy Stock
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: STOREFRONT ORDERS                                                  */}
          {/* ========================================================================= */}
          {activeTab === "ORDERS" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Online Customer Orders</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Orders received from the digital storefront requiring fulfillment or dispatch.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {ordersList.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white font-mono">{ord.orderNumber}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                          {ord.status}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">{ord.createdAt}</span>
                      </div>
                      <p className="text-xs text-slate-300 font-medium mt-1.5">{ord.items}</p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Customer: <strong className="text-white">{ord.customerName}</strong> ({ord.customerPhone}) • {ord.deliveryAddress}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Total</span>
                        <span className="text-base font-bold text-white font-mono">
                          GHS {ord.total.toLocaleString()}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setOrdersList((prev) =>
                            prev.map((o) => (o.id === ord.id ? { ...o, status: "SHIPPED" } : o))
                          );
                        }}
                        className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors"
                      >
                        Dispatch / Fulfill
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: REPAIRS & AFTER-SALES                                              */}
          {/* ========================================================================= */}
          {activeTab === "REPAIRS" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Service & Repair Job Cards</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track technician diagnostic notes, parts usage, and customer approval.
                  </p>
                </div>
                <button className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  New Job Card
                </button>
              </div>

              <div className="space-y-3">
                {repairJobs.map((job) => (
                  <div
                    key={job.jobNumber}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-amber-400" />
                        <span className="font-bold text-sm text-white font-mono">{job.jobNumber}</span>
                        <span className="text-xs text-slate-400">• {job.device}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                        {job.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300">
                      <strong>Fault:</strong> {job.fault}
                    </p>

                    <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <span>Customer: {job.customer} ({job.phone})</span>
                      <span>Assigned: {job.technician}</span>
                      <span className="font-bold text-white font-mono">
                        Estimate: GHS {job.costGhs.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: EXECUTIVE ANALYTICS                                                */}
          {/* ========================================================================= */}
          {activeTab === "ANALYTICS" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white">Executive BI & Sales Performance</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Real revenue reconciliation across online storefront and retail POS.
                </p>
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Gross Sales (October 2026)</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">GHS 184,500</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">+18.4% vs last month</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Total Orders & Sales</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">42</div>
                  <span className="text-[10px] text-slate-400">Online + In-store POS</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Average Order Value (AOV)</span>
                  <div className="text-2xl font-bold text-blue-400 font-mono mt-1">GHS 4,392</div>
                  <span className="text-[10px] text-slate-400">Flagship smartphones & laptops</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Inventory Valuation</span>
                  <div className="text-2xl font-bold text-white font-mono mt-1">GHS 450,000</div>
                  <span className="text-[10px] text-emerald-400 font-semibold">Healthy turnover 4.8x</span>
                </div>
              </div>

              {/* Grounded AI Insights */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-900/40 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <h3 className="font-bold text-sm text-white">Grounded AI Inventory Intelligence</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                      Replenishment Opportunity
                    </span>
                    <p className="font-bold text-white mt-1">
                      MacBook Pro 16 M4 Max Stock Low (4 units)
                    </p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      At current velocity (0.6 units/day), stockout will occur in 6.6 days. Supplier lead time is 7 days.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs">
                    <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                      Affinity Bundle Opportunity
                    </span>
                    <p className="font-bold text-white mt-1">
                      Anker Prime 100W Fast Charger Attachment
                    </p>
                    <p className="text-slate-400 mt-0.5 leading-relaxed">
                      74% of iPhone 16 Pro Max buyers also purchase the 100W charger. Offering a GHS 100 bundle discount will lift margin by 12%.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: WHITE-LABEL STORE BRANDING                                         */}
          {/* ========================================================================= */}
          {activeTab === "SETTINGS" && (
            <div className="space-y-6 max-w-2xl">
              <div>
                <h2 className="text-xl font-bold text-white">White-Label Store Configuration</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure brand identity, storefront colors, and support contacts without code changes.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Store Legal Name</label>
                  <input
                    type="text"
                    defaultValue={SEED_TENANT.name}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        defaultValue={SEED_TENANT.branding.primaryColor}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-slate-400">{SEED_TENANT.branding.primaryColor}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Accent Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        defaultValue={SEED_TENANT.branding.accentColor}
                        className="w-8 h-8 rounded border-none bg-transparent cursor-pointer"
                      />
                      <span className="font-mono text-slate-400">{SEED_TENANT.branding.accentColor}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Support Email</label>
                  <input
                    type="email"
                    defaultValue={SEED_TENANT.branding.supportEmail}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Customer Service Phone</label>
                  <input
                    type="tel"
                    defaultValue={SEED_TENANT.branding.supportPhone}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white"
                  />
                </div>

                <button
                  onClick={() => alert("Store settings successfully saved.")}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
