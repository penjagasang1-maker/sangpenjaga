import Link from 'next/link'
import { getSiteSettings } from '@/lib/settings'

export default async function Footer() {
  const settings = await getSiteSettings()

  return (
    <footer className="w-full bg-dark-card border-t border-dark-border text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row items-start justify-between gap-10 mb-10">
          {/* Logo & Description */}
          <div className="max-w-sm">
            <Link
              href="/"
              className="font-heading font-extrabold text-2xl tracking-wider inline-block mb-3"
            >
              <span className="text-white">{settings.logoPrefix} </span>
              <span className="text-red-600">{settings.logoSuffix}</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              {settings.footerDescription}
            </p>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-10 w-full lg:w-auto">
            {/* Navigasi */}
            <div>
              <h3 className="text-white font-heading font-semibold text-sm tracking-wider uppercase mb-3">
                Navigasi
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/" className="hover:text-gold transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <Link href="/komik" className="hover:text-gold transition-colors">
                    Daftar Komik
                  </Link>
                </li>
                <li>
                  <Link href="/langganan" className="hover:text-gold transition-colors">
                    VIP Langganan
                  </Link>
                </li>
                <li>
                  <Link href="/tentang" className="hover:text-gold transition-colors">
                    Tentang Kami
                  </Link>
                </li>
              </ul>
            </div>

            {/* Bantuan & Hukum */}
            <div>
              <h3 className="text-white font-heading font-semibold text-sm tracking-wider uppercase mb-3">
                Bantuan &amp; Hukum
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/kontak" className="hover:text-gold transition-colors">
                    Pusat Bantuan
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-gold transition-colors">
                    Tanya Jawab (FAQ)
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="hover:text-gold transition-colors">
                    Syarat &amp; Ketentuan
                  </Link>
                </li>
                <li>
                  <Link href="/refund-policy" className="hover:text-gold transition-colors">
                    Kebijakan Refund
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kontak Kami */}
            <div>
              <h3 className="text-white font-heading font-semibold text-sm tracking-wider uppercase mb-3">
                Kontak Kami
              </h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <span className="text-gray-500 block text-xs">Email:</span>
                  <a
                    href={`mailto:${settings.contactEmail}`}
                    className="text-gray-300 hover:text-gold transition-colors break-all"
                  >
                    {settings.contactEmail}
                  </a>
                </li>
                <li>
                  <span className="text-gray-500 block text-xs">Telepon:</span>
                  <a
                    href={`tel:${settings.contactPhone}`}
                    className="text-gray-300 hover:text-gold transition-colors"
                  >
                    {settings.contactPhone}
                  </a>
                </li>
                <li>
                  <span className="text-gray-500 block text-xs">Alamat:</span>
                  <span className="text-gray-300">{settings.contactAddress}</span>
                </li>
              </ul>
            </div>

            {/* Social Media */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-white font-heading font-semibold text-sm tracking-wider uppercase mb-3">
                Ikuti Kami
              </h3>
              <div className="flex items-center gap-3">
                {settings.socialInstagram && (
                  <a
                    href={settings.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-dark border border-dark-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                    aria-label="Instagram"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {settings.socialTwitter && (
                  <a
                    href={settings.socialTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-dark border border-dark-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                    aria-label="X (Twitter)"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                )}
                {settings.socialYoutube && (
                  <a
                    href={settings.socialYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-dark border border-dark-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                    aria-label="YouTube"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {settings.socialTiktok && (
                  <a
                    href={settings.socialTiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-dark border border-dark-border flex items-center justify-center text-gray-400 hover:text-gold hover:border-gold transition-colors"
                    aria-label="TikTok"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-dark-border text-center sm:text-left text-xs text-gray-500">
          <p>{settings.copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
