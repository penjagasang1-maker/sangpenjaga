import { db } from '@/lib/db'
import { users } from '@/lib/schema'
import { validateRequest } from '@/lib/auth'
import { desc, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 401 }
      )
    }

    const allUsers = await db
      .select({
        id: users.id,
        email: users.email,
        username: users.username,
        role: users.role,
        avatarUrl: users.avatarUrl,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))

    return NextResponse.json({
      users: allUsers,
      currentUserRole: user.role,
      currentUserId: user.id,
    })
  } catch (error) {
    console.error('Fetch users error:', error)
    return NextResponse.json(
      { error: 'Gagal mengambil data users' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user || user.role !== 'superadmin') {
      return NextResponse.json(
        { error: 'Hanya Superadmin yang memiliki izin mengubah peran pengguna' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { userId, newRole } = body

    if (!userId || !['user', 'admin'].includes(newRole)) {
      return NextResponse.json(
        { error: 'Parameter tidak valid. Role hanya boleh user atau admin.' },
        { status: 400 }
      )
    }

    // Check target user
    const existingUsers = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (existingUsers.length === 0) {
      return NextResponse.json(
        { error: 'Pengguna tidak ditemukan' },
        { status: 404 }
      )
    }

    const targetUser = existingUsers[0]
    if (targetUser.role === 'superadmin') {
      return NextResponse.json(
        { error: 'Peran Superadmin tidak dapat diubah' },
        { status: 400 }
      )
    }

    await db
      .update(users)
      .set({ role: newRole as 'user' | 'admin' })
      .where(eq(users.id, userId))

    return NextResponse.json({
      success: true,
      message: `Berhasil mengubah peran ${targetUser.username} menjadi ${newRole}`,
    })
  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { error: 'Gagal memperbarui peran pengguna' },
      { status: 500 }
    )
  }
}
