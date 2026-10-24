import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET(
  request: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const key = (params.path || []).join('/')

    if (!key) {
      return NextResponse.json({ error: 'Key required' }, { status: 400 })
    }

    let r2Bucket: any = null

    try {
      const { getRequestContext } = await import('@cloudflare/next-on-pages')
      const ctx = getRequestContext()
      if (ctx?.env?.R2_BUCKET) {
        r2Bucket = ctx.env.R2_BUCKET
      }
    } catch {
      // Local dev
    }

    if (!r2Bucket) {
      r2Bucket = (process.env as any)?.R2_BUCKET || (globalThis as any)?.R2_BUCKET
    }

    if (r2Bucket) {
      const object = await r2Bucket.get(key)
      if (object) {
        const headers = new Headers()
        object.writeHttpMetadata?.(headers)
        headers.set('etag', object.httpEtag || object.etag || '')
        headers.set('cache-control', 'public, max-age=31536000, immutable')
        headers.set('access-control-allow-origin', '*')

        if (!headers.get('content-type')) {
          const ext = key.split('.').pop()?.toLowerCase()
          if (ext === 'webp') headers.set('content-type', 'image/webp')
          else if (ext === 'jpg' || ext === 'jpeg') headers.set('content-type', 'image/jpeg')
          else if (ext === 'png') headers.set('content-type', 'image/png')
          else headers.set('content-type', 'application/octet-stream')
        }

        return new Response(object.body, { headers })
      }
    }

    // Redirect fallback to public CDN URL
    return NextResponse.redirect(`https://cdn.sangpenjaga.com/${key}`, 302)
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'CDN fetch failed' }, { status: 500 })
  }
}
