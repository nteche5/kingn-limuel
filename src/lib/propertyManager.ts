import { Property } from '@/types'
import propertiesData from '@/data/properties.json'

const STORAGE_KEY = 'king-limuel-properties'

// Get all properties (both from JSON and localStorage)
export const getAllProperties = (): Property[] => {
  try {
    // Check if default properties should be hidden
    const hideDefaults = shouldHideDefaultProperties()
    
    // Get properties from localStorage
    const storedProperties = localStorage.getItem(STORAGE_KEY)
    const uploadedProperties: Property[] = storedProperties ? JSON.parse(storedProperties) : []
    
    // Combine properties based on hideDefaults flag
    const allProperties: Property[] = [
      // Only include default properties if not hidden
      ...(hideDefaults ? [] : propertiesData.map(property => ({
        ...property,
        createdAt: new Date(property.createdAt)
      })) as Property[]),
      // Always include uploaded properties
      ...uploadedProperties.map(property => ({
        ...property,
        createdAt: new Date(property.createdAt)
      })) as Property[]
    ]
    
    // Sort by creation date (newest first)
    return allProperties.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  } catch (error) {
    console.error('Error loading properties:', error)
    // Fallback to just JSON data (unless hidden)
    if (shouldHideDefaultProperties()) {
      return []
    }
    return propertiesData.map(property => ({
      ...property,
      createdAt: new Date(property.createdAt)
    })) as Property[]
  }
}

// Add a new property to localStorage
export const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt'>): Property => {
  try {
    // Get existing uploaded properties
    const storedProperties = localStorage.getItem(STORAGE_KEY)
    const uploadedProperties: Property[] = storedProperties ? JSON.parse(storedProperties) : []
    
    // Create new property with ID and timestamp
    const newProperty: Property = {
      ...propertyData,
      id: `uploaded-${Date.now()}`, // Generate unique ID
      createdAt: new Date()
    }
    
    // Add to uploaded properties
    uploadedProperties.push(newProperty)
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedProperties))
    
    return newProperty
  } catch (error) {
    console.error('Error saving property:', error)
    throw new Error('Failed to save property')
  }
}

// Get a specific property by ID
export const getPropertyById = (id: string): Property | null => {
  const allProperties = getAllProperties()
  return allProperties.find(property => property.id === id) || null
}

// Delete a property by ID
export const deleteProperty = (id: string): boolean => {
  try {
    // Get existing uploaded properties
    const storedProperties = localStorage.getItem(STORAGE_KEY)
    const uploadedProperties: Property[] = storedProperties ? JSON.parse(storedProperties) : []
    
    // Find the property to delete
    const propertyIndex = uploadedProperties.findIndex(property => property.id === id)
    
    if (propertyIndex === -1) {
      // Property not found in uploaded properties
      // Check if it's a default property (from JSON)
      const defaultProperty = propertiesData.find(property => property.id === id)
      if (defaultProperty) {
        throw new Error('Cannot delete default properties. Only uploaded properties can be deleted.')
      }
      return false
    }
    
    // Remove the property from the array
    uploadedProperties.splice(propertyIndex, 1)
    
    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedProperties))
    
    return true
  } catch (error) {
    console.error('Error deleting property:', error)
    throw error
  }
}

// Clear all uploaded properties (for testing)
export const clearUploadedProperties = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}

// Delete all uploaded properties with confirmation
export const deleteAllUploadedProperties = (): boolean => {
  try {
    const storedProperties = localStorage.getItem(STORAGE_KEY)
    const uploadedProperties: Property[] = storedProperties ? JSON.parse(storedProperties) : []
    
    if (uploadedProperties.length === 0) {
      return false // No properties to delete
    }
    
    // Clear all uploaded properties
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (error) {
    console.error('Error deleting all properties:', error)
    throw error
  }
}

// Remove ALL properties from the website (including default ones)
export const removeAllProperties = (): boolean => {
  try {
    // Clear all uploaded properties
    localStorage.removeItem(STORAGE_KEY)
    
    // Set a flag to hide default properties
    localStorage.setItem('hide-default-properties', 'true')
    
    return true
  } catch (error) {
    console.error('Error removing all properties:', error)
    throw error
  }
}

// Check if default properties should be hidden
export const shouldHideDefaultProperties = (): boolean => {
  try {
    return localStorage.getItem('hide-default-properties') === 'true'
  } catch (error) {
    return false
  }
}

// Restore default properties
export const restoreDefaultProperties = (): boolean => {
  try {
    localStorage.removeItem('hide-default-properties')
    return true
  } catch (error) {
    console.error('Error restoring default properties:', error)
    throw error
  }
}
