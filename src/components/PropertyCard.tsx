'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Square, Eye, Trash2, MoreVertical } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'

interface PropertyCardProps {
  property: Property
  onDelete?: (propertyId: string) => void
  showDelete?: boolean
}

const PropertyCard = ({ property, onDelete, showDelete = false }: PropertyCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const getPurposeColor = (purpose: string) => {
    return purpose === 'buy' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800'
  }

  const getPropertyTypeIcon = (type: string) => {
    return type === 'land' ? '🏞️' : '🏠'
  }

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={property.images[0] || '/images/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPurposeColor(property.purpose)}`}>
            {property.purpose.toUpperCase()}
          </span>
        </div>
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <span className="text-lg">
            {getPropertyTypeIcon(property.propertyType)}
          </span>
          {showDelete && onDelete && (
            <button
              onClick={(e) => {
                e.preventDefault()
                setShowDeleteConfirm(true)
              }}
              className="bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-90 hover:opacity-100 transition-all duration-200 shadow-lg"
              title="Delete property"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>
        {property.featured && (
          <div className="absolute top-3 right-12">
            <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
              FEATURED
            </span>
          </div>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-primary-600">
              {formatPrice(property.price)}
            </div>
            <div className="text-sm text-gray-500">
              {property.purpose === 'rent' ? '/month' : ''}
            </div>
          </div>

          {property.propertyType === 'house' && (
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Bed className="h-4 w-4 mr-1" />
                <span>3</span>
              </div>
              <div className="flex items-center">
                <Bath className="h-4 w-4 mr-1" />
                <span>2</span>
              </div>
              <div className="flex items-center">
                <Square className="h-4 w-4 mr-1" />
                <span>120m²</span>
              </div>
            </div>
          )}

          <div className="pt-2 space-y-2">
            <Link href={`/properties/${property.id}`}>
              <Button className="w-full group-hover:bg-primary-700 transition-colors">
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </Link>
            
            {/* View on Map Link */}
            <a
              href={`https://www.google.com/maps?q=${property.coordinates.lat},${property.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full"
            >
              <Button 
                variant="outline" 
                className="w-full text-xs py-2 hover:bg-gray-50 transition-colors"
              >
                <MapPin className="h-3 w-3 mr-1" />
                View on Map
              </Button>
            </a>
          </div>
        </div>
      </CardContent>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <Trash2 className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Delete Property
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete <strong>"{property.title}"</strong>?
                </p>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onDelete?.(property.id)
                      setShowDeleteConfirm(false)
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Property
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

export default PropertyCard


