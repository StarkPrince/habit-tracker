import Header from '@/components/Header'
import Providers from '@/components/Providers'
import { ReactNode } from 'react'
import './globals.css'

export const metadata = {
  title: 'Habit Tracker',
  description: 'Track and eliminate bad habits',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
})
{
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <Providers>
          <Header />
          <main className="container mx-auto p-4">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
