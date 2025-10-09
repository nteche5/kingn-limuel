'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ArrowLeft, Phone, Mail, Download, FileText } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import ImageGallery from '@/components/ImageGallery'
import VideoPlayer from '@/components/VideoPlayer'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Property } from '@/types'
// Removed extra documents section to avoid duplication

interface UploadedPropertyDetailsClientProps {
  id: string
}

const STORAGE_KEY = 'king-limuel-properties'

export default function UploadedPropertyDetailsClient({ id }: UploadedPropertyDetailsClientProps) {
  const [property, setProperty] = useState<Property | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      try {
        // Try API first
        const res = await fetch(`/api/properties/${id}`, { cache: 'no-store' })
        if (res.ok) {
          const json = await res.json()
          if (json?.property) {
            const p = json.property as any
            setProperty({
              ...p,
              createdAt: new Date(p.createdAt || p.created_at || Date.now()),
            })
            return
          }
        }

        // Fallback to localStorage (legacy)
        const raw = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
        if (!raw) {
          setProperty(null)
          return
        }
        const uploaded: any[] = JSON.parse(raw)
        const found = uploaded.find((p) => p.id === id)
        if (!found) {
          setProperty(null)
          return
        }
        const normalized: Property = {
          ...found,
          createdAt: new Date(found.createdAt),
        }
        setProperty(normalized)
      } catch (e) {
        console.error('Failed to load uploaded property:', e)
        setProperty(null)
      } finally {
        setIsLoading(false)
      }
    }

    load()

    // When admin actions change properties, refresh the view
    const onUpdated = () => load()
    window.addEventListener('propertiesUpdated', onUpdated)
    return () => window.removeEventListener('propertiesUpdated', onUpdated)
  }, [id])

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/properties" className="btn btn-ghost mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to properties
        </Link>
        <div className="text-center py-24 text-gray-600">Loading property...</div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/properties" className="btn btn-ghost mb-4 inline-flex items-center">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to properties
        </Link>
        <div className="text-center py-24 text-gray-600">Property not found</div>
      </div>
    )
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

          {/* Mobile Documents (visible on small screens) */}
          <Card className="lg:hidden">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Documents</h2>
              {(property.landTitleCertification || (property as any).proofDocument) ? (
                <a
                  href={property.landTitleCertification || (property as any).proofDocument}
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

              {Array.isArray((property as any).ownershipDocuments) && (property as any).ownershipDocuments.length > 0 && (
                <div className="space-y-2">
                  {(property as any).ownershipDocuments.map((doc: any, idx: number) => (
                    <a
                      key={`${doc.url}-${idx}`}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      <span className="inline-flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="truncate max-w-[220px]">{doc.name || 'Document'}</span>
                      </span>
                      <Download className="h-4 w-4 text-gray-500" />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
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

          <Card className="hidden lg:block">
            <CardContent className="p-6 space-y-3">
              <h2 className="text-lg font-semibold">Documents</h2>
              {(property.landTitleCertification || (property as any).proofDocument) ? (
                <a
                  href={property.landTitleCertification || (property as any).proofDocument}
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

              {Array.isArray((property as any).ownershipDocuments) && (property as any).ownershipDocuments.length > 0 && (
                <div className="space-y-2">
                  {(property as any).ownershipDocuments.map((doc: any, idx: number) => (
                    <a
                      key={`${doc.url}-${idx}`}
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="w-full inline-flex items-center justify-between px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-700"
                    >
                      <span className="inline-flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="truncate max-w-[220px]">{doc.name || 'Document'}</span>
                      </span>
                      <Download className="h-4 w-4 text-gray-500" />
                    </a>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


