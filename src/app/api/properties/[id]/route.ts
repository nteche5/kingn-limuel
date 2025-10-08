import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'nodejs'

function mapDbRowToProperty(row: any, ownershipDocs?: any[]) {
  return {
    id: row.id,
    title: row.title,
    location: row.location,
    price: Number(row.price),
    propertyType: row.property_type,
    purpose: row.purpose,
    description: row.description,
    images: Array.isArray(row.images) ? row.images : [],
    video: row.video || undefined,
    landTitleCertification: row.proof_document || undefined,
    ownershipDocuments: (ownershipDocs || []).map((d: any) => ({
      name: d.name,
      type: d.type,
      url: d.url,
      description: d.description || '',
    })),
    contact: row.contact || { name: '', phone: '', email: '' },
    uploadedBy: row.uploaded_by || 'user',
    createdAt: row.created_at,
    featured: !!row.featured,
  }
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('*, ownership_documents (*)')
      .eq('id', params.id)
      .eq('is_active', true)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    const property = mapDbRowToProperty(data, (data as any)?.ownership_documents)
    return NextResponse.json({ property })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch property' }, { status: 500 })
  }
}


export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('properties')
      .update({ is_active: false })
      .eq('id', params.id)
      .select('id')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, id: data?.id })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to delete property' }, { status: 500 })
  }
}


