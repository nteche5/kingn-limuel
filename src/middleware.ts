import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminSession'

// Server-side protection for every admin page and every admin-only API.
// This runs before the page/API code, so visitors cannot bypass it from the browser.
const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

function isProtected(req: NextRequest): { page: boolean; api: boolean } {
  const { pathname } = req.nextUrl
  const method = req.method.toUpperCase()

  // Admin pages
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return { page: true, api: false }
  if (pathname === '/upload' || pathname.startsWith('/upload/')) return { page: true, api: false }

  // File uploads / signed upload URLs: admin only
  if (pathname.startsWith('/api/upload') || pathname.startsWith('/api/storage')) {
    return { page: false, api: true }
  }
  // Property listings: reading is public, create/edit/delete is admin only
  if (pathname.startsWith('/api/properties') && WRITE_METHODS.has(method)) {
    return { page: false, api: true }
  }
  return { page: false, api: false }
}

export async function middleware(req: NextRequest) {
  const { page, api } = isProtected(req)
  if (!page && !api) return NextResponse.next()

  const ok = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
  if (ok) return NextResponse.next()

  if (api) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = '/admin-login'
  url.search = ''
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/upload', '/upload/:path*', '/api/upload/:path*', '/api/upload', '/api/storage/:path*', '/api/properties', '/api/properties/:path*'],
}
