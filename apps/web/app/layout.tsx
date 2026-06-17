import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CarbonWise AI',
  description: 'A production-ready carbon footprint awareness platform with AI insights and sustainability tracking.',
};

export default function RootLayout({ children }: Readonly<{ children: Readonly<React.ReactNode> }>) {
  return (
    <html lang="en" className={`${plusJakarta.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

