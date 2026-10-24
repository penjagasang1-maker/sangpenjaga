import { uploadToCloudinary } from './cloudinary'

export interface R2UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
  storage: 'r2' | 'cloudinary'
}

/**
 * Uploads an image file to Cloudflare R2 Object Storage.
 * Falls back to Cloudinary if R2 credentials or bindings are not yet set.
 */
export async function uploadImage(
  file: File,
  folder: string = 'comics'
): Promise<R2UploadResult> {
  const publicDomain = (process.env.R2_PUBLIC_DOMAIN || '').replace(/\/$/, '')
  const r2BucketName = process.env.R2_BUCKET_NAME || 'sang-penjaga'

  // Generate clean filename
  const ext = file.name ? file.name.split('.').pop() || 'webp' : 'webp'
  const cleanFolder = folder.replace(/^\/+|\/+$/g, '')
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).slice(2, 8)
  const key = `${cleanFolder}/${timestamp}-${randomStr}.${ext}`

  // Check 1: Cloudflare Pages native R2 bucket binding via getRequestContext
  let r2Bucket: any = null
  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    const ctx = getRequestContext()
    if (ctx?.env?.R2_BUCKET) {
      r2Bucket = ctx.env.R2_BUCKET
    }
  } catch {
    // Local development or non-CF context
  }

  // If R2 binding available, upload via native R2 API
  if (r2Bucket && publicDomain) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      await r2Bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type || 'image/webp',
          cacheControl: 'public, max-age=31536000, immutable',
        },
      })

      const fileUrl = `${publicDomain}/${key}`
      return {
        url: fileUrl,
        publicId: key,
        storage: 'r2',
      }
    } catch (r2Err) {
      console.error('R2 native upload failed, falling back:', r2Err)
    }
  }

  // Check 2: Cloudflare S3-compatible REST API (via R2 S3 Credentials)
  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (accountId && accessKeyId && secretAccessKey && publicDomain) {
    try {
      const s3Endpoint = `https://${accountId}.r2.cloudflarestorage.com/${r2BucketName}/${key}`
      const arrayBuffer = await file.arrayBuffer()

      // Simple PUT request to R2 S3 endpoint
      const res = await fetch(s3Endpoint, {
        method: 'PUT',
        headers: {
          'Content-Type': file.type || 'image/webp',
        },
        body: arrayBuffer,
      })

      if (res.ok) {
        return {
          url: `${publicDomain}/${key}`,
          publicId: key,
          storage: 'r2',
        }
      }
    } catch (s3Err) {
      console.error('R2 S3 upload error:', s3Err)
    }
  }

  // Fallback: Cloudinary (preserves current functionality until R2 keys are provided)
  const cloudResult = await uploadToCloudinary(file, folder)
  return {
    url: cloudResult.url,
    publicId: cloudResult.publicId,
    width: cloudResult.width,
    height: cloudResult.height,
    storage: 'cloudinary',
  }
}
