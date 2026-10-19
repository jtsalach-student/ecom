import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Device Not Found | The Gadget Master Ghana',
  description: 'The requested gadget page or catalogue item could not be found. Explore our authentic electronics catalogue or visit our East Legon showroom.',
};

export default function NotFound() {
  const popularCategories = [
    { name: 'Flagship Smartphones', href: '/#catalogue', icon: '📱' },
    { name: 'Computing & M-Series Mac', href: '/#catalogue', icon: '💻' },
    { name: 'Spatial Audio & Soundbars', href: '/#catalogue', icon: '🎧' },
    { name: 'Smart 4K TVs & Displays', href: '/#catalogue', icon: '📺' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
      <main className="max-w-2xl w-full text-center bg-slate-900/80 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md">
        {/* Visual 404 Badge */}
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/40 text-amber-400 text-3xl font-black mb-6 animate-pulse">
          404
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Page Not Found
        </h1>
        <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-md mx-auto">
          The link you followed may be broken or the product may have been relocated. Our full inventory of genuine devices is always accessible.
        </p>

        {/* Quick Category Internal Links */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
            Popular Product Categories
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            {popularCategories.map((cat) => (
              <Link
                key={cat.name}
                href={cat.href}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-amber-500/40 transition-all hover:-translate-y-0.5 group"
              >
                <span className="text-xl block mb-1">{cat.icon}</span>
                <span className="text-xs font-medium text-slate-300 group-hover:text-amber-400 transition-colors line-clamp-2">
                  {cat.name}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Main Navigation Actions */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20"
          >
            ← Return to Storefront
          </Link>
          <Link
            href="/faq"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
          >
            Browse FAQ
          </Link>
          <Link
            href="/#map-directions"
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-colors border border-slate-700"
          >
            📍 Find Showroom
          </Link>
        </div>
      </main>
    </div>
  );
}
