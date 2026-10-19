import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Customer & Staff Login | The Gadget Master Ghana',
  description: 'Sign in to access order tracking, warranty certificates, and merchant portals at The Gadget Master Underbridge Mall East Legon showroom.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
