import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import ThankYouContent from './ThankYouContent';

export const metadata: Metadata = {
  title: 'Thank You for Your Order | The Gadget Master Ghana',
  description: 'Your authentic gadget order has been confirmed. View receipt details, East Legon showroom pickup instructions, and dispatch timeline.',
  robots: {
    index: false, // Prevent checkout confirmations from appearing in public search indexing
    follow: true,
  },
};

export default function ThankYouPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Internal Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="max-w-3xl mx-auto mb-8 text-xs sm:text-sm text-slate-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>🏠 Home</span>
            </Link>
          </li>
          <li><span>/</span></li>
          <li className="text-amber-400 font-semibold" aria-current="page">Order Confirmation</li>
        </ol>
      </nav>

      <Suspense fallback={
        <div className="max-w-3xl mx-auto p-12 text-center text-slate-400 bg-slate-900 border border-slate-800 rounded-2xl animate-pulse">
          Loading order details...
        </div>
      }>
        <ThankYouContent />
      </Suspense>
    </div>
  );
}
