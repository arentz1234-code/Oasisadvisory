import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'Oasis Advisory | AI Consulting for Small Business',
    template: '%s | Oasis Advisory',
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
  description: 'We help small businesses implement AI tools that save time, reduce costs, and scale operations — without the enterprise price tag. Expert AI strategy, custom implementation, and ongoing support.',
  keywords: ['AI consulting', 'small business AI', 'AI implementation', 'business automation', 'AI strategy', 'chatbots', 'AI tools'],
  authors: [{ name: 'Oasis Advisory' }],
  creator: 'Oasis Advisory',
  publisher: 'Oasis Advisory',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://oasisadvisory.com',
    siteName: 'Oasis Advisory',
    title: 'Oasis Advisory | AI Consulting for Small Business',
    description: 'We help small businesses implement AI tools that save time, reduce costs, and scale operations — without the enterprise price tag.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oasis Advisory | AI Consulting for Small Business',
    description: 'We help small businesses implement AI tools that save time, reduce costs, and scale operations — without the enterprise price tag.',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0A0F1C',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-navy text-soft overflow-x-hidden">
        <Navigation />
        <main className="noise-overlay">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
