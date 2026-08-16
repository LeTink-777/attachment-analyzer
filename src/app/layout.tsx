import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Sans, IBM_Plex_Serif } from 'next/font/google';
import './globals.css';
import { SITE } from '@/lib/content';

const display = IBM_Plex_Sans({
  weight: ['400','600','700'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-plexsans',
  display: 'swap',
});

const body = IBM_Plex_Serif({
  weight: ['400','600'],
  subsets: ['latin', 'cyrillic'],
  variable: '--font-plexserif',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || SITE.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Тип привязанности по переписке — определи онлайн бесплатно',
  description:
    'Узнайте тип привязанности вашего партнёра по стилю переписки. Тревожный, избегающий или безопасный — и как с ним общаться.',
  keywords: [
    'тип привязанности тест',
    'тревожный тип привязанности',
    'избегающий тип привязанности',
    'привязанность в отношениях тест',
    'как определить тип привязанности',
    'стиль общения привязанность',
  ],
  authors: [{ name: 'Евдокимов Даниил Владимирович' }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: siteUrl,
    siteName: SITE.name,
    title: 'Тип привязанности по переписке',
    description: 'Тревожный, избегающий или безопасный — и как с ним общаться.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тип привязанности по переписке',
    description: 'Тревожный, избегающий или безопасный — и как с ним общаться.',
    images: ['/og.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-32x32.png',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#F0F4F8',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${display.variable} ${body.variable}`}>
      <body>{children}</body>
    </html>
  );
}
