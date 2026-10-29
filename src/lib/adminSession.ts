// Server-side admin session helpers (Edge + Node compatible, uses Web Crypto).
// The session is an HttpOnly, signed cookie that the browser cannot forge.

export const ADMIN_COOKIE = 'kl_admin_session'
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7 // 7 days

function getSecret(): string {
  const secret =
    process.env.ADMIN_SESSION_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE ||
    process.env.SUPABASE_SERVICE_KEY ||
    process.env.SERVICE_ROLE_KEY
  if (!secret) throw new Error('ADMIN_SESSION_SECRET is not configured')
  return secret
}

// Existing administrator credentials (unchanged). Server-only names are preferred;
// the previous NEXT_PUBLIC_ names and defaults are still honoured so nothing breaks.
export function getAdminCredentials() {
  return {
    email:
      process.env.ADMIN_EMAIL ||
      process.env.NEXT_PUBLIC_ADMIN_EMAIL ||
      'services@kinglemuelrealestategh.com',
    password:
      process.env.ADMIN_PASSWORD ||
      process.env.NEXT_PUBLIC_ADMIN_PASSWORD ||
      'admin123',
  }
}

const enc = new TextEncoder()

function toB64Url(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes)
  let s = ''
  for (let i = 0; i < arr.length; i++) s += String.fromCharCode(arr[i])
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(getSecret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  return toB64Url(await crypto.subtle.sign('HMAC', key, enc.encode(data)))
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let r = 0
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return r === 0
}

export async function checkCredentials(email: string, password: string): Promise<boolean> {
  const c = getAdminCredentials()
  const okEmail = safeEqual((email || '').trim().toLowerCase(), c.email.trim().toLowerCase())
  const okPass = safeEqual(password || '', c.password)
  return okEmail && okPass
}

export async function createSessionToken(): Promise<{ token: string; maxAge: number }> {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SECONDS
  const payload = `admin.${exp}`
  const sig = await hmac(payload)
  return { token: `${payload}.${sig}`, maxAge: MAX_AGE_SECONDS }
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const parts = token.split('.')
  if (parts.length !== 3 || parts[0] !== 'admin') return false
  const exp = Number(parts[1])
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) return false
  try {
    const expected = await hmac(`${parts[0]}.${parts[1]}`)
    return safeEqual(expected, parts[2])
  } catch {
    return false
  }
}
