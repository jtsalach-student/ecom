import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@gcp/ui";

export const metadata: Metadata = {
  title: "GCP Retail Admin | The Gadget Master",
  description: "Unified POS, Multi-Branch Inventory, Order Fulfilment, and Electronics Repairs Dashboard.",
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
        {/* Anti-flash inline script to restore theme and cross-app parameters before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var urlParams = new URLSearchParams(window.location.search);
                  var urlTheme = urlParams.get('theme');
                  var saved = urlTheme || localStorage.getItem('gcp_theme_preference') || localStorage.getItem('gcp-storefront-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark) || (saved === 'system' && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  if (urlTheme) {
                    localStorage.setItem('gcp_theme_preference', urlTheme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased transition-colors duration-200">
        <ThemeProvider defaultTenantId="the-gadget-master-gh">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
