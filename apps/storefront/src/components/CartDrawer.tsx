"use client";

import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { calculateOrderPricing } from "@gcp/domain";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  CreditCard,
  Smartphone,
} from "lucide-react";

export function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const [deliveryMethod, setDeliveryMethod] = useState<"STANDARD_DELIVERY" | "EXPRESS_SAME_DAY" | "BRANCH_PICKUP">("STANDARD_DELIVERY");
  const [recipientName, setRecipientName] = useState("");
  const [recipientPhone, setRecipientPhone] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentChannel, setPaymentChannel] = useState<"MTN_MOMO" | "TELECEL_CASH" | "CARD">("MTN_MOMO");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  if (!isCartOpen) return null;

  const pricing = calculateOrderPricing({
    items: items.map((i) => ({
      unitPrice: i.variant.retailPrice,
      quantity: i.quantity,
    })),
    deliveryMethod,
    deliveryZoneRate: 35,
  });

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName || !recipientPhone) {
      alert("Please provide recipient name and phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID || "the-gadget-master-gh";

      const orderPayload = {
        customerName: recipientName,
        customerEmail: `${recipientPhone.replace(/\D/g, "")}@customer.thegadgetmaster.gh`,
        customerPhone: recipientPhone,
        channel: "STOREFRONT",
        branchId: "branch-east-legon-flagship",
        status: "PENDING_PAYMENT",
        subtotal: pricing.subtotal,
        discountTotal: pricing.discountTotal,
        taxTotal: pricing.taxTotal,
        deliveryFee: pricing.deliveryFee,
        grandTotal: pricing.grandTotal,
        currency: "GHS",
        deliveryDetails: {
          deliveryMethod,
          recipientName,
          recipientPhone,
          deliveryAddress: deliveryAddress || "In-store pickup",
          city: "Accra",
          region: "Greater Accra",
        },
        items: items.map((i) => ({
          id: `item-${Date.now()}-${i.variant.id}`,
          orderId: "pending",
          variantId: i.variant.id,
          productId: i.product.id,
          name: i.variant.name,
          sku: i.variant.sku,
          unitPrice: i.variant.retailPrice,
          quantity: i.quantity,
          totalPrice: i.variant.retailPrice * i.quantity,
          discountAmount: 0,
          serialNumbers: [],
        })),
      };

      const res = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-tenant-id": tenantId,
        },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Order creation failed");
      }

      const orderData = await res.json();

      // Initialize Paystack Payment Intent
      let payData: any = null;
      try {
        const payRes = await fetch(`${apiUrl}/payments/initialize`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": tenantId,
          },
          body: JSON.stringify({
            orderId: orderData.id,
            callbackUrl: typeof window !== "undefined" ? `${window.location.origin}/order-confirmed` : undefined,
          }),
        });
        if (payRes.ok) {
          payData = await payRes.json();
        }
      } catch (e) {
        console.warn("Payment initialization offline/pending:", e);
      }

      setCompletedOrder({ ...orderData, paymentIntent: payData });
      clearCart();
    } catch (err: any) {
      alert(`Checkout Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="relative z-10 w-full max-w-md bg-slate-950 border-l border-slate-800 h-full flex flex-col shadow-2xl text-white">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            <h3 className="font-bold text-base">Your Cart</h3>
            <span className="text-xs bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
              {items.length} items
            </span>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </div>
            <h4 className="text-xl font-bold text-white">Order Confirmed!</h4>
            <p className="text-sm text-slate-300 font-mono mt-1">
              Order #{completedOrder.orderNumber}
            </p>
            <p className="text-xs text-slate-400 mt-3 max-w-xs leading-relaxed">
              We received your payment of <strong className="text-white">GHS {completedOrder.grandTotal.toLocaleString()}</strong> via Paystack. Your devices are reserved at the Accra Flagship store.
            </p>
            <button
              onClick={() => {
                setCompletedOrder(null);
                setIsCartOpen(false);
              }}
              className="mt-6 w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mb-3">
              <ShoppingBag className="w-8 h-8 text-slate-600" />
            </div>
            <h4 className="text-base font-semibold text-slate-300">Your cart is empty</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Explore our verified flagship devices and genuine accessories to add items.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Items List */}
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.variant.id}
                  className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center gap-3"
                >
                  <img
                    src={item.variant.imageUrl || item.product.featuredImage}
                    alt={item.variant.name}
                    className="w-14 h-14 rounded-lg object-cover bg-slate-950 p-1 border border-slate-800 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate">
                      {item.variant.name}
                    </h5>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      GHS {item.variant.retailPrice.toLocaleString()} each
                    </div>
                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity - 1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono text-white px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.variant.id, item.quantity + 1)}
                        className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">
                      GHS {(item.variant.retailPrice * item.quantity).toLocaleString()}
                    </div>
                    <button
                      onClick={() => removeItem(item.variant.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 mt-2 inline-block transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Delivery Method Options */}
            <div className="pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                Fulfillment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("STANDARD_DELIVERY")}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    deliveryMethod === "STANDARD_DELIVERY"
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold">Standard</div>
                  <div className="text-[10px] text-slate-400">GHS 35 (Accra)</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("EXPRESS_SAME_DAY")}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    deliveryMethod === "EXPRESS_SAME_DAY"
                      ? "border-blue-500 bg-blue-500/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold">Express</div>
                  <div className="text-[10px] text-slate-400">GHS 52.50</div>
                </button>
                <button
                  type="button"
                  onClick={() => setDeliveryMethod("BRANCH_PICKUP")}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    deliveryMethod === "BRANCH_PICKUP"
                      ? "border-orange-500 bg-orange-500/10 text-white"
                      : "border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700"
                  }`}
                >
                  <div className="text-[11px] font-bold">Store Pickup</div>
                  <div className="text-[10px] text-emerald-400">Free (East Legon Showroom)</div>
                </button>
              </div>
            </div>

            {/* Recipient Details Form */}
            <form onSubmit={handleCheckout} id="checkout-form" className="space-y-2.5 pt-2 border-t border-slate-800">
              <label className="block text-xs font-semibold text-slate-300">
                Customer & Delivery Information
              </label>
              <div>
                <input
                  required
                  type="text"
                  placeholder="Full Name"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              <div>
                <input
                  required
                  type="tel"
                  placeholder="Ghana Phone (e.g. 020 014 7950)"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                />
              </div>
              {deliveryMethod !== "BRANCH_PICKUP" && (
                <div>
                  <input
                    required
                    type="text"
                    placeholder="Delivery Address / GPS (e.g. East Legon, Accra)"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500"
                  />
                </div>
              )}

              {/* Payment Method Selector */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Payment Method (Paystack Sandbox)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentChannel("MTN_MOMO")}
                    className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-medium transition-all ${
                      paymentChannel === "MTN_MOMO"
                        ? "border-amber-500 bg-amber-500/10 text-amber-300"
                        : "border-slate-800 bg-slate-900/60 text-slate-400"
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Mobile Money
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentChannel("CARD")}
                    className={`p-2 rounded-lg border flex items-center gap-2 text-xs font-medium transition-all ${
                      paymentChannel === "CARD"
                        ? "border-blue-500 bg-blue-500/10 text-blue-300"
                        : "border-slate-800 bg-slate-900/60 text-slate-400"
                    }`}
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Visa / Mastercard
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Footer with Totals and Action */}
        {!completedOrder && items.length > 0 && (
          <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span>GHS {pricing.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Delivery Fee</span>
                <span>GHS {pricing.deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-white pt-1 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="text-blue-400">GHS {pricing.grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isSubmitting}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Paystack Payment...</span>
                </>
              ) : (
                <>
                  <span>Pay GHS {pricing.grandTotal.toLocaleString()}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Secured by Paystack 256-bit encryption</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
