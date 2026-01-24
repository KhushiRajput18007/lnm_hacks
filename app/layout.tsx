import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/components/providers'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { NotificationContainer } from '@/components/NotificationContainer'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Attention Roulette',
  description: 'Bet on the which internet content will go viral.',
}

import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { BottomNav } from '@/components/BottomNav'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white selection:bg-primary/20`}>
        <ErrorBoundary>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
              <BottomNav />
            </div>
            <NotificationContainer />
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}
