import type { Metadata } from 'next';
import Link from 'next/link';
import FAQClient from './FAQClient';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions (FAQ) | The Gadget Master Ghana',
  description: 'Find answers about genuine warranty, same-day Accra delivery, Underbridge Mall East Legon showroom pickups, Paystack & MoMo payments, and device trade-ins.',
  openGraph: {
    title: 'Frequently Asked Questions | The Gadget Master Ghana',
    description: 'Everything you need to know about purchasing authentic electronics, warranties, and showroom visits in Accra.',
    url: 'https://thegadgetmaster.online/faq',
  },
};

export default function FAQPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'Are all products at The Gadget Master brand new and 100% genuine?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Yes. Every device at The Gadget Master is 100% brand new, factory sealed, and directly sourced from authorized international distributors. We provide verifiable serial numbers and official 1-year warranty coverage.'
        }
      },
      {
        '@type': 'Question',
        'name': 'Where is The Gadget Master showroom located in Accra?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Our showroom is located at Underbridge Mall, Boundary Road, East Legon, Accra, Ghana. We are open Monday to Saturday from 8:30 AM to 8:00 PM.'
        }
      },
      {
        '@type': 'Question',
        'name': 'What payment methods do you accept?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'We accept online payments via Paystack supporting MTN Mobile Money, Telecel Cash, AirtelTigo Money, and Visa/Mastercard debit and credit cards. In-store showroom payments can also be completed via POS terminal or cash.'
        }
      },
      {
        '@type': 'Question',
        'name': 'How fast is delivery within Greater Accra?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': 'Orders placed within Greater Accra are dispatched with insured express dispatch riders within 2 to 4 hours. Deliveries outside Accra across Ghana take 24 to 48 hours via VIP/STC secure transit.'
        }
      }
    ]
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema.org JSON-LD for Google rich snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Internal Navigation Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="max-w-4xl mx-auto mb-8 text-xs sm:text-sm text-slate-400">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <span>🏠 Home</span>
            </Link>
          </li>
          <li><span>/</span></li>
          <li className="text-amber-400 font-semibold" aria-current="page">FAQ</li>
        </ol>
      </nav>

      <main className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-3">
            Knowledge Base &amp; Customer Assistance
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Frequently Asked Questions
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
            Clear answers about our genuine stock, warranty protection, delivery timelines across Ghana, and our East Legon showroom.
          </p>
        </header>

        {/* Client interactive search & accordion component */}
        <FAQClient />

        {/* Footer Support Banner */}
        <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-amber-950/40 border border-amber-500/20 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6 shadow-xl">
          <div>
            <h3 className="text-lg font-bold text-white">Still have questions?</h3>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Speak directly with our technical sales specialists at the Underbridge Mall showroom.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://wa.me/233200147950?text=Hello%20Gadget%20Master%20team,%20I%20have%20an%20inquiry%20regarding%20products%20and%20warranty."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-lg shadow-emerald-900/30"
            >
              <span>💬</span> WhatsApp Support
            </a>
            <Link
              href="/#map-directions"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm transition-colors border border-slate-700 flex items-center gap-2"
            >
              <span>🗺️</span> View Showroom Map
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
