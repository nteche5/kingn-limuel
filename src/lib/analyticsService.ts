import { supabase } from './supabase'

export interface AnalyticsData {
  period: string
  properties: {
    total: number
    byType: {
      land: number
      house: number
    }
    byPurpose: {
      buy: number
      rent: number
    }
    featured: number
  }
  views: {
    total: number
    uniqueProperties: number
    mostViewed: Array<{
      id: string
      title: string
      location: string
      property_type: string
      purpose: string
      viewCount: number
    }>
  }
  inquiries: {
    total: number
    byStatus: {
      pending: number
      contacted: number
      closed: number
    }
  }
}

// Get analytics data
export const getAnalytics = async (periodDays: number = 30): Promise<AnalyticsData> => {
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

    // Process property statistics
    const totalProperties = propertyStats.length
    const landProperties = propertyStats.filter((p: any) => p.property_type === 'land').length
    const houseProperties = propertyStats.filter((p: any) => p.property_type === 'house').length
    const buyProperties = propertyStats.filter((p: any) => p.purpose === 'buy').length
    const rentProperties = propertyStats.filter((p: any) => p.purpose === 'rent').length
    const featuredProperties = propertyStats.filter((p: any) => p.featured).length

    // Process view statistics
    const totalViews = viewStats.length
    const uniquePropertyViews = new Set(viewStats.map((v: any) => v.property_id)).size

    // Process inquiry statistics
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

    // Get property details for top viewed
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
    console.error('Error getting analytics:', error)
    throw error
  }
}

// Get property view statistics
export const getPropertyViewStats = async (propertyId: string, periodDays: number = 30) => {
  try {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    const { data, error } = await supabase
      .from('property_views')
      .select('viewed_at, ip_address, user_agent')
      .eq('property_id', propertyId)
      .gte('viewed_at', startDate.toISOString())
      .order('viewed_at', { ascending: false })

    if (error) {
      throw new Error(error.message)
    }

    // Group views by date
    const viewsByDate = data.reduce((acc: any, view: any) => {
      const date = new Date(view.viewed_at).toISOString().split('T')[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      totalViews: data.length,
      uniqueIPs: new Set(data.map((v: any) => v.ip_address)).size,
      viewsByDate,
      recentViews: data.slice(0, 10)
    }
  } catch (error) {
    console.error('Error getting property view stats:', error)
    throw error
  }
}

// Get dashboard summary
export const getDashboardSummary = async () => {
  try {
    const [
      propertyCount,
      inquiryCount,
      viewCount,
      recentInquiries
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
        .limit(5)
    ])

    return {
      totalProperties: propertyCount.count || 0,
      pendingInquiries: inquiryCount.count || 0,
      totalViews: viewCount.count || 0,
      recentInquiries: recentInquiries.data || []
    }
  } catch (error) {
    console.error('Error getting dashboard summary:', error)
    throw error
  }
}
