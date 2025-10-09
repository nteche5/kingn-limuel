import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    const form = await req.formData()
    const file = form.get('file') as File | null
    const folder = (form.get('folder') as string) || 'uploads'
    const propertyId = form.get('propertyId') as string | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 10MB)' }, { status: 400 })
    }

    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 10)
    const ext = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${ext}`
    const path = propertyId ? `${folder}/${propertyId}/${fileName}` : `${folder}/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const { error } = await supabaseAdmin.storage
      .from('property-files')
      .upload(path, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('property-files')
      .getPublicUrl(path)

    return NextResponse.json({
      success: true,
      file: {
        name: fileName,
        path,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type,
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Upload failed' }, { status: 500 })
  }
}



