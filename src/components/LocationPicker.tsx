'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'

interface LocationPickerProps {
  initialLocation?: {
    lat: number
    lng: number
  }
  onLocationChange: (location: { lat: number; lng: number; address?: string }) => void
  className?: string
}

const LocationPicker = ({ 
  initialLocation = { lat: 9.4008, lng: -0.8393 }, // Default to Tamale, Ghana
  onLocationChange,
  className = ''
}: LocationPickerProps) => {
  const [currentLocation, setCurrentLocation] = useState(initialLocation)
  const [address, setAddress] = useState('')

  const updateLocation = (lat: number, lng: number) => {
    const newLocation = { lat, lng }
    setCurrentLocation(newLocation)
    onLocationChange(newLocation)
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Location Display */}
      <div className="w-full h-80 rounded-lg border border-gray-300 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center p-6">
          <MapPin className="h-16 w-16 text-primary-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Property Location</h3>
          <p className="text-gray-600 mb-4">
            Enter the exact coordinates of your property below.
          </p>
          <div className="bg-white bg-opacity-80 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Current Coordinates:</strong><br />
              Latitude: {currentLocation.lat.toFixed(6)}<br />
              Longitude: {currentLocation.lng.toFixed(6)}
            </p>
          </div>
        </div>
      </div>

      {/* Manual Coordinate Input */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Latitude *
          </label>
          <input
            type="number"
            step="any"
            value={currentLocation.lat}
            onChange={(e) => {
              const lat = parseFloat(e.target.value)
              if (!isNaN(lat)) {
                updateLocation(lat, currentLocation.lng)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="e.g., 9.400800"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the latitude coordinate (e.g., 9.400800 for Tamale)
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Longitude *
          </label>
          <input
            type="number"
            step="any"
            value={currentLocation.lng}
            onChange={(e) => {
              const lng = parseFloat(e.target.value)
              if (!isNaN(lng)) {
                updateLocation(currentLocation.lat, lng)
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="e.g., -0.839300"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the longitude coordinate (e.g., -0.839300 for Tamale)
          </p>
        </div>
      </div>

      {/* Quick Location Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => updateLocation(9.4008, -0.8393)}
          className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Tamale
        </button>
        <button
          type="button"
          onClick={() => updateLocation(5.5593, -0.1974)}
          className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Accra
        </button>
        <button
          type="button"
          onClick={() => updateLocation(6.6885, -1.6244)}
          className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Kumasi
        </button>
        <button
          type="button"
          onClick={() => updateLocation(4.9267, -1.7577)}
          className="px-3 py-2 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
        >
          Takoradi
        </button>
      </div>

      {/* Location Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <MapPin className="h-5 w-5 text-primary-600 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Selected Location</p>
            <p className="text-sm text-gray-500 mt-1">
              Coordinates: {currentLocation.lat.toFixed(6)}, {currentLocation.lng.toFixed(6)}
            </p>
            <p className="text-xs text-blue-600 mt-2">
              💡 You can find coordinates using online tools like Google Maps or GPS apps
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationPicker
