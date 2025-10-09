import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export const runtime = 'edge'

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
    // Treat proof_document as land title certification to align with UI naming
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

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('*, ownership_documents (*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const properties = (data || []).map((row: any) =>
      mapDbRowToProperty(row, row.ownership_documents)
    )

    return NextResponse.json({ properties })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Supabase admin not configured' }, { status: 500 })
    }

    const body = await req.json()
    // Expecting camelCase from client
    const insertPayload: any = {
      title: body.title,
      location: body.location,
      price: body.price,
      property_type: body.propertyType,
      purpose: body.purpose,
      description: body.description,
      images: body.images || [],
      video: body.video || null,
      proof_document: body.landTitleCertification || null,
      contact: body.contact || { name: '', phone: '', email: '' },
      uploaded_by: body.uploadedBy || 'user',
      featured: !!body.featured,
      is_active: true,
    }

    const { data: inserted, error } = await supabaseAdmin
      .from('properties')
      .insert(insertPayload)
      .select('*, ownership_documents (*)')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Insert ownership documents if provided
    if (Array.isArray(body.ownershipDocuments) && inserted?.id) {
      const docs = body.ownershipDocuments.map((d: any) => ({
        property_id: inserted.id,
        name: d.name,
        type: d.type,
        url: d.url,
        description: d.description || null,
      }))
      const { error: docError } = await supabaseAdmin
        .from('ownership_documents')
        .insert(docs)
      if (docError) {
        // Log but do not fail the whole request
        console.error('Failed to insert ownership documents:', docError)
      }
    }

    const property = mapDbRowToProperty(inserted, inserted?.ownership_documents)
    return NextResponse.json({ success: true, property })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Failed to create property' }, { status: 500 })
  }
}


