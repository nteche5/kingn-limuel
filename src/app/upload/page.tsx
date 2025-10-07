'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import FileUploader from '@/components/FileUploader'
import { UploadedFile, Property } from '@/types'
import { addProperty } from '@/lib/propertyManager'
import { 
  Upload, 
  DollarSign, 
  Home, 
  Target, 
  FileText, 
  Image, 
  Video,
  CheckCircle,
  AlertCircle,
  Trash2
} from 'lucide-react'
import { LOCATION_OPTIONS } from '@/types'

interface PropertyFormData {
  title: string
  location: string
  price: string
  propertyType: 'land' | 'house'
  purpose: 'buy' | 'rent'
  description: string
  contactName: string
  contactPhone: string
  contactEmail: string
}

export default function UploadPropertyPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!requireAdmin()) {
      router.push('/admin-login')
      return
    }
    setIsAuthorized(true)
  }, [router])
  const [images, setImages] = useState<UploadedFile[]>([])
  const [video, setVideo] = useState<UploadedFile[]>([])
  const [landTitleCertification, setLandTitleCertification] = useState<UploadedFile[]>([])
  const [additionalDocuments, setAdditionalDocuments] = useState<UploadedFile[]>([])
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    location: '',
    price: '',
    propertyType: 'land',
    purpose: 'buy',
    description: '',
    contactName: '',
    contactPhone: '',
    contactEmail: ''
  })

  const handleInputChange = (field: keyof PropertyFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }


  const clearAllData = () => {
    // Clear all form data
    setFormData({
      title: '',
      location: '',
      price: '',
      propertyType: 'land',
      purpose: 'buy',
      description: '',
      contactName: '',
      contactPhone: '',
      contactEmail: ''
    })

    // Clear all uploaded files
    setImages([])
    setVideo([])
    setLandTitleCertification([])
    setAdditionalDocuments([])

    // Reset status
    setSubmitStatus('idle')
    setShowDeleteConfirm(false)
  }

  const validateForm = (): string[] => {
    const errors: string[] = []

    if (!formData.title.trim()) errors.push('Property title is required')
    if (!formData.location.trim()) errors.push('Location is required')
    if (!formData.price.trim()) errors.push('Price is required')
    if (!formData.description.trim()) errors.push('Description is required')
    if (images.length === 0) errors.push('At least one image is required')
    if (!formData.contactName.trim()) errors.push('Contact name is required')
    if (!formData.contactPhone.trim()) errors.push('Contact phone is required')
    if (!formData.contactEmail.trim()) errors.push('Contact email is required')

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.contactEmail && !emailRegex.test(formData.contactEmail)) {
      errors.push('Please enter a valid email address')
    }

    // Validate phone format (basic validation)
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/
    if (formData.contactPhone && !phoneRegex.test(formData.contactPhone)) {
      errors.push('Please enter a valid phone number')
    }

    return errors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (errors.length > 0) {
      alert('Please fix the following errors:\n' + errors.join('\n'))
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Simulate file upload delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Create property object
      const propertyData: Omit<Property, 'id' | 'createdAt'> = {
        title: formData.title,
        location: formData.location,
        price: parseFloat(formData.price),
        propertyType: formData.propertyType,
        purpose: formData.purpose,
        description: formData.description,
        images: images.map(img => URL.createObjectURL(img.file)), // Create local URLs for uploaded images
        video: video[0] ? URL.createObjectURL(video[0].file) : undefined,
        landTitleCertification: landTitleCertification[0] ? URL.createObjectURL(landTitleCertification[0].file) : undefined,
        additionalDocuments: additionalDocuments.map(doc => ({
          name: doc.file.name,
          url: URL.createObjectURL(doc.file),
          type: doc.file.type,
          size: doc.file.size
        })),
        contact: {
          name: formData.contactName,
          phone: formData.contactPhone,
          email: formData.contactEmail
        },
        uploadedBy: 'user',
        featured: false
      }

      // Save property to localStorage
      const savedProperty = addProperty(propertyData)
      
      console.log('Property saved successfully:', savedProperty)

      setSubmitStatus('success')
      
      // Redirect to properties page after successful submission
      setTimeout(() => {
        router.push('/properties')
      }, 2000)

    } catch (error) {
      console.error('Error submitting property:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Property</h1>
          <p className="text-gray-600">
            List your property and reach potential buyers or tenants
          </p>
        </div>

        {/* Success/Error Messages */}
        {submitStatus === 'success' && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-green-800">
                  Property uploaded successfully!
                </h3>
                <p className="text-sm text-green-700 mt-1">
                  Your property is being reviewed and will be published soon.
                </p>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Error uploading property
                </h3>
                <p className="text-sm text-red-700 mt-1">
                  Please try again or contact support if the problem persists.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="h-5 w-5 mr-2" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Title *
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Beautiful 3-bedroom house in Tamale Central"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    General Location *
                  </label>
                  <select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  >
                    <option value="">Select General Location</option>
                    {LOCATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (GHS) *
                  </label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="Enter price"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => handleInputChange('propertyType', e.target.value as 'land' | 'house')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="land">Land</option>
                    <option value="house">House</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose *
                  </label>
                  <select
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value as 'buy' | 'rent')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="buy">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe your property in detail..."
                  required
                />
              </div>
            </CardContent>
          </Card>


          {/* Media Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Property Media
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploader
                files={images}
                onFilesChange={setImages}
                type="image"
                multiple={true}
                maxFiles={10}
                maxSize={10}
                label="Property Images *"
              />

              <FileUploader
                files={video}
                onFilesChange={setVideo}
                type="video"
                multiple={false}
                maxFiles={1}
                maxSize={100}
                label="Property Video (Optional)"
              />

              <FileUploader
                files={landTitleCertification}
                onFilesChange={setLandTitleCertification}
                type="document"
                multiple={false}
                maxFiles={1}
                maxSize={10}
                label="Land Title Certification (Optional)"
              />
            </CardContent>
          </Card>

          {/* Additional Documents */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Additional Documents
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FileUploader
                files={additionalDocuments}
                onFilesChange={setAdditionalDocuments}
                type="document"
                multiple={true}
                maxFiles={5}
                maxSize={10}
                label="Additional Documents (Optional)"
              />
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Upload any additional documents like site plans, building permits, or other relevant property documents. These will be visible to potential buyers/tenants for download.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Name *
                </label>
                <Input
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={formData.contactPhone}
                    onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                    placeholder="+233 XX XXX XXXX"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting}
              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Property
            </Button>
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-[120px]"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Property
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>

        {/* Delete Property Confirmation Modal */}
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
                    Are you sure you want to delete this property? This will clear all form data and uploaded files.
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ This action cannot be undone.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    ℹ️ You can start fresh with a new property after deletion.
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
                      onClick={clearAllData}
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
      </div>
    </div>
  )
}


