import Link from 'next/link'
import ImageGallery from '@/components/ImageGallery'
import VideoPlayer from '@/components/VideoPlayer'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Property } from '@/types'
import { MapPin, ArrowLeft, Phone, Mail } from 'lucide-react'
import propertiesData from '@/data/properties.json'
import PropertyDetailsClient from './PropertyDetailsClient'

// Required when next.config.js uses output: 'export'
export function generateStaticParams() {
  try {
    return (propertiesData as Array<{ id: string }>).map((p) => ({ id: p.id }))
  } catch {
    return []
  }
}

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const propertyJson = (propertiesData as any[]).find((p) => p.id === params.id)
  if (!propertyJson) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/properties" className="btn btn-ghost mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to properties
        </Link>
        <div className="text-center py-24 text-gray-600">Property not found</div>
      </div>
    )
  }

  const property: Property = {
    ...propertyJson,
    createdAt: new Date(propertyJson.createdAt),
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <Link href="/properties" className="btn btn-ghost inline-flex items-center w-fit">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{property.title}</h1>
            <div className="flex items-center text-gray-600 mt-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{property.location}</span>
            </div>
          </div>

          <ImageGallery images={property.images} title={property.title} />

          {property.video && (
            <Card>
              <CardContent className="p-0">
                <VideoPlayer videoUrl={property.video} title={property.title} />
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </CardContent>
          </Card>

          <PropertyDetailsClient property={property} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-6 space-y-2">
              <div className="text-3xl font-bold text-primary-600">{formatPrice(property.price)}</div>
              <div className="text-gray-600 capitalize">
                {property.propertyType} for {property.purpose}
              </div>
              <div className="text-gray-500">Listed {formatDate(property.createdAt)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Contact</h2>
              <div className="flex items-center text-gray-700">
                <Phone className="h-4 w-4 mr-2" /> {property.contact.phone}
              </div>
              <div className="flex items-center text-gray-700">
                <Mail className="h-4 w-4 mr-2" /> {property.contact.email}
              </div>
              <a
                className="btn btn-primary w-full mt-2 text-center"
                href={`https://wa.me/${property.contact.phone.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

