import { validateRequest } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'
import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return NextResponse.json(
        { error: 'Akses ditolak. Hanya Admin dan Superadmin yang dapat mengunggah file.' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'sang-penjaga'

    if (!file) {
      return NextResponse.json(
        { error: 'File gambar harus dipilih' },
        { status: 400 }
      )
    }

    const result = await uploadToCloudinary(file, folder)

    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: (error as Error)?.message || 'Gagal mengunggah file ke Cloudinary' },
      { status: 500 }
    )
  }
}
