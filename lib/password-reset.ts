import { client, db } from './db'
import { passwordResetTokens } from './schema'
import { eq, gt } from 'drizzle-orm'

let tableInitialized = false

export async function ensureResetTokensTable() {
  if (tableInitialized) return
  try {
    await client.execute(`
      CREATE TABLE IF NOT EXISTS password_reset_tokens (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(21) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
        INDEX idx_token (token),
        INDEX idx_user (user_id)
      );
    `)
    tableInitialized = true
  } catch (e) {
    console.error('Failed to ensure password_reset_tokens table:', e)
  }
}

export function generateCryptoToken(length = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(length))
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function createPasswordResetToken(userId: string): Promise<string> {
  await ensureResetTokensTable()

  // Clean old tokens for this user
  try {
    await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.userId, userId))
  } catch {
    // Ignore cleanup error
  }

  const token = generateCryptoToken(32)
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000) // Valid for 1 hour

  await db.insert(passwordResetTokens).values({
    userId,
    token,
    expiresAt,
  })

  return token
}

export async function verifyAndConsumeResetToken(
  token: string
): Promise<{ valid: boolean; userId?: string; error?: string }> {
  await ensureResetTokensTable()

  try {
    const [row] = await db
      .select()
      .from(passwordResetTokens)
      .where(eq(passwordResetTokens.token, token))
      .limit(1)

    if (!row) {
      return { valid: false, error: 'Tautan reset kata sandi tidak valid atau sudah digunakan.' }
    }

    if (new Date(row.expiresAt).getTime() < Date.now()) {
      // Delete expired token
      await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token))
      return { valid: false, error: 'Tautan reset kata sandi sudah kedaluwarsa. Silakan minta tautan baru.' }
    }

    // Delete token so it cannot be reused
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.token, token))

    return { valid: true, userId: row.userId }
  } catch (err: any) {
    console.error('Verify reset token error:', err)
    return { valid: false, error: 'Gagal memverifikasi token reset' }
  }
}
