import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://emmanueljosephdesign.github.io'),
  title: 'Emmanuel Folusho Joseph — Brand & Marketing Designer',
  description:
    'Portfolio of Emmanuel Folusho Joseph, a brand and marketing designer building distinctive visual identities and high-performing campaigns.',
  openGraph: {
    title: 'Emmanuel Folusho Joseph — Brand & Marketing Designer',
    description:
      'Portfolio of Emmanuel Folusho Joseph, a brand and marketing designer building distinctive visual identities and high-performing campaigns.',
    url: 'https://emmanueljosephdesign.github.io',
    siteName: 'Emmanuel Folusho Joseph Portfolio',
    images: [
      {
        url: '/og-image.jpg',
        width: 1024,
        height: 537,
        alt: 'Emmanuel Folusho Joseph — Brand & Marketing Designer',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Emmanuel Folusho Joseph — Brand & Marketing Designer',
    description:
      'Portfolio of Emmanuel Folusho Joseph, a brand and marketing designer building distinctive visual identities and high-performing campaigns.',
    creator: '@FoluJoseph',
    images: ['/og-image.jpg'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
