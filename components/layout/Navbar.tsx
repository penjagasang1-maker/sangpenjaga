'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Menu,
  X,
  User as UserIcon,
  LogIn,
  LogOut,
  Shield,
  Crown,
} from 'lucide-react'

const navLinks = [
  { name: 'Beranda', href: '/' },
  { name: 'Komik', href: '/komik' },
  { name: 'VIP Langganan', href: '/langganan' },
  { name: 'Tentang', href: '/tentang' },
]

interface CurrentUser {
  id: string
  email: string
  username: string
  role: 'user' | 'admin' | 'superadmin'
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me')
        const data = await res.json()
        if (data?.user) {
          setCurrentUser(data.user)
        }
      } catch {
        // Not logged in or error
      } finally {
        setLoadingUser(false)
      }
    }
    fetchMe()
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      window.location.href = '/'
    } catch {
      window.location.href = '/'
    }
  }

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const isAdmin = currentUser?.role === 'admin' || currentUser?.role === 'superadmin'

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
              className="font-heading font-extrabold text-xl sm:text-2xl text-red-600 tracking-wider hover:opacity-90 transition-opacity"
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

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-4">
            {!loadingUser && currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Admin Switcher Button */}
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-gold/20 border border-gold/40 text-gold hover:bg-gold hover:text-black transition-all rounded-lg px-3.5 py-1.5 text-xs font-semibold shadow-sm shadow-gold/10"
                  >
                    {currentUser.role === 'superadmin' ? (
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Shield className="w-3.5 h-3.5" />
                    )}
                    <span>Dashboard Admin</span>
                  </Link>
                )}

                {/* User Greeting */}
                <div className="flex items-center gap-2 pl-2 border-l border-dark-border text-sm text-gray-300">
                  <div className="w-7 h-7 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-xs">
                    {currentUser.username[0]?.toUpperCase()}
                  </div>
                  <span className="font-medium max-w-[120px] truncate">
                    {currentUser.username}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-dark-card rounded-lg transition-colors"
                  title="Keluar Akun"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
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
                  <UserIcon className="w-4 h-4" />
                  <span>Daftar</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Quick Auth Icon */}
          <div className="flex lg:hidden items-center">
            {currentUser ? (
              isAdmin ? (
                <Link
                  href="/admin"
                  className="p-2 text-gold hover:text-gold-light"
                  aria-label="Dashboard Admin"
                >
                  <Shield className="w-5 h-5" />
                </Link>
              ) : (
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-red-400"
                  aria-label="Keluar"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              )
            ) : (
              <Link
                href="/login"
                className="p-2 text-gold hover:text-gold-light"
                aria-label="Masuk ke Akun"
              >
                <LogIn className="w-5 h-5" />
              </Link>
            )}
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
              className="font-heading font-extrabold text-xl text-red-600 tracking-wider"
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

          {/* User Profile Summary in Mobile Drawer */}
          {currentUser && (
            <div className="mt-4 p-3 rounded-lg bg-dark border border-dark-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gold/20 text-gold font-bold flex items-center justify-center text-xs">
                  {currentUser.username[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white truncate max-w-[120px]">
                    {currentUser.username}
                  </p>
                  <span className="text-[10px] text-gold uppercase font-bold">
                    {currentUser.role}
                  </span>
                </div>
              </div>
            </div>
          )}

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

            {/* Admin link in mobile drawer */}
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors bg-gold/10 text-gold border border-gold/30 flex items-center gap-2 mt-2"
              >
                {currentUser?.role === 'superadmin' ? (
                  <Crown className="w-4 h-4 text-amber-400" />
                ) : (
                  <Shield className="w-4 h-4" />
                )}
                <span>Buka Dashboard Admin</span>
              </Link>
            )}
          </nav>
        </div>

        {/* Drawer Auth Buttons */}
        <div className="pt-6 border-t border-dark-border flex flex-col gap-3">
          {currentUser ? (
            <button
              onClick={handleLogout}
              className="w-full inline-flex items-center justify-center gap-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors rounded-lg py-2.5 text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </button>
          ) : (
            <>
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
                <UserIcon className="w-4 h-4" />
                <span>Daftar Akun Baru</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
