import { supabase } from './supabase'

export interface PropertyInquiry {
  id: string
  property_id: string
  name: string
  email: string
  phone?: string
  message: string
  status: 'pending' | 'contacted' | 'closed'
  created_at: string
  updated_at: string
  properties?: {
    id: string
    title: string
    location: string
    price: number
    property_type: string
    purpose: string
  }
}

export interface CreateInquiryData {
  propertyId: string
  name: string
  email: string
  phone?: string
  message: string
}

// Create a new property inquiry
export const createInquiry = async (inquiryData: CreateInquiryData): Promise<PropertyInquiry> => {
  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(inquiryData.email)) {
      throw new Error('Invalid email format')
    }

    // Check if property exists and is active
    const { data: property, error: propertyError } = await supabase
      .from('properties')
      .select('id, title')
      .eq('id', inquiryData.propertyId)
      .eq('is_active', true)
      .single()

    if (propertyError || !property) {
      throw new Error('Property not found')
    }

    // Create inquiry
    const { data: inquiry, error: inquiryError } = await supabase
      .from('property_inquiries')
      .insert({
        property_id: inquiryData.propertyId,
        name: inquiryData.name,
        email: inquiryData.email,
        phone: inquiryData.phone,
        message: inquiryData.message,
        status: 'pending'
      })
      .select()
      .single()

    if (inquiryError) {
      throw new Error(inquiryError.message)
    }

    return inquiry
  } catch (error) {
    console.error('Error creating inquiry:', error)
    throw error
  }
}

// Get all inquiries (admin only)
export const getInquiries = async (
  status?: string,
  propertyId?: string,
  limit: number = 20,
  offset: number = 0
): Promise<PropertyInquiry[]> => {
  try {
    let query = supabase
      .from('property_inquiries')
      .select(`
        *,
        properties (
          id,
          title,
          location
        )
      `)
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }
    if (propertyId) {
      query = query.eq('property_id', propertyId)
    }
    if (limit) {
      query = query.limit(limit)
    }
    if (offset) {
      query = query.range(offset, offset + limit - 1)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    throw error
  }
}

// Get a specific inquiry by ID
export const getInquiryById = async (id: string): Promise<PropertyInquiry | null> => {
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
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw new Error(error.message)
    }

    return data
  } catch (error) {
    console.error('Error fetching inquiry:', error)
    throw error
  }
}

// Update inquiry status
export const updateInquiryStatus = async (id: string, status: 'pending' | 'contacted' | 'closed'): Promise<PropertyInquiry> => {
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

// Delete an inquiry
export const deleteInquiry = async (id: string): Promise<void> => {
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

// Get inquiry statistics
export const getInquiryStats = async (periodDays: number = 30): Promise<{
  total: number
  pending: number
  contacted: number
  closed: number
}> => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    const { data, error } = await supabase
      .from('property_inquiries')
      .select('status')
      .gte('created_at', startDate.toISOString())

    if (error) {
      throw new Error(error.message)
    }

    const stats = {
      total: data.length,
      pending: data.filter((i: any) => i.status === 'pending').length,
      contacted: data.filter((i: any) => i.status === 'contacted').length,
      closed: data.filter((i: any) => i.status === 'closed').length
    }

    return stats
  } catch (error) {
    console.error('Error getting inquiry stats:', error)
    throw error
  }
}
