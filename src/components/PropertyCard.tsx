'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Bed, Bath, Square, Eye, Trash2, Heart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Property } from '@/types'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface PropertyCardProps {
  property: Property
  onDelete?: (propertyId: string) => void
  showDelete?: boolean
}

const PropertyCard = ({ property, onDelete, showDelete = false }: PropertyCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [liked, setLiked] = useState(false)
  const getPurposeColor = (purpose: string) => {
    return purpose === 'buy' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-blue-100 text-blue-800'
  }

  const getPurposeLabel = (purpose: string) => {
    return purpose === 'buy' ? 'FOR SALE' : 'FOR RENT'
  }

  const getPropertyTypeIcon = (type: string) => {
    return type === 'land' ? '🏞️' : '🏠'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
    <Card className="group overflow-hidden rounded-xl border border-gray-100 ring-1 ring-transparent hover:ring-primary-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-56 md:h-64 overflow-hidden">
        <Image
          src={property.images[0] || '/images/placeholder.jpg'}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        {/* Image overlay */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute inset-x-0 bottom-0 p-4 flex flex-col gap-1 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
          <p className="text-white text-base font-semibold leading-tight truncate">{property.title}</p>
          <p className="text-white/70 text-xs uppercase tracking-wide">{property.location}</p>
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-gray-900 line-clamp-2 transition-colors group-hover:text-primary-600">
              {property.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{property.location}</p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div
                className={`text-2xl font-bold ${
                  property.promotionPrice != null
                    ? 'text-gray-500 line-through decoration-2 decoration-red-600'
                    : 'text-primary-600'
                }`}
              >
                {formatPrice(property.price)}
              </div>
              {property.promotionPrice != null && (
                <div className="text-xs text-gray-600 mt-0.5">
                  Promo: {formatPrice(property.promotionPrice)}
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {property.purpose === 'rent' ? '/month' : ''}
            </div>
          </div>

          <Link href={`/properties/${property.id}`}>
            <Button className="w-full transition-colors group-hover:bg-primary-700">
              View Details
            </Button>
          </Link>
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
    </motion.div>
  )
}

export default PropertyCard


