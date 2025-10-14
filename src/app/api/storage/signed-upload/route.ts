import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    const body = await req.json()
    const folder: string = body.folder || 'uploads'
    const propertyId: string | undefined = body.propertyId || undefined
    const originalName: string = body.fileName || 'file'

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const ext = (originalName.includes('.') ? originalName.split('.').pop() : 'bin') as string
    const fileName = `${timestamp}-${randomString}.${ext}`
    const path = propertyId ? `${folder}/${propertyId}/${fileName}` : `${folder}/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from('property-files')
      .createSignedUploadUrl(path)

    if (error || !data) {
      return NextResponse.json({ error: error?.message || 'Failed to create signed URL' }, { status: 500 })
    }

    return NextResponse.json({ path, token: data.token })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create signed URL' }, { status: 500 })
  }
}


