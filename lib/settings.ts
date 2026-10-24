import { db } from './db'
import { siteSettings } from './schema'
import { eq } from 'drizzle-orm'

export interface SiteSettingsData {
  siteName: string
  logoPrefix: string
  logoSuffix: string
  footerDescription: string
  contactEmail: string
  contactPhone: string
  contactAddress: string
  socialInstagram: string
  socialTwitter: string
  socialYoutube: string
  socialTiktok: string
  copyrightText: string
  aboutTitle: string
  aboutParagraph1: string
  aboutParagraph2: string
  aboutHighlight: string
}

export const defaultSettings: SiteSettingsData = {
  siteName: 'Sang Penjaga',
  logoPrefix: 'SANG',
  logoSuffix: 'PENJAGA',
  footerDescription:
    'Platform baca komik digital resmi Sang Penjaga. Jelajahi petualangan epik, karakter legendaris, dan cerita seru karya komikus tanah air.',
  contactEmail: 'mrizqi045@gmail.com',
  contactPhone: '087880503974',
  contactAddress: 'Cipinang melayu, 13620',
  socialInstagram: 'https://instagram.com',
  socialTwitter: 'https://x.com',
  socialYoutube: 'https://youtube.com',
  socialTiktok: '',
  copyrightText: '© 2026 Sang Penjaga. Mond Bhasinato',
  aboutTitle: 'SANG PENJAGA',
  aboutParagraph1:
    'Di balik mitos dan legenda yang diwariskan dari generasi ke generasi, tersimpan kisah-kisah kelam tentang makhluk-makhluk yang bersembunyi di luar jangkauan pandangan manusia. Mereka hidup dalam bayang-bayang, menghuni tempat-tempat yang terlupakan, dan menunggu saatnya untuk menampakkan diri.',
  aboutParagraph2:
    'Ketika kegelapan mulai mengusik kehidupan manusia, sekelompok ksatria bangkit untuk menghadapi teror yang tak mampu dijelaskan oleh akal. Mereka adalah Sang Penjaga, para pelindung yang mempertaruhkan nyawa demi menjaga manusia dari ancaman dunia gaib.',
  aboutHighlight:
    'Terinspirasi dari kekayaan mitos, legenda, dan kisah mistis Nusantara.',
}

let cachedSettings: SiteSettingsData | null = null
let cacheTimestamp = 0

export async function getSiteSettings(): Promise<SiteSettingsData> {
  const now = Date.now()
  if (cachedSettings && now - cacheTimestamp < 30000) {
    return cachedSettings
  }

  try {
    const [row] = await db
      .select()
      .from(siteSettings)
      .where(eq(siteSettings.id, 1))
      .limit(1)

    if (row) {
      cachedSettings = {
        siteName: row.siteName || defaultSettings.siteName,
        logoPrefix: row.logoPrefix || defaultSettings.logoPrefix,
        logoSuffix: row.logoSuffix || defaultSettings.logoSuffix,
        footerDescription: row.footerDescription || defaultSettings.footerDescription,
        contactEmail: row.contactEmail || defaultSettings.contactEmail,
        contactPhone: row.contactPhone || defaultSettings.contactPhone,
        contactAddress: row.contactAddress || defaultSettings.contactAddress,
        socialInstagram: row.socialInstagram || defaultSettings.socialInstagram,
        socialTwitter: row.socialTwitter || defaultSettings.socialTwitter,
        socialYoutube: row.socialYoutube || defaultSettings.socialYoutube,
        socialTiktok: row.socialTiktok || defaultSettings.socialTiktok,
        copyrightText: row.copyrightText || defaultSettings.copyrightText,
        aboutTitle: row.aboutTitle || defaultSettings.aboutTitle,
        aboutParagraph1: row.aboutParagraph1 || defaultSettings.aboutParagraph1,
        aboutParagraph2: row.aboutParagraph2 || defaultSettings.aboutParagraph2,
        aboutHighlight: row.aboutHighlight || defaultSettings.aboutHighlight,
      }
      cacheTimestamp = now
      return cachedSettings
    }
  } catch (e) {
    console.error('Failed to load site settings from DB:', e)
  }

  return defaultSettings
}

export function invalidateSettingsCache() {
  cachedSettings = null
  cacheTimestamp = 0
}
