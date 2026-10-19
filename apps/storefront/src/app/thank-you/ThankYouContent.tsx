'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || `GM-${Math.floor(100000 + Math.random() * 900000)}`;
  const totalParam = searchParams.get('total');
  const itemsCount = searchParams.get('items') || '1';
  const customerName = searchParams.get('name') || 'Valued Customer';
  const paymentRef = searchParams.get('ref') || `PAY-${Date.now().toString(36).toUpperCase()}`;

  const formattedTotal = totalParam 
    ? `GH₵ ${Number(totalParam).toLocaleString('en-GH', { minimumFractionDigits: 2 })}`
    : 'GH₵ 31,500.00';

  const [copied, setCopied] = useState(false);

  const copyOrderRef = () => {
    navigator.clipboard.writeText(orderId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Gadget Master team, I just placed order #${orderId} for ${formattedTotal}. Please confirm my receipt and dispatch details.`
  );

  return (
    <main className="max-w-3xl mx-auto bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md">
      {/* Success Badge */}
      <div className="text-center pb-8 border-b border-slate-800">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
          <svg className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-full uppercase tracking-wider mb-2">
          Payment &amp; Reservation Verified
        </span>
        <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
          Thank You, {customerName}!
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
          Your order has been recorded in the Gadget Master central inventory ledger. We are preparing your authentic device for fulfillment.
        </p>
      </div>

      {/* Order Summary Card */}
      <div className="my-8 bg-slate-950/70 border border-slate-800/80 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800 text-sm">
          <div>
            <span className="text-xs text-slate-400 block">Order Reference</span>
            <span className="font-mono font-bold text-amber-400 text-base">{orderId}</span>
          </div>
          <button
            onClick={copyOrderRef}
            type="button"
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            {copied ? (
              <>
                <span className="text-emerald-400">✓</span> Copied to Clipboard
              </>
            ) : (
              <>
                <span>📋</span> Copy Order ID
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
          <div>
            <span className="text-slate-500 block text-xs">Total Amount</span>
            <span className="font-bold text-white text-base">{formattedTotal}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Items Count</span>
            <span className="font-medium text-slate-200">{itemsCount} product(s)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Payment Token</span>
            <span className="font-mono text-slate-300 truncate block text-xs">{paymentRef}</span>
          </div>
          <div>
            <span className="text-slate-500 block text-xs">Warranty Status</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span>🛡️</span> 1-Yr Official
            </span>
          </div>
        </div>
      </div>

      {/* Fulfillment Options & Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Option 1: Express Accra Delivery */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-2">
            <span>🛵</span>
            <h3>Express Doorstep Dispatch</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
            Orders within Accra, Tema, and Kasoa are dispatched via secure insured dispatch riders. Our delivery associate will call your mobile before arriving.
          </p>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>⏱️</span> Expected dispatch: <strong>2 - 4 hours</strong>
          </div>
        </div>

        {/* Option 2: Showroom Pickup */}
        <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-amber-500/20 p-5 rounded-2xl">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-base mb-2">
            <span>📍</span>
            <h3>East Legon Showroom Pickup</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
            Prefer to inspect and unbox in person? Visit our showroom at <strong>Underbridge Mall, Boundary Road, East Legon</strong>. Show this order ID at the collection counter.
          </p>
          <div className="text-xs text-slate-400 flex items-center gap-1">
            <span>⏰</span> Open Mon - Sat: <strong>8:30 AM – 8:00 PM</strong>
          </div>
        </div>
      </div>

      {/* Instant Action Buttons */}
      <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between gap-4 pt-6 border-t border-slate-800">
        <a
          href={`https://wa.me/233200147950?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-900/30 text-center"
        >
          <span>💬</span> Chat With Showroom on WhatsApp
        </a>

        <div className="flex items-center gap-3 justify-center">
          <Link
            href="/#map-directions"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition-colors border border-slate-700"
          >
            🗺️ Directions to Showroom
          </Link>
          <Link
            href="/"
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs sm:text-sm font-bold transition-all shadow-md shadow-amber-500/20"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
