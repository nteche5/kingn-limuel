import { supabase } from './supabase'
import { CreatePropertyData } from './propertyService'
import { Property } from '@/types'
import { PropertyInquiry, CreateInquiryData } from './inquiryService'
import { AnalyticsData } from './analyticsService'

// Admin-specific service functions

// Property Management
export const adminGetAllProperties = async (includeInactive: boolean = false): Promise<Property[]> => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        ownership_documents (*)
      `)
      .order('created_at', { ascending: false })

    if (!includeInactive) {
      query = query.eq('is_active', true)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching all properties:', error)
    throw error
  }
}

export const adminCreateProperty = async (propertyData: CreatePropertyData): Promise<Property> => {
  try {
    const { data: property, error } = await supabase
      .from('properties')
      .insert({
        title: propertyData.title,
        location: propertyData.location,
        price: propertyData.price,
        property_type: propertyData.propertyType,
        purpose: propertyData.purpose,
        description: propertyData.description,
        images: propertyData.images || [],
        video: propertyData.video,
        proof_document: propertyData.proofDocument,
        contact: propertyData.contact || { name: '', phone: '', email: '' },
        uploaded_by: 'admin',
        featured: propertyData.featured || false
      })
      .select()
      .single()

    if (error) {
      throw new Error(error.message)
    }

    // Add ownership documents if provided
    if (propertyData.ownershipDocuments && propertyData.ownershipDocuments.length > 0) {
      const documents = propertyData.ownershipDocuments.map(doc => ({
        property_id: property.id,
        name: doc.name,
        type: doc.type,
        url: doc.url,
        description: doc.description
      }))

      const { error: documentsError } = await supabase
        .from('ownership_documents')
        .insert(documents)

      if (documentsError) {
        console.error('Error creating ownership documents:', documentsError)
      }
    }

    return property
  } catch (error) {
    console.error('Error creating property:', error)
    throw error
  }
}

export const adminUpdateProperty = async (id: string, propertyData: Partial<CreatePropertyData>): Promise<Property> => {
  try {
    const updateData: any = {}
    
    if (propertyData.title !== undefined) updateData.title = propertyData.title
    if (propertyData.location !== undefined) updateData.location = propertyData.location
    if (propertyData.price !== undefined) updateData.price = propertyData.price
    if (propertyData.propertyType !== undefined) updateData.property_type = propertyData.propertyType
    if (propertyData.purpose !== undefined) updateData.purpose = propertyData.purpose
    if (propertyData.description !== undefined) updateData.description = propertyData.description
    if (propertyData.images !== undefined) updateData.images = propertyData.images
    if (propertyData.video !== undefined) updateData.video = propertyData.video
    if (propertyData.proofDocument !== undefined) updateData.proof_document = propertyData.proofDocument
    if (propertyData.contact !== undefined) updateData.contact = propertyData.contact
    if (propertyData.featured !== undefined) updateData.featured = propertyData.featured

    const { data: property, error } = await supabase
      .from('properties')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Property not found')
      }
      throw new Error(error.message)
    }

    // Update ownership documents if provided
    if (propertyData.ownershipDocuments !== undefined) {
      // Delete existing documents
      await supabase
        .from('ownership_documents')
        .delete()
        .eq('property_id', id)

      // Insert new documents
      if (propertyData.ownershipDocuments.length > 0) {
        const documents = propertyData.ownershipDocuments.map(doc => ({
          property_id: id,
          name: doc.name,
          type: doc.type,
          url: doc.url,
          description: doc.description
        }))

        const { error: documentsError } = await supabase
          .from('ownership_documents')
          .insert(documents)

        if (documentsError) {
          console.error('Error updating ownership documents:', documentsError)
        }
      }
    }

    return property
  } catch (error) {
    console.error('Error updating property:', error)
    throw error
  }
}

export const adminDeleteProperty = async (id: string, permanent: boolean = false): Promise<void> => {
  try {
    if (permanent) {
      // Hard delete - remove from database completely
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    } else {
      // Soft delete - mark as inactive
      const { error } = await supabase
        .from('properties')
        .update({ is_active: false })
        .eq('id', id)

      if (error) {
        throw new Error(error.message)
      }
    }
  } catch (error) {
    console.error('Error deleting property:', error)
    throw error
  }
}

export const adminRestoreProperty = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ is_active: true })
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error restoring property:', error)
    throw error
  }
}

// Inquiry Management
export const adminGetAllInquiries = async (): Promise<PropertyInquiry[]> => {
  try {
    const { data, error } = await supabase
      .from('property_inquiries')
      .select(`
        *,
        properties (
          id,
          title,
          location,
          price,
          property_type,
          purpose
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching all inquiries:', error)
    throw error
  }
}

export const adminUpdateInquiryStatus = async (id: string, status: 'pending' | 'contacted' | 'closed'): Promise<PropertyInquiry> => {
  try {
    const { data, error } = await supabase
      .from('property_inquiries')
      .update({
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Inquiry not found')
      }
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error updating inquiry status:', error)
    throw error
  }
}

export const adminDeleteInquiry = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('property_inquiries')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error deleting inquiry:', error)
    throw error
  }
}

// Analytics
export const adminGetAnalytics = async (periodDays: number = 30): Promise<AnalyticsData> => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    // Get property statistics
    const { data: propertyStats, error: propertyError } = await supabase
      .from('properties')
      .select('property_type, purpose, featured, created_at')
      .eq('is_active', true)

    if (propertyError) {
      throw new Error(propertyError.message)
    }

    // Get view statistics
    const { data: viewStats, error: viewError } = await supabase
      .from('property_views')
      .select('property_id, viewed_at')
      .gte('viewed_at', startDate.toISOString())

    if (viewError) {
      throw new Error(viewError.message)
    }

    // Get inquiry statistics
    const { data: inquiryStats, error: inquiryError } = await supabase
      .from('property_inquiries')
      .select('status, created_at')
      .gte('created_at', startDate.toISOString())

    if (inquiryError) {
      throw new Error(inquiryError.message)
    }

    // Process statistics
    const totalProperties = propertyStats.length
    const landProperties = propertyStats.filter((p: any) => p.property_type === 'land').length
    const houseProperties = propertyStats.filter((p: any) => p.property_type === 'house').length
    const buyProperties = propertyStats.filter((p: any) => p.purpose === 'buy').length
    const rentProperties = propertyStats.filter((p: any) => p.purpose === 'rent').length
    const featuredProperties = propertyStats.filter((p: any) => p.featured).length

    const totalViews = viewStats.length
    const uniquePropertyViews = new Set(viewStats.map((v: any) => v.property_id)).size

    const totalInquiries = inquiryStats.length
    const pendingInquiries = inquiryStats.filter((i: any) => i.status === 'pending').length
    const contactedInquiries = inquiryStats.filter((i: any) => i.status === 'contacted').length
    const closedInquiries = inquiryStats.filter((i: any) => i.status === 'closed').length

    // Get most viewed properties
    const viewCounts = viewStats.reduce((acc: any, view: any) => {
      acc[view.property_id] = (acc[view.property_id] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topViewedProperties = Object.entries(viewCounts)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 5)

    const topPropertyIds = topViewedProperties.map(([id]) => id)
    const { data: topProperties } = await supabase
      .from('properties')
      .select('id, title, location, property_type, purpose')
      .in('id', topPropertyIds)
      .eq('is_active', true)

    const mostViewedProperties = topProperties?.map((property: any) => ({
      ...property,
      viewCount: viewCounts[property.id] || 0
    })) || []

    return {
      period: `${periodDays} days`,
      properties: {
        total: totalProperties,
        byType: {
          land: landProperties,
          house: houseProperties
        },
        byPurpose: {
          buy: buyProperties,
          rent: rentProperties
        },
        featured: featuredProperties
      },
      views: {
        total: totalViews,
        uniqueProperties: uniquePropertyViews,
        mostViewed: mostViewedProperties
      },
      inquiries: {
        total: totalInquiries,
        byStatus: {
          pending: pendingInquiries,
          contacted: contactedInquiries,
          closed: closedInquiries
        }
      }
    }
  } catch (error) {
    console.error('Error getting admin analytics:', error)
    throw error
  }
}

// Dashboard Summary
export const adminGetDashboardSummary = async () => {
  try {
    const [
      propertyCount,
      inquiryCount,
      viewCount,
      recentInquiries,
      recentProperties
    ] = await Promise.all([
      // Total active properties
      supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true),
      
      // Total pending inquiries
      supabase
        .from('property_inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      // Total views in last 30 days
      supabase
        .from('property_views')
        .select('*', { count: 'exact', head: true })
        .gte('viewed_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Recent inquiries
      supabase
        .from('property_inquiries')
        .select(`
          id,
          name,
          email,
          message,
          status,
          created_at,
          properties (
            title,
            location
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5),
      
      // Recent properties
      supabase
        .from('properties')
        .select(`
          id,
          title,
          location,
          price,
          property_type,
          purpose,
          featured,
          created_at
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)
    ])

    return {
      totalProperties: propertyCount.count || 0,
      pendingInquiries: inquiryCount.count || 0,
      totalViews: viewCount.count || 0,
      recentInquiries: recentInquiries.data || [],
      recentProperties: recentProperties.data || []
    }
  } catch (error) {
    console.error('Error getting admin dashboard summary:', error)
    throw error
  }
}
