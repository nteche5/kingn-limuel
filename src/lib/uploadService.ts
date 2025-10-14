import { supabase } from './supabase'

export interface UploadResult {
  success: boolean
  file?: {
    name: string
    path: string
    url: string
    size: number
    type: string
  }
  error?: string
}

// Upload file to Supabase Storage
export const uploadFile = async (
  file: File,
  folder: string = 'uploads',
  propertyId?: string,
  maxSizeMb: number = 10
): Promise<UploadResult> => {
  try {
    // Validate file size (configurable, default 10MB)
    const maxSize = maxSizeMb * 1024 * 1024
    if (file.size > maxSize) {
      return {
        success: false,
        error: `File size too large. Maximum size is ${maxSizeMb}MB.`
      }
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'application/pdf',
      'video/mp4',
      'video/webm',
      'video/quicktime', // MOV
      'video/x-msvideo'  // AVI
    ]

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'Invalid file type. Allowed types: JPEG, PNG, WebP, PDF, MP4, WebM.'
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const fileExtension = file.name.split('.').pop()
    const fileName = `${timestamp}-${randomString}.${fileExtension}`

    // Create file path
    const filePath = propertyId ? `${folder}/${propertyId}/${fileName}` : `${folder}/${fileName}`

    // Upload to Supabase Storage (use File directly for better browser/mobile support)
    const { data, error } = await supabase.storage
      .from('property-files')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error('Error uploading file:', error)
      return {
        success: false,
        error: 'Failed to upload file'
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('property-files')
      .getPublicUrl(filePath)

    return {
      success: true,
      file: {
        name: fileName,
        path: filePath,
        url: urlData.publicUrl,
        size: file.size,
        type: file.type
      }
    }
  } catch (error) {
    console.error('Error uploading file:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Delete file from Supabase Storage
export const deleteFile = async (filePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase.storage
      .from('property-files')
      .remove([filePath])

    if (error) {
      console.error('Error deleting file:', error)
      return {
        success: false,
        error: 'Failed to delete file'
      }
    }

    return {
      success: true
    }
  } catch (error) {
    console.error('Error deleting file:', error)
    return {
      success: false,
      error: 'An unexpected error occurred'
    }
  }
}

// Upload multiple files
export const uploadMultipleFiles = async (
  files: File[],
  folder: string = 'uploads',
  propertyId?: string
): Promise<UploadResult[]> => {
  const uploadPromises = files.map(file => uploadFile(file, folder, propertyId))
  return Promise.all(uploadPromises)
}

// Get file URL from path
export const getFileUrl = (filePath: string): string => {
  const { data } = supabase.storage
    .from('property-files')
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

// List files in a folder
export const listFiles = async (folder: string, propertyId?: string) => {
  try {
    const folderPath = propertyId ? `${folder}/${propertyId}` : folder
    
    const { data, error } = await supabase.storage
      .from('property-files')
      .list(folderPath)

    if (error) {
      throw new Error(error.message)
    }

    return data || []
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

// Create folder structure for property
export const createPropertyFolder = async (propertyId: string): Promise<void> => {
  try {
    // Create folders for different file types
    const folders = ['images', 'documents', 'videos']
    
    for (const folder of folders) {
      const folderPath = `properties/${propertyId}/${folder}`
      
      // Try to create folder by uploading a dummy file and then deleting it
      const dummyFile = new File([''], '.gitkeep', { type: 'text/plain' })
      
      const { error: uploadError } = await supabase.storage
        .from('property-files')
        .upload(`${folderPath}/.gitkeep`, dummyFile)
      
      if (uploadError && !uploadError.message.includes('already exists')) {
        console.error(`Error creating folder ${folderPath}:`, uploadError)
      }
    }
  } catch (error) {
    console.error('Error creating property folder:', error)
    // Don't throw error as this is not critical
  }
}
