import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { lucia } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith('/admin')
  const isProfileRoute = pathname.startsWith('/profil')

  // Pass through all other routes
  if (!isAdminRoute && !isProfileRoute) {
    return NextResponse.next()
  }

  const sessionId = request.cookies.get(lucia.sessionCookieName)?.value

  if (!sessionId) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const { session, user } = await lucia.validateSession(sessionId)

    if (!session || !user) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete(lucia.sessionCookieName)
      return response
    }

    if (isAdminRoute && user.role !== 'admin' && user.role !== 'superadmin') {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    const response = NextResponse.next()

    if (session.fresh) {
      const sessionCookie = lucia.createSessionCookie(session.id)
      response.cookies.set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      )
    }

    return response
  } catch {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(lucia.sessionCookieName)
    return response
  }
}

export const config = {
  matcher: ['/admin/:path*', '/profil/:path*'],
}
