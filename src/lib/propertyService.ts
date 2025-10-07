import { Property, SearchFilters } from '@/types'
import { supabase } from './supabase'

export interface PropertyResponse {
  properties: Property[]
  pagination?: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

export interface CreatePropertyData {
  title: string
  location: string
  price: number
  propertyType: 'land' | 'house'
  purpose: 'buy' | 'rent'
  description: string
  images?: string[]
  video?: string
  proofDocument?: string
  contact?: { name: string; phone: string; email: string }
  featured?: boolean
  ownershipDocuments?: Array<{
    name: string
    type: string
    url: string
    description: string
  }>
}

// Get all properties with optional filtering
export const getProperties = async (filters?: SearchFilters): Promise<PropertyResponse> => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        ownership_documents (*)
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })

    if (filters?.propertyType) {
      query = query.eq('property_type', filters.propertyType)
    }
    if (filters?.purpose) {
      query = query.eq('purpose', filters.purpose)
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return { properties: data || [] }
  } catch (error) {
    console.error('Error fetching properties:', error)
    throw error
  }
}

// Search properties with advanced filtering
export const searchProperties = async (
  searchQuery?: string,
  filters?: SearchFilters,
  sortBy: string = 'created_at',
  sortOrder: 'asc' | 'desc' = 'desc',
  limit: number = 20,
  offset: number = 0
): Promise<PropertyResponse> => {
  try {
    let query = supabase
      .from('properties')
      .select(`
        *,
        ownership_documents (*)
      `)
      .eq('is_active', true)

    // General text search
    if (searchQuery) {
      query = query.or(
        `title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,location.ilike.%${searchQuery}%`
      )
    }

    // Apply filters
    if (filters?.propertyType) {
      query = query.eq('property_type', filters.propertyType)
    }
    if (filters?.purpose) {
      query = query.eq('purpose', filters.purpose)
    }
    if (filters?.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }
    if (filters?.minPrice) {
      query = query.gte('price', filters.minPrice)
    }
    if (filters?.maxPrice) {
      query = query.lte('price', filters.maxPrice)
    }

    // Apply sorting
    const validSortFields = ['created_at', 'price', 'title', 'location']
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'created_at'
    query = query.order(sortField, { ascending: sortOrder === 'asc' })

    // Apply pagination
    query = query.range(offset, offset + limit - 1)

    const { data, error, count } = await query

    if (error) {
      throw new Error(error.message)
    }

    // Get total count for pagination
    const { count: totalCount } = await supabase
      .from('properties')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    return {
      properties: data || [],
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (totalCount || 0) > offset + limit
      }
    }
  } catch (error) {
    console.error('Error searching properties:', error)
    throw error
  }
}

// Get a specific property by ID
export const getPropertyById = async (id: string): Promise<Property | null> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        ownership_documents (*)
      `)
      .eq('id', id)
      .eq('is_active', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error fetching property:', error)
    throw error
  }
}

// Create a new property
export const createProperty = async (propertyData: CreatePropertyData): Promise<Property> => {
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

// Update a property
export const updateProperty = async (id: string, propertyData: Partial<CreatePropertyData>): Promise<Property> => {
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

// Delete a property (soft delete)
export const deleteProperty = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('properties')
      .update({ is_active: false })
      .eq('id', id)

    if (error) {
      throw new Error(error.message)
    }
  } catch (error) {
    console.error('Error deleting property:', error)
    throw error
  }
}

// Get featured properties
export const getFeaturedProperties = async (limit: number = 6): Promise<Property[]> => {
  try {
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        ownership_documents (*)
      `)
      .eq('is_active', true)
      .eq('featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching featured properties:', error)
    throw error
  }
}

// Track property view
export const trackPropertyView = async (propertyId: string, ipAddress?: string, userAgent?: string): Promise<void> => {
  try {
    await supabase
      .from('property_views')
      .insert({
        property_id: propertyId,
        ip_address: ipAddress,
        user_agent: userAgent
      })
  } catch (error) {
    // Don't throw error for view tracking failures
    console.error('Error tracking property view:', error)
  }
}
