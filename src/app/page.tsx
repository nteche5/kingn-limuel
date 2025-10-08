'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import PropertyCard from '@/components/PropertyCard'
import BackgroundSlideshow from '@/components/BackgroundSlideshow'
import { Property } from '@/types'
import { getAllProperties } from '@/lib/propertyManager'
import { Facebook, MessageCircle, Key, Home, Building2, DoorOpen, Users } from 'lucide-react'

export default function HomePage() {
  const [properties, setProperties] = useState<Property[]>([])

  useEffect(() => {
    const loadProperties = async () => {
      try {
        // Try server properties first
        const res = await fetch('/api/properties', { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (Array.isArray(json?.properties) && json.properties.length > 0) {
            setProperties(
              json.properties.map((p: any) => ({
                ...p,
                createdAt: new Date(p.createdAt || p.created_at || Date.now())
              }))
            )
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
  }, [])

  // Get featured properties
  const featuredProperties = properties.filter(property => property.featured)
  
  // Get properties by category
  const landsForSale = properties.filter(property => 
    property.propertyType === 'land' && property.purpose === 'buy'
  )
  
  const housesForRent = properties.filter(property => 
    property.propertyType === 'house' && property.purpose === 'rent'
  )
  
  const housesForSale = properties.filter(property => 
    property.propertyType === 'house' && property.purpose === 'buy'
  )

  // Background images for slideshow
  const backgroundImages = [
    '/images/backgrounds/luxury-house-1.jpg',
    '/images/backgrounds/luxury-house-2.jpg',
    '/images/backgrounds/luxury-house-3.jpg'
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Slideshow */}
      <BackgroundSlideshow 
        images={backgroundImages}
        interval={5000}
        className="min-h-screen"
      >
        <section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
        
             <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24 text-center z-10">
               <div className="mb-8 sm:mb-12">
                 <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 animate-fade-in bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent leading-tight">
                   Building Trust, One Property at a Time
                 </h1>
                 <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl mb-6 sm:mb-8 text-gray-100 animate-slide-up max-w-4xl mx-auto leading-relaxed px-2">
                   Your trusted partner in finding the perfect property in Ghana. 
                   From modern apartments to luxury estates, we connect you with your dream home.
                 </p>
               </div>
          
          {/* AI Search Bar */}
          <div className="mt-12 animate-slide-up">
            <SearchBar />
          </div>
          
               {/* Trust indicators */}
               <div className="mt-8 sm:mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-4xl mx-auto">
                 <div className="text-center">
                   <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-300 mb-1 sm:mb-2">500+</div>
                   <div className="text-gray-200 text-sm sm:text-base">Properties Listed</div>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-300 mb-1 sm:mb-2">1000+</div>
                   <div className="text-gray-200 text-sm sm:text-base">Happy Clients</div>
                 </div>
                 <div className="text-center">
                   <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-300 mb-1 sm:mb-2">5+</div>
                   <div className="text-gray-200 text-sm sm:text-base">Years Experience</div>
                 </div>
               </div>
               
               {/* Social Media */}
               <div className="mt-8 sm:mt-12 text-center">
                 <p className="text-white text-opacity-80 text-sm sm:text-base mb-4">Connect with us</p>
                 <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                   <a 
                     href="https://www.facebook.com/profile.php?id=100071941852508" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                   >
                     <Facebook className="h-5 w-5" />
                     <span>Follow on Facebook</span>
                   </a>
                   <a 
                     href="https://wa.me/233244996878" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="inline-flex items-center space-x-2 bg-green-600 bg-opacity-80 hover:bg-opacity-100 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
                   >
                     <MessageCircle className="h-5 w-5" />
                     <span>WhatsApp Us</span>
                   </a>
                 </div>
               </div>
        </div>
        
          {/* Scroll indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 sm:h-3 bg-white rounded-full mt-1.5 sm:mt-2"></div>
            </div>
          </div>
        </section>
      </BackgroundSlideshow>

      {/* Featured Properties Section */}
      {featuredProperties.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="p-3 rounded-full bg-blue-100 mr-4">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Featured Properties
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Discover our handpicked selection of premium properties across Ghana
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lands for Sale */}
      {landsForSale.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="p-3 rounded-full bg-green-100 mr-4">
                  <Building2 className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Lands for Sale
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Prime land opportunities in the best locations
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {landsForSale.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Houses for Rent */}
      {housesForRent.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="p-3 rounded-full bg-purple-100 mr-4">
                  <DoorOpen className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Houses for Rent
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Comfortable homes available for rent in great neighborhoods
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {housesForRent.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Houses for Sale */}
      {housesForSale.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 sm:mb-12">
              <div className="flex items-center justify-center mb-3 sm:mb-4">
                <div className="p-3 rounded-full bg-orange-100 mr-4">
                  <Home className="h-8 w-8 text-orange-600" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  Houses for Sale
                </h2>
              </div>
              <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Beautiful homes ready for you to call your own
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {housesForSale.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="py-12 sm:py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-primary-100 px-2">
            Let us help you find the property that's right for you
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a
              href="/properties"
              className="bg-white text-primary-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Browse All Properties
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors text-sm sm:text-base"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}


