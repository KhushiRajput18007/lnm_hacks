import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Providers } from '@/components/providers'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Attention Roulette',
  description: 'Bet on the which internet content will go viral.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-black text-white selection:bg-primary/20`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
