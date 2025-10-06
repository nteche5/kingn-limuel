'use client'

import { useState, useRef, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Video, FileText, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { UploadedFile } from '@/types'

interface FileUploaderProps {
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  type: 'image' | 'video' | 'document'
  multiple?: boolean
  maxFiles?: number
  maxSize?: number // in MB
  accept?: string
  label?: string
}

const FileUploader = ({
  files,
  onFilesChange,
  type,
  multiple = false,
  maxFiles = 5,
  maxSize = 10,
  accept,
  label
}: FileUploaderProps) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showClearAllConfirm, setShowClearAllConfirm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getDefaultAccept = () => {
    switch (type) {
      case 'image':
        return 'image/*'
      case 'video':
        return 'video/*'
      case 'document':
        return '.pdf,.doc,.docx,.jpg,.jpeg,.png'
      default:
        return '*/*'
    }
  }

  const getIcon = () => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-8 w-8 text-gray-400" />
      case 'video':
        return <Video className="h-8 w-8 text-gray-400" />
      case 'document':
        return <FileText className="h-8 w-8 text-gray-400" />
      default:
        return <Upload className="h-8 w-8 text-gray-400" />
    }
  }

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`
    }

    if (type === 'image' && !file.type.startsWith('image/')) {
      return 'Please upload a valid image file'
    }

    if (type === 'video' && !file.type.startsWith('video/')) {
      return 'Please upload a valid video file'
    }

    if (type === 'document') {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'image/jpeg',
        'image/jpg',
        'image/png'
      ]
      if (!allowedTypes.includes(file.type)) {
        return 'Please upload a valid document (PDF, DOC, DOCX, JPG, PNG)'
      }
    }

    return null
  }

  const handleFiles = useCallback((newFiles: FileList | File[]) => {
    setError(null)
    const fileArray = Array.from(newFiles)

    // Check if adding these files would exceed maxFiles
    if (files.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} files allowed`)
      return
    }

    const validFiles: UploadedFile[] = []
    const errors: string[] = []

    fileArray.forEach((file) => {
      const validationError = validateFile(file)
      if (validationError) {
        errors.push(`${file.name}: ${validationError}`)
      } else {
        const uploadedFile: UploadedFile = {
          file,
          preview: URL.createObjectURL(file),
          type
        }
        validFiles.push(uploadedFile)
      }
    })

    if (errors.length > 0) {
      setError(errors.join(', '))
    }

    if (validFiles.length > 0) {
      onFilesChange([...files, ...validFiles])
    }
  }, [files, onFilesChange, maxFiles, maxSize, type])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index)
    onFilesChange(newFiles)
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragOver
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept || getDefaultAccept()}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="space-y-2">
          {getIcon()}
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary-600 hover:text-primary-500">
              Click to upload
            </span>
            {' '}or drag and drop
          </div>
          <div className="text-xs text-gray-500">
            {type === 'image' && 'PNG, JPG, GIF up to 10MB'}
            {type === 'video' && 'MP4, MOV, AVI up to 100MB'}
            {type === 'document' && 'PDF, DOC, DOCX, JPG, PNG up to 10MB'}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
          {error}
        </div>
      )}

      {/* File Previews */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-gray-700">
              Uploaded Files ({files.length})
            </h4>
            {files.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowClearAllConfirm(true)}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                <X className="h-3 w-3 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {files.map((uploadedFile, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {type === 'image' ? (
                    <img
                      src={uploadedFile.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : type === 'video' ? (
                    <video
                      src={uploadedFile.preview}
                      className="w-full h-full object-cover"
                      controls
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeFile(index)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 opacity-100 transition-all duration-200 shadow-lg hover:shadow-xl"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>

                {/* File Name */}
                <div className="mt-1 text-xs text-gray-600 truncate">
                  {uploadedFile.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearAllConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <X className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mt-4">
                Clear All Files
              </h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  Are you sure you want to remove all {files.length} uploaded files?
                </p>
                <p className="text-xs text-red-600 mt-2">
                  ⚠️ This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <div className="flex space-x-3 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowClearAllConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      onFilesChange([])
                      setShowClearAllConfirm(false)
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Files
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FileUploader


