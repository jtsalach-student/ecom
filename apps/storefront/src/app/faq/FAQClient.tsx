'use client';

import { useState } from 'react';

interface FAQItem {
  id: string;
  category: 'authenticity' | 'delivery' | 'payment' | 'tradein' | 'warranty';
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'auth-1',
    category: 'authenticity',
    question: 'Are all products at The Gadget Master 100% brand new and genuine?',
    answer: 'Yes, absolutely. We have a zero-tolerance counterfeit policy. Every smartphone, laptop, TV, audio system, and appliance is 100% brand new in sealed original manufacturer packaging. You can verify IMEI and serial numbers directly with Apple, Microsoft, Sony, LG, and TCL upon inspection.',
  },
  {
    id: 'warranty-1',
    category: 'warranty',
    question: 'What warranty is included with my purchase?',
    answer: 'All brand new electronics come with our official 1-Year Gadget Master Warranty against manufacturer defects and hardware faults. In the rare event of an issue, we provide direct replacement or authorized service support at our East Legon showroom.',
  },
  {
    id: 'delivery-1',
    category: 'delivery',
    question: 'How fast do you deliver within Accra and outside Accra?',
    answer: 'Orders within Accra, Tema, and Kasoa are dispatched within 2 to 4 hours via insured express dispatch riders. Deliveries to Kumasi, Takoradi, Sunyani, Tamale, and other regions across Ghana take 24 to 48 hours via secure transit logistics.',
  },
  {
    id: 'delivery-2',
    category: 'delivery',
    question: 'Can I choose to pick up my order in person at the showroom?',
    answer: 'Yes! Select showroom pickup at checkout or simply place your reservation online. You can visit our Underbridge Mall showroom on Boundary Road, East Legon, test the device, inspect accessories, and complete payment on the spot.',
  },
  {
    id: 'payment-1',
    category: 'payment',
    question: 'What payment methods are supported on your platform and in-store?',
    answer: 'Online: We process payments securely via Paystack, supporting MTN Mobile Money, Telecel Cash, AirtelTigo Money, and Visa/Mastercard. In-Store: We accept Mobile Money, bank cards via POS terminal, bank transfers, and cash.',
  },
  {
    id: 'payment-2',
    category: 'payment',
    question: 'Is it safe to pay online via your website?',
    answer: 'Yes. Our platform uses 256-bit SSL/TLS encryption. All card and mobile money processing is handled directly by Paystack (PCI-DSS Level 1 certified). We never store your card numbers or PINs.',
  },
  {
    id: 'tradein-1',
    category: 'tradein',
    question: 'Do you offer device trade-ins and swaps?',
    answer: 'Yes, we accept trade-ins for iPhones, MacBooks, Samsung flagships, and high-end gaming laptops. Bring your device to our Underbridge Mall showroom for quick diagnostic grading, battery health assessment, and instant credit toward your new device.',
  },
  {
    id: 'warranty-2',
    category: 'warranty',
    question: 'What if my device has an issue during the first 7 days?',
    answer: 'We provide an instant 7-Day Hassle-Free Replacement Guarantee. If any manufacturing defect is discovered within 7 days of purchase, we replace the unit immediately upon showroom verification.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'authenticity', label: 'Authenticity' },
  { id: 'warranty', label: 'Warranty & Returns' },
  { id: 'delivery', label: 'Delivery & Pickup' },
  { id: 'payment', label: 'Payments & MoMo' },
  { id: 'tradein', label: 'Device Trade-In' },
];

export default function FAQClient() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'auth-1': true,
    'warranty-1': true,
  });

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = FAQ_ITEMS.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative max-w-xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search questions (e.g., warranty, delivery, MoMo, trade-in)..."
          className="w-full px-5 py-3.5 pl-11 rounded-2xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all shadow-inner"
        />
        <span className="absolute left-4 top-3.5 text-slate-500 text-base">🔍</span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-4 top-3.5 text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-0.5 rounded-full"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeCategory === cat.id
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3 pt-4">
        {filteredItems.length === 0 ? (
          <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-2xl text-slate-400 text-sm">
            <p>No questions matched your search &quot;{searchQuery}&quot;.</p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-3 text-amber-400 font-semibold underline text-xs"
            >
              Reset filters
            </button>
          </div>
        ) : (
          filteredItems.map((item) => {
            const isOpen = !!openItems[item.id];
            return (
              <div
                key={item.id}
                className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-200 hover:border-slate-700"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-semibold text-sm sm:text-base text-white focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="flex-1">{item.question}</span>
                  <span
                    className={`w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-xs text-amber-400 transform transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 bg-amber-500/20' : ''
                    }`}
                  >
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
