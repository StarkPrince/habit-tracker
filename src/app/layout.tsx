import Header from '@/components/Header'
import Providers from '@/components/Providers'
import { Metadata } from 'next'
import { ReactNode } from 'react'
import './globals.css'

import { ThemeProvider } from 'next-themes'


export const metadata: Metadata = {
  title: 'Chain Breaker',
  description: 'Break bad habits and build good ones',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
})
{
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Providers>
            <Header />
            <main className="container mx-auto p-4">
              {children}
            </main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  )
}
