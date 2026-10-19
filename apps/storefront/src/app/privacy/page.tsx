import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy | The Gadget Master Ghana',
  description: 'Understand how The Gadget Master protects and manages your personal, order, and device warranty data under the Ghana Data Protection Act 2012 (Act 843).',
  openGraph: {
    title: 'Privacy Policy | The Gadget Master',
    description: 'Our commitment to data privacy, customer confidentiality, and secure device registration in Accra, Ghana.',
    url: 'https://thegadgetmaster.online/privacy',
  },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'October 19, 2026';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation for Internal Linking */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto mb-8 text-xs sm:text-sm text-slate-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>🏠 Home</span>
            </Link>
          </li>
          <li><span>/</span></li>
          <li className="text-amber-400 font-semibold" aria-current="page">Privacy Policy</li>
        </ol>
      </nav>

      <main className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-10 shadow-2xl backdrop-blur-sm">
        <header className="border-b border-slate-800 pb-6 mb-8">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            Ghana Data Protection Act 2012 (Act 843) Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Privacy &amp; Data Protection Policy
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Effective Date: {lastUpdated} • The Gadget Master Ltd (Underbridge Mall, East Legon, Accra)
          </p>
        </header>

        <div className="space-y-8 text-slate-300 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-amber-400">1.</span> Introduction &amp; Scope
            </h2>
            <p>
              Welcome to <strong>The Gadget Master</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate the premium retail electronics showroom located at Underbridge Mall, Boundary Road, East Legon, Accra, Ghana, and our digital flagship platform at{' '}
              <Link href="/" className="text-amber-400 hover:underline">thegadgetmaster.online</Link>.
            </p>
            <p className="mt-2">
              This Privacy Policy explains how we collect, process, disclose, and safeguard your personal information when you browse our catalogue, purchase smartphones, computing hardware, audio or home appliances, request trade-ins, or register device warranties.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-amber-400">2.</span> Information We Collect
            </h2>
            <p>We only collect the data necessary to verify orders, deliver authentic products, and honour manufacturer warranties:</p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li><strong>Contact &amp; Identification Data:</strong> Full name, telephone number (for SMS/WhatsApp delivery updates), and email address.</li>
              <li><strong>Delivery &amp; Pickup Details:</strong> Residential/office address, GhanaPost GPS digital address code, or selected Underbridge Mall pickup time.</li>
              <li><strong>Transaction &amp; Device Records:</strong> Order items, Paystack/card payment reference tokens (we never store raw credit card numbers or PINs), and hardware serial numbers/IMEIs for 1-Year Gadget Master Warranty tracking.</li>
              <li><strong>Diagnostic &amp; Trade-In Data:</strong> Battery health, exterior grading, and IMEI verification when you trade in pre-owned gadgets.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-amber-400">3.</span> How We Use Your Data
            </h2>
            <p>Your information is processed strictly for the following purposes:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-white text-sm mb-1">📦 Order Fulfillment &amp; Dispatch</h3>
                <p className="text-xs text-slate-400">To dispatch dispatch riders within Greater Accra or arrange courier shipping across Ghana, sending real-time tracking via WhatsApp/SMS.</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-white text-sm mb-1">🛡️ Official Warranty Verification</h3>
                <p className="text-xs text-slate-400">To validate serial numbers with Apple, Microsoft, Sony, and LG official warranty databases in case of hardware support.</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-white text-sm mb-1">🔒 Fraud Prevention &amp; Security</h3>
                <p className="text-xs text-slate-400">To protect buyers and prevent counterfeit or fraudulent transactions under Bank of Ghana electronic payment guidelines.</p>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <h3 className="font-semibold text-white text-sm mb-1">📞 Customer Care &amp; Support</h3>
                <p className="text-xs text-slate-400">To resolve technical inquiries, trade-in valuations, and after-sales service directly from our East Legon showroom team.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-amber-400">4.</span> Data Retention &amp; Security
            </h2>
            <p>
              We enforce multi-tenant isolation and strict role-based access control (RBAC). Customer data is encrypted in transit using TLS 1.3 and at rest with AES-256 standards. We never sell, rent, or monetize your customer records with third-party advertising brokers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-amber-400">5.</span> Your Rights Under Act 843
            </h2>
            <p>As a Ghanaian consumer, you retain full rights regarding your personal information, including:</p>
            <ul className="mt-2 list-disc list-inside space-y-1 text-slate-300 pl-2">
              <li>The right to request a digital export of all order and warranty records attached to your account.</li>
              <li>The right to rectify inaccurate contact numbers or delivery addresses.</li>
              <li>The right to opt-out of promotional marketing messages at any time.</li>
              <li>The right to request deletion of non-accounting historical records.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <span className="text-amber-400">6.</span> Contact Our Data Protection Officer
            </h2>
            <p>
              If you have any questions or data access requests regarding this policy, please visit or reach our compliance desk:
            </p>
            <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-200">
              <p className="font-semibold text-amber-400">The Gadget Master Data Protection Desk</p>
              <p className="text-xs sm:text-sm mt-1">📍 Showroom: Underbridge Mall, Boundary Road, East Legon, Accra, Ghana</p>
              <p className="text-xs sm:text-sm">📞 Phone / WhatsApp: <a href="tel:+233200147950" className="underline hover:text-amber-300">020 014 7950</a></p>
              <p className="text-xs sm:text-sm">✉️ Email: <a href="mailto:privacy@thegadgetmaster.online" className="underline hover:text-amber-300">privacy@thegadgetmaster.online</a></p>
            </div>
          </section>
        </div>

        {/* Back navigation & internal links */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all transform hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
          >
            ← Back to Storefront
          </Link>
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <Link href="/faq" className="hover:text-amber-400 underline">Frequently Asked Questions</Link>
            <Link href="/#map-directions" className="hover:text-amber-400 underline">Showroom Directions</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
