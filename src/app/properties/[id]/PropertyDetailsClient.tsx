'use client'

import { Card, CardContent } from '@/components/ui/Card'
import { Download, FileText } from 'lucide-react'
import type { Property } from '@/types'

interface PropertyDetailsClientProps {
  property: Property
}

export default function PropertyDetailsClient({ property }: PropertyDetailsClientProps) {
  // Helper function to handle file downloads
  const handleDownload = async (url: string, filename: string) => {
    try {
      // For blob URLs (uploaded files), create a download link
      if (url.startsWith('blob:')) {
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error('Failed to fetch file')
        }
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = filename
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        
        // Show success feedback
        console.log(`Downloaded: ${filename}`)
      } else {
        // For static files, create a download link
        const link = document.createElement('a')
        link.href = url
        link.download = filename
        link.target = '_blank'
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        console.log(`Downloaded: ${filename}`)
      }
    } catch (error) {
      console.error('Error downloading file:', error)
      // Fallback: open in new tab
      window.open(url, '_blank')
    }
  }

  // Prefer new field; fall back to legacy proofDocument
  const landTitleUrl = property.landTitleCertification || property.proofDocument

  // Only render if there is a land title to show
  if (!landTitleUrl) {
    return null
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h2 className="text-lg font-semibold">Documents</h2>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Land Title Certificate</h3>
                  <p className="text-sm text-gray-500">Official land title certification</p>
                </div>
              </div>
              <button
                onClick={() => handleDownload(landTitleUrl!, 'land-title-certificate.pdf')}
                className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
