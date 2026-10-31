import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, checkCredentials, createSessionToken } from '@/lib/adminSession'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 400 })
    }
    if (!(await checkCredentials(email, password))) {
      await new Promise((r) => setTimeout(r, 600))
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 })
    }
    const { token, maxAge } = await createSessionToken()
    const res = NextResponse.json({ success: true })
    res.cookies.set(ADMIN_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge,
    })
    return res
  } catch (error) {
    console.error('Admin login failed:', error)
    return NextResponse.json({ error: 'Login failed. Please try again.' }, { status: 500 })
  }
}
