import type { Metadata } from 'next'
import './globals.css'

export const runtime = 'edge'

export const metadata: Metadata = {
  title: 'Sang Penjaga - Komik',
  description: 'Platform baca komik digital Sang Penjaga',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="dark">
      <body className="bg-dark text-white font-sans min-h-screen antialiased selection:bg-gold selection:text-black">
        {children}
      </body>
    </html>
  )
}
