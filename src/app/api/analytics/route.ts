import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import propertiesData from '@/data/properties.json'

// GET /api/analytics - Get analytics data (admin only)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30' // days

    const periodDays = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - periodDays)

    // If Supabase is not configured, or as a safe fallback, compute simple analytics from static data
    const hasUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL
    const hasAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY
    const useMock = !hasUrl || !hasAnon

    const computeFromStatic = () => {
      const stats = (propertiesData as any[])
      const totalProperties = stats.length
      const landProperties = stats.filter((p) => p.propertyType === 'land').length
      const houseProperties = stats.filter((p) => p.propertyType === 'house').length
      const buyProperties = stats.filter((p) => p.purpose === 'buy').length
      const rentProperties = stats.filter((p) => p.purpose === 'rent').length
      const featuredProperties = stats.filter((p) => !!p.featured).length

      return NextResponse.json({
        period: `${periodDays} days`,
        properties: {
          total: totalProperties,
          byType: { land: landProperties, house: houseProperties },
          byPurpose: { buy: buyProperties, rent: rentProperties },
          featured: featuredProperties,
        },
        views: {
          total: 0,
          uniqueProperties: 0,
          mostViewed: [],
        },
        inquiries: {
          total: 0,
          byStatus: { pending: 0, contacted: 0, closed: 0 },
        },
      })
    }

    if (useMock) {
      return computeFromStatic()
    }

    // Get property statistics
    const { data: propertyStats, error: propertyError } = await supabase
      .from('properties')
      .select('property_type, purpose, featured, created_at')
      .eq('is_active', true)

    if (propertyError) {
      console.error('Error fetching property stats:', propertyError)
      return computeFromStatic()
    }

    // Get view statistics
    const { data: viewStats, error: viewError } = await supabase
      .from('property_views')
      .select('property_id, viewed_at')
      .gte('viewed_at', startDate.toISOString())

    if (viewError) {
      console.error('Error fetching view stats:', viewError)
      return computeFromStatic()
    }

    // Get inquiry statistics
    const { data: inquiryStats, error: inquiryError } = await supabase
      .from('property_inquiries')
      .select('status, created_at')
      .gte('created_at', startDate.toISOString())

    if (inquiryError) {
      console.error('Error fetching inquiry stats:', inquiryError)
      return computeFromStatic()
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

    return NextResponse.json({
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
    })
  } catch (error) {
    console.error('Error in GET /api/analytics:', error)
    // Final fallback to static data
    const period = '30'
    const periodDays = parseInt(period)
    const stats = (propertiesData as any[])
    return NextResponse.json({
      period: `${periodDays} days`,
      properties: {
        total: stats.length,
        byType: {
          land: stats.filter((p) => p.propertyType === 'land').length,
          house: stats.filter((p) => p.propertyType === 'house').length,
        },
        byPurpose: {
          buy: stats.filter((p) => p.purpose === 'buy').length,
          rent: stats.filter((p) => p.purpose === 'rent').length,
        },
        featured: stats.filter((p) => !!p.featured).length,
      },
      views: { total: 0, uniqueProperties: 0, mostViewed: [] },
      inquiries: { total: 0, byStatus: { pending: 0, contacted: 0, closed: 0 } },
    })
  }
}
