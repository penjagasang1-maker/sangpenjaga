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
  // Check Cloudflare Pages context for R2 bucket binding and environment variables
  let r2Bucket: any = null
  let cfEnv: any = null

  try {
    const { getRequestContext } = await import('@cloudflare/next-on-pages')
    const ctx = getRequestContext()
    cfEnv = ctx?.env
    if (cfEnv?.R2_BUCKET) {
      r2Bucket = cfEnv.R2_BUCKET
    }
  } catch {
    // Local development or non-CF context
  }

  // Fallback to global/process env if not in ctx
  if (!r2Bucket) {
    r2Bucket = (process.env as any)?.R2_BUCKET || (globalThis as any)?.R2_BUCKET
  }

  const publicDomain = (
    cfEnv?.R2_PUBLIC_DOMAIN ||
    process.env.R2_PUBLIC_DOMAIN ||
    'https://cdn.sangpenjaga.com'
  ).replace(/\/$/, '')

  const r2BucketName = cfEnv?.R2_BUCKET_NAME || process.env.R2_BUCKET_NAME || 'sang-penjaga'

  // Generate clean filename
  const ext = file.name ? file.name.split('.').pop() || 'webp' : 'webp'
  const cleanFolder = folder.replace(/^sang-penjaga\/?/, '').replace(/^\/+|\/+$/g, '')
  const timestamp = Date.now()
  const randomStr = Math.random().toString(36).slice(2, 8)
  const key = `${cleanFolder}/${timestamp}-${randomStr}.${ext}`

  // 1. Upload via Cloudflare Pages native R2 binding
  if (r2Bucket) {
    try {
      const arrayBuffer = await file.arrayBuffer()
      await r2Bucket.put(key, arrayBuffer, {
        httpMetadata: {
          contentType: file.type || 'image/webp',
          cacheControl: 'public, max-age=31536000, immutable',
        },
      })

      const fileUrl = `${publicDomain}/${key}`
      console.log(`[R2 Upload Success] Stored: ${fileUrl}`)

      return {
        url: fileUrl,
        publicId: key,
        storage: 'r2',
      }
    } catch (r2Err) {
      console.error('R2 native upload failed, falling back to Cloudinary:', r2Err)
    }
  }

  // 2. Upload via S3-compatible REST API (if S3 credentials configured)
  const accountId = cfEnv?.R2_ACCOUNT_ID || process.env.R2_ACCOUNT_ID
  const accessKeyId = cfEnv?.R2_ACCESS_KEY_ID || process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = cfEnv?.R2_SECRET_ACCESS_KEY || process.env.R2_SECRET_ACCESS_KEY

  if (accountId && accessKeyId && secretAccessKey) {
    try {
      const s3Endpoint = `https://${accountId}.r2.cloudflarestorage.com/${r2BucketName}/${key}`
      const arrayBuffer = await file.arrayBuffer()

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

  // 3. Fallback: Cloudinary
  console.log('[Upload] Falling back to Cloudinary...')
  const cloudResult = await uploadToCloudinary(file, folder)
  return {
    url: cloudResult.url,
    publicId: cloudResult.publicId,
    width: cloudResult.width,
    height: cloudResult.height,
    storage: 'cloudinary',
  }
}
