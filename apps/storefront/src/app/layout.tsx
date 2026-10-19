import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { ThemeProvider } from "../context/ThemeContext";

export const metadata: Metadata = {
  metadataBase: new URL('https://thegadgetmaster.online'),
  title: {
    default: "The Gadget Master | Genuine Electronics Showroom Accra",
    template: "%s | The Gadget Master",
  },
  description:
    "Accra's established electronics showroom at Underbridge Mall, East Legon. Authentic smartphones, computing, home audio, 4K televisions, and inverter climate control with verified store warranties.",
  keywords: [
    "Gadget Master",
    "electronics showroom Accra",
    "authentic iPhone Ghana",
    "MacBook Accra",
    "East Legon electronics",
    "Underbridge Mall gadgets",
    "1 year warranty Ghana",
    "genuine gadgets Accra",
  ],
  authors: [{ name: "The Gadget Master Ltd" }],
  creator: "The Gadget Master Ghana",
  openGraph: {
    type: "website",
    locale: "en_GH",
    url: "https://thegadgetmaster.online",
    siteName: "The Gadget Master",
    title: "The Gadget Master | Genuine Electronics Showroom Accra",
    description:
      "Accra's established electronics showroom at Underbridge Mall, East Legon. 100% genuine smartphones, laptops, home audio, and 4K displays with verified store warranties.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gadget Master | Genuine Electronics Showroom Accra",
    description:
      "Accra's established electronics showroom at Underbridge Mall, East Legon. 100% genuine electronics with verified store warranties.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Anti-flash inline script to restore theme before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var params = new URLSearchParams(window.location.search);
                  var urlTheme = params.get('theme');
                  var saved = urlTheme || localStorage.getItem('gcp_theme_preference') || localStorage.getItem('gcp-storefront-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark) || (saved === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen antialiased selection:bg-[#FF8A00] selection:text-white">
        <ThemeProvider defaultTenantId="the-gadget-master-gh">
          <CartProvider>
            {children}
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
