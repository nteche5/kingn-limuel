'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MapPin, Building2, Target, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { LOCATION_OPTIONS } from '@/types'

interface SearchFilters {
  location: string
  propertyType: string
  purpose: string
}

const SearchBar = () => {
  const router = useRouter()
  const [filters, setFilters] = useState<SearchFilters>({
    location: '',
    propertyType: '',
    purpose: ''
  })
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = {
    location: useRef<HTMLDivElement>(null),
    propertyType: useRef<HTMLDivElement>(null),
    purpose: useRef<HTMLDivElement>(null)
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    
    if (filters.location) params.set('location', filters.location)
    if (filters.propertyType) params.set('type', filters.propertyType)
    if (filters.purpose) params.set('purpose', filters.purpose)
    
    router.push(`/properties?${params.toString()}`)
  }

  const handleInputChange = (field: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }))
    setOpenDropdown(null)
  }

  const toggleDropdown = (dropdown: string) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown)
  }

  const handleDropdownMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      let isInsideDropdown = false
      
      Object.values(dropdownRefs).forEach(ref => {
        if (ref.current && ref.current.contains(target)) {
          isInsideDropdown = true
        }
      })
      
      if (!isInsideDropdown) {
        setOpenDropdown(null)
      }
    }

    if (openDropdown) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [openDropdown])

  const getDisplayValue = (field: keyof SearchFilters) => {
    const value = filters[field]
    if (!value) return field === 'location' ? 'Location' : field === 'propertyType' ? 'Type' : 'Purpose'
    
    if (field === 'location') {
      const option = LOCATION_OPTIONS.find(opt => opt.value === value)
      return option?.label || value
    }
    return value.charAt(0).toUpperCase() + value.slice(1)
  }

  return (
    <div className="bg-white/80 backdrop-blur-md border border-white/60 shadow-lg p-0.5 sm:p-3 rounded-full max-w-5xl mx-auto">
      <div className="flex flex-row flex-wrap items-stretch gap-1 sm:flex-nowrap sm:gap-3">
        {/* Location */}
        <div className="relative flex-1 min-w-[120px] sm:flex-1" ref={dropdownRefs.location}>
          <div className="relative">
            <MapPin className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-400 z-10" />
            <button
              type="button"
              aria-label="Select location"
              onClick={() => toggleDropdown('location')}
              className="w-full h-8 sm:h-12 pl-7 sm:pl-10 pr-5 sm:pr-8 rounded-full bg-transparent hover:bg-white/60 border-0 text-left flex items-center justify-between text-[11px] sm:text-base focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <span className={`${filters.location ? 'text-gray-900' : 'text-gray-500'} truncate max-w-[75%]`}>
                {getDisplayValue('location')}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'location' && (
              <div 
                className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                onMouseDown={handleDropdownMouseDown}
              >
                <div
                  className="px-4 py-3 text-primary-600 cursor-pointer hover:bg-primary-50"
                  onClick={() => handleInputChange('location', '')}
                >
                  Select Location
                </div>
                {LOCATION_OPTIONS.map((option) => (
                  <div
                    key={option.value}
                    className={`px-4 py-3 cursor-pointer hover:bg-primary-50 ${
                      filters.location === option.value ? 'bg-primary-100 text-primary-700' : 'text-gray-900'
                    }`}
                    onClick={() => handleInputChange('location', option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="hidden sm:block w-px self-stretch bg-gray-200/70" aria-hidden="true" />

        {/* Property Type */}
        <div className="relative flex-1 min-w-[120px] sm:flex-1" ref={dropdownRefs.propertyType}>
          <div className="relative">
            <Building2 className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-400 z-10" />
            <button
              type="button"
              aria-label="Select property type"
              onClick={() => toggleDropdown('propertyType')}
              className="w-full h-8 sm:h-12 pl-7 sm:pl-10 pr-5 sm:pr-8 rounded-full bg-transparent hover:bg-white/60 border-0 text-left flex items-center justify-between text-[11px] sm:text-base focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <span className={`${filters.propertyType ? 'text-gray-900' : 'text-gray-500'} truncate max-w-[75%]`}>
                {getDisplayValue('propertyType')}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 transition-transform ${openDropdown === 'propertyType' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'propertyType' && (
              <div 
                className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                onMouseDown={handleDropdownMouseDown}
              >
                <div
                  className="px-4 py-3 text-primary-600 cursor-pointer hover:bg-primary-50"
                  onClick={() => handleInputChange('propertyType', '')}
                >
                  Property Type
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer hover:bg-primary-50 ${
                    filters.propertyType === 'land' ? 'bg-primary-100 text-primary-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleInputChange('propertyType', 'land')}
                >
                  Land
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer hover:bg-primary-50 ${
                    filters.propertyType === 'house' ? 'bg-primary-100 text-primary-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleInputChange('propertyType', 'house')}
                >
                  House
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="hidden sm:block w-px self-stretch bg-gray-200/70" aria-hidden="true" />

        {/* Purpose */}
        <div className="relative flex-1 min-w-[120px] sm:flex-1" ref={dropdownRefs.purpose}>
          <div className="relative">
            <Target className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-5 sm:w-5 text-gray-400 z-10" />
            <button
              type="button"
              aria-label="Select purpose"
              onClick={() => toggleDropdown('purpose')}
              className="w-full h-8 sm:h-12 pl-7 sm:pl-10 pr-5 sm:pr-8 rounded-full bg-transparent hover:bg-white/60 border-0 text-left flex items-center justify-between text-[11px] sm:text-base focus-visible:ring-2 focus-visible:ring-primary-500"
            >
              <span className={`${filters.purpose ? 'text-gray-900' : 'text-gray-500'} truncate max-w-[75%]`}>
                {getDisplayValue('purpose')}
              </span>
              <ChevronDown className={`h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 transition-transform ${openDropdown === 'purpose' ? 'rotate-180' : ''}`} />
            </button>
            {openDropdown === 'purpose' && (
              <div 
                className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg"
                onMouseDown={handleDropdownMouseDown}
              >
                <div
                  className="px-4 py-3 text-primary-600 cursor-pointer hover:bg-primary-50"
                  onClick={() => handleInputChange('purpose', '')}
                >
                  Purpose
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer hover:bg-primary-50 ${
                    filters.purpose === 'buy' ? 'bg-primary-100 text-primary-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleInputChange('purpose', 'buy')}
                >
                  Buy
                </div>
                <div
                  className={`px-4 py-3 cursor-pointer hover:bg-primary-50 ${
                    filters.purpose === 'rent' ? 'bg-primary-100 text-primary-700' : 'text-gray-900'
                  }`}
                  onClick={() => handleInputChange('purpose', 'rent')}
                >
                  Rent
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Button */}
        <div className="flex-none sm:ml-auto">
          <Button
            onClick={handleSearch}
            className="w-8 h-8 sm:w-auto sm:h-12 sm:px-6 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-full flex items-center justify-center space-x-2 text-xs sm:text-base shadow-md p-0"
          >
            <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">Search</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar


