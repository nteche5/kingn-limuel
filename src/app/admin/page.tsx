'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { requireAdmin } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import PropertyCard from '@/components/PropertyCard'
import { Property } from '@/types'
import propertiesData from '@/data/properties.json'
import { deleteProperty, deleteAllUploadedProperties, removeAllProperties, shouldHideDefaultProperties, restoreDefaultProperties } from '@/lib/propertyManager'
import { 
  BarChart3, 
  Home, 
  Users, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  TrendingUp,
  DollarSign,
  MapPin,
  Calendar,
  Upload,
  Video,
  Settings,
  AlertTriangle,
  LogOut
} from 'lucide-react'
import AdminPasswordChange from '@/components/AdminPasswordChange'

interface DashboardStats {
  totalProperties: number
  totalViews: number
  totalRevenue: number
  pendingApprovals: number
}

export default function AdminDashboard() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [stats, setStats] = useState<DashboardStats>({
    totalProperties: 0,
    totalViews: 0,
    totalRevenue: 0,
    pendingApprovals: 0
  })
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'upload-video' | 'settings'>('overview')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [showDeleteAllModal, setShowDeleteAllModal] = useState(false)
  const [deleteAllLoading, setDeleteAllLoading] = useState(false)
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false)
  const [removeAllLoading, setRemoveAllLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [hideDefaults, setHideDefaults] = useState(false)

  useEffect(() => {
    const isAdminLoggedIn = requireAdmin()
    console.log('Admin dashboard auth check:', {
      isAdminLoggedIn,
      localStorage: typeof window !== 'undefined' ? localStorage.getItem('admin-logged-in') : 'N/A'
    })
    
    if (!isAdminLoggedIn) {
      console.log('Redirecting to admin-login')
      router.push('/admin-login')
      return
    }
    setIsAuthorized(true)
    loadProperties()
    setHideDefaults(shouldHideDefaultProperties())
  }, [router])

  const loadProperties = () => {
    try {
      // Get properties from localStorage (includes uploaded ones)
      const storedProperties = localStorage.getItem('king-limuel-properties')
      const uploadedProperties: Property[] = storedProperties ? JSON.parse(storedProperties) : []
      
      // Combine with default properties from JSON
      const formattedProperties = [
        ...propertiesData.map(property => ({
          ...property,
          createdAt: new Date(property.createdAt),
          propertyType: property.propertyType as 'land' | 'house',
          purpose: property.purpose as 'buy' | 'rent',
          uploadedBy: 'admin' as 'admin'
        })),
        ...uploadedProperties.map(property => ({
          ...property,
          createdAt: new Date(property.createdAt),
          propertyType: property.propertyType as 'land' | 'house',
          purpose: property.purpose as 'buy' | 'rent',
          uploadedBy: property.uploadedBy as 'admin' | 'user'
        }))
      ]
      
      setProperties(formattedProperties)

      // Mock stats calculation
      setStats({
        totalProperties: formattedProperties.length,
        totalViews: 1250, // Mock data
        totalRevenue: 45000, // Mock data
        pendingApprovals: 3 // Mock data
      })
    } catch (error) {
      console.error('Error loading properties:', error)
      setErrorMessage('Failed to load properties')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin-logged-in')
    localStorage.removeItem('admin-remember')
    router.push('/admin-login')
  }

  const handleEditProperty = (propertyId: string) => {
    // TODO: Navigate to edit property page
    console.log('Edit property:', propertyId)
  }

  const handleDeleteProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId)
    if (property) {
      setPropertyToDelete(property)
      setShowDeleteModal(true)
    }
  }

  const confirmDelete = async () => {
    if (!propertyToDelete) return

    setDeleteLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const success = deleteProperty(propertyToDelete.id)
      
      if (success) {
        setSuccessMessage(`Property "${propertyToDelete.title}" has been deleted successfully.`)
        loadProperties() // Reload properties list
        setShowDeleteModal(false)
        setPropertyToDelete(null)
        
        // Notify other pages about the change
        window.dispatchEvent(new CustomEvent('propertiesUpdated'))
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage('Failed to delete property. Property may not exist.')
      }
    } catch (error) {
      console.error('Delete error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete property')
    } finally {
      setDeleteLoading(false)
    }
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setPropertyToDelete(null)
    setErrorMessage('')
  }

  const handleDeleteAllProperties = () => {
    setShowDeleteAllModal(true)
  }

  const confirmDeleteAll = async () => {
    setDeleteAllLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const success = deleteAllUploadedProperties()
      
      if (success) {
        setSuccessMessage('All uploaded properties have been deleted successfully.')
        loadProperties() // Reload properties list
        setShowDeleteAllModal(false)
        
        // Notify other pages about the change
        window.dispatchEvent(new CustomEvent('propertiesUpdated'))
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage('No uploaded properties found to delete.')
      }
    } catch (error) {
      console.error('Delete all error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to delete all properties')
    } finally {
      setDeleteAllLoading(false)
    }
  }

  const cancelDeleteAll = () => {
    setShowDeleteAllModal(false)
    setErrorMessage('')
  }

  // Get count of uploaded properties
  const uploadedPropertiesCount = properties.filter(p => p.id.startsWith('uploaded-')).length
  const defaultPropertiesCount = properties.filter(p => !p.id.startsWith('uploaded-')).length

  const handleRemoveAllProperties = () => {
    setShowRemoveAllModal(true)
  }

  const confirmRemoveAll = async () => {
    setRemoveAllLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const success = removeAllProperties()
      
      if (success) {
        setSuccessMessage('All properties have been removed from the website successfully.')
        setHideDefaults(true)
        loadProperties() // Reload properties list
        setShowRemoveAllModal(false)
        
        // Notify other pages about the change
        window.dispatchEvent(new CustomEvent('propertiesUpdated'))
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage('Failed to remove all properties.')
      }
    } catch (error) {
      console.error('Remove all error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to remove all properties')
    } finally {
      setRemoveAllLoading(false)
    }
  }

  const cancelRemoveAll = () => {
    setShowRemoveAllModal(false)
    setErrorMessage('')
  }

  const handleRestoreDefaults = async () => {
    setErrorMessage('')
    setSuccessMessage('')

    try {
      const success = restoreDefaultProperties()
      
      if (success) {
        setSuccessMessage('Default properties have been restored successfully.')
        setHideDefaults(false)
        loadProperties() // Reload properties list
        
        // Notify other pages about the change
        window.dispatchEvent(new CustomEvent('propertiesUpdated'))
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000)
      } else {
        setErrorMessage('Failed to restore default properties.')
      }
    } catch (error) {
      console.error('Restore error:', error)
      setErrorMessage(error instanceof Error ? error.message : 'Failed to restore default properties')
    }
  }

  const handleUploadVideo = () => {
    // TODO: Implement video upload functionality
    console.log('Upload property video')
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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-6 lg:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-4 sm:space-y-0">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
              <p className="text-sm sm:text-base text-gray-600">
                Manage your properties and track performance
              </p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 w-full sm:w-auto justify-center sm:justify-start"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMessage}
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {errorMessage}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 lg:space-x-8 min-w-max sm:min-w-0">
              {[
                { id: 'overview', label: 'Overview', icon: BarChart3 },
                { id: 'properties', label: 'Properties', icon: Home },
                { id: 'upload-video', label: 'Upload Video', icon: Video },
                { id: 'settings', label: 'Settings', icon: Settings },
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-4 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span className="hidden xs:inline sm:inline">{tab.label}</span>
                    <span className="xs:hidden sm:hidden">{tab.label.split(' ')[0]}</span>
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Home className="h-8 w-8 text-primary-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Properties</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalProperties}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Eye className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Views</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <DollarSign className="h-8 w-8 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                      <p className="text-2xl font-bold text-gray-900">₵{stats.totalRevenue.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-500">Pending Approvals</p>
                      <p className="text-2xl font-bold text-gray-900">{stats.pendingApprovals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Properties</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {properties.slice(0, 5).map((property) => (
                      <div key={property.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{property.title}</h4>
                          <p className="text-sm text-gray-500">{property.location}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            property.purpose === 'buy' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {property.purpose.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full justify-start" onClick={() => setActiveTab('properties')}>
                      <Home className="h-4 w-4 mr-2" />
                      Manage Properties
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Property
                    </Button>
                    <Button variant="outline" className="w-full justify-start" onClick={() => setActiveTab('upload-video')}>
                      <Video className="h-4 w-4 mr-2" />
                      Upload Property Video
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === 'properties' && (
          <div className="space-y-6">
            {/* Properties Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex-1">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Properties Management</h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage all your property listings ({uploadedPropertiesCount} uploaded, {defaultPropertiesCount} default)
                </p>
                {hideDefaults && (
                  <p className="text-sm text-orange-600 mt-1">
                    ⚠️ Default properties are currently hidden
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                <Button
                  variant="outline"
                  onClick={handleDeleteAllProperties}
                  disabled={uploadedPropertiesCount === 0}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All Uploaded
                </Button>
                {hideDefaults ? (
                  <Button
                    variant="outline"
                    onClick={handleRestoreDefaults}
                    className="text-green-600 border-green-600 hover:bg-green-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Restore Defaults
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleRemoveAllProperties}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove All Properties
                  </Button>
                )}
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Button>
              </div>
            </div>

            {/* Properties Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {properties.map((property) => (
                <div key={property.id} className="relative">
                  <PropertyCard property={property} />
                  
                  {/* Admin Actions */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white bg-opacity-90 hover:bg-opacity-100"
                      onClick={() => handleEditProperty(property.id)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-white bg-opacity-90 hover:bg-opacity-100 text-red-600 border-red-600 hover:bg-red-50"
                      onClick={() => handleDeleteProperty(property.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upload Video Tab */}
        {activeTab === 'upload-video' && (
          <div className="space-y-6">
            {/* Upload Video Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Upload Property Video</h2>
              <p className="text-sm sm:text-base text-gray-600">Upload promotional videos for your properties</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Video Upload</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Property Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Property
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option value="">Choose a property...</option>
                      {properties.map((property) => (
                        <option key={property.id} value={property.id}>
                          {property.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Video Upload Area */}
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Property Video</h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your video file here, or click to browse
                    </p>
                    <Button onClick={handleUploadVideo}>
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Video File
                    </Button>
                    <p className="text-sm text-gray-500 mt-2">
                      Supported formats: MP4, MOV, AVI (Max 100MB)
                    </p>
                  </div>

                  {/* Video Preview */}
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">Video Preview</h4>
                    <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                      <p className="text-gray-500">No video selected</p>
                    </div>
                  </div>

                  {/* Upload Button */}
                  <div className="flex justify-end">
                    <Button disabled>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Video
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Settings Header */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Settings</h2>
              <p className="text-sm sm:text-base text-gray-600">Manage your admin account and security settings</p>
            </div>

            {/* Password Change Section */}
            <div className="max-w-2xl">
              <AdminPasswordChange 
                onPasswordChange={(newPassword) => {
                  setSuccessMessage('Password changed successfully! Please restart the application for changes to take effect.')
                  setTimeout(() => setSuccessMessage(''), 5000)
                }}
              />
            </div>

            {/* Additional Settings */}
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Security Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Current Admin Email</h4>
                  <p className="text-blue-700">{process.env.NEXT_PUBLIC_ADMIN_EMAIL}</p>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h4 className="font-medium text-yellow-900 mb-2">Security Notice</h4>
                  <p className="text-yellow-700 text-sm">
                    For production deployment, ensure that admin credentials are stored securely 
                    and never exposed in client-side code or public repositories.
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2">Best Practices</h4>
                  <ul className="text-green-700 text-sm space-y-1">
                    <li>• Use strong, unique passwords</li>
                    <li>• Change passwords regularly</li>
                    <li>• Enable two-factor authentication when possible</li>
                    <li>• Monitor admin access logs</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && propertyToDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Delete Property
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete <strong>"{propertyToDelete.title}"</strong>?
                    This action cannot be undone.
                  </p>
                  {propertyToDelete.id.startsWith('uploaded-') ? (
                    <p className="text-xs text-green-600 mt-2">
                      ✓ This is an uploaded property and can be deleted.
                    </p>
                  ) : (
                    <p className="text-xs text-red-600 mt-2">
                      ⚠ This is a default property and cannot be deleted.
                    </p>
                  )}
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={cancelDelete}
                      disabled={deleteLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDelete}
                      disabled={deleteLoading || !propertyToDelete.id.startsWith('uploaded-')}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {deleteLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Property
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete All Confirmation Modal */}
        {showDeleteAllModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Delete All Uploaded Properties
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete <strong>all {uploadedPropertiesCount} uploaded properties</strong>?
                    This action cannot be undone and will only affect properties you have uploaded.
                  </p>
                  <p className="text-xs text-blue-600 mt-2">
                    ℹ Default properties will remain untouched.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={cancelDeleteAll}
                      disabled={deleteAllLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmDeleteAll}
                      disabled={deleteAllLoading || uploadedPropertiesCount === 0}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {deleteAllLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting All...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete All ({uploadedPropertiesCount})
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Remove All Properties Confirmation Modal */}
        {showRemoveAllModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mt-4">
                  Remove All Properties
                </h3>
                <div className="mt-2 px-7 py-3">
                  <p className="text-sm text-gray-500">
                    Are you sure you want to remove <strong>ALL properties</strong> from the website?
                    This will hide all default properties and delete all uploaded properties.
                  </p>
                  <p className="text-xs text-red-600 mt-2">
                    ⚠️ This action will make the website appear empty until you add new properties.
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    ℹ️ You can restore default properties later using the "Restore Defaults" button.
                  </p>
                </div>
                <div className="items-center px-4 py-3">
                  <div className="flex space-x-3 justify-center">
                    <Button
                      variant="outline"
                      onClick={cancelRemoveAll}
                      disabled={removeAllLoading}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={confirmRemoveAll}
                      disabled={removeAllLoading}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {removeAllLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Removing All...
                        </>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove All Properties
                        </>
                      )}
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


