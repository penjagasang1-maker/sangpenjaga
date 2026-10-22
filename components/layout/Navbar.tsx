'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, LogIn } from 'lucide-react'

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Komik', href: '/komik' },
  { name: 'Tentang', href: '/tentang' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-dark-border bg-dark/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile hamburger button */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-gray-400 hover:text-white p-2 rounded-lg focus:outline-none"
              aria-label="Buka menu navigasi"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex items-center">
            <Link
              href="/"
              className="font-heading font-extrabold text-xl sm:text-2xl text-gold tracking-wider hover:opacity-90 transition-opacity"
            >
              SANG PENJAGA
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active
                      ? 'text-gold font-semibold'
                      : 'text-gray-300 hover:text-gold'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 border border-gold text-gold hover:bg-gold hover:text-black transition-colors rounded-lg px-4 py-1.5 text-sm font-medium"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 bg-gold text-black hover:bg-gold-light transition-colors rounded-lg px-4 py-1.5 text-sm font-semibold"
            >
              <User className="w-4 h-4" />
              <span>Daftar</span>
            </Link>
          </div>

          {/* Mobile Quick Auth Icon */}
          <div className="flex lg:hidden items-center">
            <Link
              href="/login"
              className="p-2 text-gold hover:text-gold-light"
              aria-label="Masuk ke Akun"
            >
              <LogIn className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-50 lg:hidden backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-dark-card border-r border-dark-border z-50 flex flex-col justify-between p-6 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Drawer Header */}
          <div className="flex items-center justify-between pb-6 border-b border-dark-border">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="font-heading font-extrabold text-xl text-gold tracking-wider"
            >
              SANG PENJAGA
            </Link>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white p-1 rounded-lg"
              aria-label="Tutup menu navigasi"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Drawer Navigation Links */}
          <nav className="mt-6 flex flex-col space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                    active
                      ? 'bg-dark text-gold font-semibold border-l-2 border-gold'
                      : 'text-gray-300 hover:bg-dark hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Drawer Auth Buttons */}
        <div className="pt-6 border-t border-dark-border flex flex-col gap-3">
          <Link
            href="/login"
            onClick={() => setIsOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 border border-gold text-gold hover:bg-gold hover:text-black transition-colors rounded-lg py-2.5 text-sm font-medium"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk</span>
          </Link>
          <Link
            href="/register"
            onClick={() => setIsOpen(false)}
            className="w-full inline-flex items-center justify-center gap-2 bg-gold text-black hover:bg-gold-light transition-colors rounded-lg py-2.5 text-sm font-semibold"
          >
            <User className="w-4 h-4" />
            <span>Daftar Akun Baru</span>
          </Link>
        </div>
      </div>
    </header>
  )
}
