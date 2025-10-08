'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import PropertyCard from '@/components/PropertyCard'
import { Property, SearchFilters } from '@/types'
import { getAllProperties, deleteProperty } from '@/lib/propertyManager'
import { Filter, Grid, List, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function PropertiesPage() {
  const searchParams = useSearchParams()
  const [properties, setProperties] = useState<Property[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get('location') || '',
    propertyType: (searchParams.get('type') as 'land' | 'house') || undefined,
    purpose: (searchParams.get('purpose') as 'buy' | 'rent') || undefined,
    minPrice: undefined,
    maxPrice: undefined,
  })

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Try server properties first
        const res = await fetch('/api/properties', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json?.properties) && json.properties.length > 0) {
            setProperties(json.properties.map((p: any) => ({
              ...p,
              createdAt: new Date(p.createdAt || p.created_at || Date.now())
            })))
            return
          }
        }
      } catch (e) {
        // fall back to local
      }
      const allProperties = getAllProperties()
      setProperties(allProperties)
    }

    // Load properties initially
    loadProperties()

    // Listen for storage changes (when properties are removed/restored)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'hide-default-properties' || e.key === 'king-limuel-properties') {
        loadProperties()
      }
    }

    // Listen for custom events from admin actions
    const handlePropertyChange = () => {
      loadProperties()
    }

    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('propertiesUpdated', handlePropertyChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('propertiesUpdated', handlePropertyChange)
    }
  }, [refreshKey])

  // Update filters when URL parameters change
  useEffect(() => {
    setFilters({
      location: searchParams.get('location') || '',
      propertyType: (searchParams.get('type') as 'land' | 'house') || undefined,
      purpose: (searchParams.get('purpose') as 'buy' | 'rent') || undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
  }, [searchParams])

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1)
  }

  const handleDeleteProperty = (propertyId: string) => {
    try {
      deleteProperty(propertyId)
      // Reload properties to reflect the deletion
      const updatedProperties = getAllProperties()
      setProperties(updatedProperties)
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('propertiesUpdated'))
    } catch (error) {
      console.error('Error deleting property:', error)
      alert('Error deleting property. Please try again.')
    }
  }

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Location filter - case insensitive comparison
      if (filters.location && property.location.toLowerCase() !== filters.location.toLowerCase()) {
        return false
      }
      
      // Property type filter - exact match
      if (filters.propertyType && property.propertyType !== filters.propertyType) {
        return false
      }
      
      // Purpose filter - exact match
      if (filters.purpose && property.purpose !== filters.purpose) {
        return false
      }
      
      // Price range filters
      if (filters.minPrice && property.price < filters.minPrice) {
        return false
      }
      if (filters.maxPrice && property.price > filters.maxPrice) {
        return false
      }
      
      return true
    })
  }, [properties, filters])

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: undefined,
      purpose: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Properties
          </h1>
          <p className="text-gray-600">
            {filteredProperties.length} properties found
          </p>
          {/* Active Filters Display */}
          {(filters.propertyType || filters.purpose || filters.location) && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-medium text-blue-800 mb-2">Active Filters:</p>
              <div className="flex flex-wrap gap-2">
                {filters.propertyType && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Type: {filters.propertyType}
                  </span>
                )}
                {filters.purpose && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Purpose: {filters.purpose}
                  </span>
                )}
                {filters.location && (
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    Location: {filters.location}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-6">
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <select
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Locations</option>
                    <option value="tamale-central">Tamale Central</option>
                    <option value="sagnarigu">Sagnarigu</option>
                    <option value="nyohini">Nyohini</option>
                    <option value="vittin">Vittin (Viting)</option>
                    <option value="aboabo">Aboabo</option>
                    <option value="kalpohin-estate">Kalpohin (Estate)</option>
                    <option value="kalpohin-low-cost">Kalpohin (Low-Cost)</option>
                    <option value="kobilmahagu">Kobilmahagu</option>
                    <option value="gumani">Gumani</option>
                    <option value="zagyuri">Zagyuri</option>
                    <option value="kakpagyili">Kakpagyili</option>
                    <option value="sakasaka">Sakasaka</option>
                  </select>
                </div>

                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={filters.propertyType || ''}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Types</option>
                    <option value="land">Land</option>
                    <option value="house">House</option>
                  </select>
                </div>

                {/* Purpose Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose
                  </label>
                  <select
                    value={filters.purpose || ''}
                    onChange={(e) => handleFilterChange('purpose', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Purposes</option>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (GHS)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="number"
                      placeholder="Min Price"
                      value={filters.minPrice || ''}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="Max Price"
                      value={filters.maxPrice || ''}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleRefresh}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                  title="Refresh properties list"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>


            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {filteredProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    property={property} 
                    onDelete={handleDeleteProperty}
                    showDelete={true}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-500">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


