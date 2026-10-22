import { validateRequest } from '@/lib/auth'
import { NextResponse } from 'next/server'
export const runtime = 'edge'

export async function POST(request: Request) {
  try {
    const { user } = await validateRequest()

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Akses ditolak' },
        { status: 403 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'sang-penjaga'

    if (!file) {
      return NextResponse.json(
        { error: 'File harus diupload' },
        { status: 400 }
      )
    }

    // Upload to Cloudinary via REST API
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!
    const apiKey = process.env.CLOUDINARY_API_KEY!
    const apiSecret = process.env.CLOUDINARY_API_SECRET!

    const timestamp = Math.round(Date.now() / 1000).toString()

    // Generate signature
    const signatureString = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const encoder = new TextEncoder()
    const data = encoder.encode(signatureString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const signature = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('api_key', apiKey)
    uploadFormData.append('timestamp', timestamp)
    uploadFormData.append('signature', signature)
    uploadFormData.append('folder', folder)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: uploadFormData,
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Cloudinary error:', errorData)
      return NextResponse.json(
        { error: 'Gagal upload gambar' },
        { status: 500 }
      )
    }

    const result = await response.json()

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Gagal upload file' },
      { status: 500 }
    )
  }
}
