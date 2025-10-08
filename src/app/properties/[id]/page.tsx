import Link from 'next/link'
import ImageGallery from '@/components/ImageGallery'
import VideoPlayer from '@/components/VideoPlayer'
import { Card, CardContent } from '@/components/ui/Card'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Property } from '@/types'
import { MapPin, ArrowLeft, Phone, Mail, Download } from 'lucide-react'
import propertiesData from '@/data/properties.json'
// Removed extra documents section to avoid duplication
import UploadedPropertyDetailsClient from './UploadedPropertyDetailsClient'

// Required when next.config.js uses output: 'export'
export function generateStaticParams() {
  try {
    return (propertiesData as Array<{ id: string }>).map((p) => ({ id: p.id }))
  } catch {
    return []
  }
}

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  // Try to use static JSON first (for default properties)
  const propertyJson = (propertiesData as any[]).find((p) => p.id === params.id)
  if (!propertyJson) {
    // Fallback to client-side fetch from API/localStorage for uploaded properties
    return <UploadedPropertyDetailsClient id={params.id} />
  }

  const property: Property = {
    ...propertyJson,
    createdAt: new Date(propertyJson.createdAt),
  }

  const landTitleUrl = (property as any).landTitleCertification || (property as any).proofDocument

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

          <Card>
            <CardContent className="p-0">
              {property.video ? (
                <VideoPlayer videoUrl={property.video} title={property.title} posterUrl={property.images?.[0]} />
              ) : (
                <div className="aspect-video flex items-center justify-center text-gray-500 bg-gray-100">No video provided</div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="text-gray-700 whitespace-pre-line">{property.description}</p>
            </CardContent>
          </Card>

          {/* Documents are shown in the right sidebar only */}
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

          <Card>
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Documents</h2>
              {landTitleUrl ? (
                <a
                  href={landTitleUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Download Land Title Certificate</span>
                </a>
              ) : (
                <div className="text-sm text-gray-600">No land title certificate available.</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

