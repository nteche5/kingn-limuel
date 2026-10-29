import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifySessionToken } from '@/lib/adminSession'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  const ok = await verifySessionToken(req.cookies.get(ADMIN_COOKIE)?.value)
  return NextResponse.json({ authenticated: ok }, { headers: { 'Cache-Control': 'no-store' } })
}
