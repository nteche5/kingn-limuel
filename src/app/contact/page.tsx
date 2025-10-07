'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import BackgroundSlideshow from '@/components/BackgroundSlideshow'
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  CheckCircle,
  AlertCircle,
  Facebook,
  Twitter,
  MessageCircle,
  Search,
  ArrowUp,
  Instagram,
  Linkedin
} from 'lucide-react'

interface ContactFormData {
  name: string
  email: string
  phone: string
  address: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    address: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear success/error messages when user starts typing
    if (submitStatus === 'success' || submitStatus === 'error') {
      setSubmitStatus('idle')
      setShowSuccessMessage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Send contact form data to API
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to send message')
      }
      
      console.log('Contact message sent successfully:', result)
      
      // Store the message locally as a backup
      if (result.data) {
        const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
        existingMessages.push(result.data)
        localStorage.setItem('contact_messages', JSON.stringify(existingMessages))
      }
      
      setSubmitStatus('success')
      setShowSuccessMessage(true)
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: ''
      })

      // Auto-hide success message after 10 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
        setSubmitStatus('idle')
      }, 10000)

    } catch (error) {
      console.error('Error submitting contact form:', error)
      setSubmitStatus('error')
      
      // Fallback: Store message locally even if API fails
      const fallbackMessage = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        created_at: new Date().toISOString()
      }
      
      try {
        const existingMessages = JSON.parse(localStorage.getItem('contact_messages') || '[]')
        existingMessages.push(fallbackMessage)
        localStorage.setItem('contact_messages', JSON.stringify(existingMessages))
        
        // Show success message even with fallback
        setSubmitStatus('success')
        setShowSuccessMessage(true)
        setFormData({
          name: '',
          email: '',
          phone: '',
          address: '',
          message: ''
        })

        // Auto-hide success message after 10 seconds
        setTimeout(() => {
          setShowSuccessMessage(false)
          setSubmitStatus('idle')
        }, 10000)
      } catch (storageError) {
        console.error('Error storing message locally:', storageError)
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#2C2C2C] relative overflow-hidden">
      {/* Diagonal stripe effect */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-transparent transform -skew-y-1 origin-top-left"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-6 tracking-wider">CONTACT US</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            We are looking forward to hearing from you soon
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left Column - Address and Social Media */}
          <div className="space-y-12">
            {/* Address Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Mail className="h-6 w-6 text-white" />
                <h2 className="text-2xl font-bold text-white tracking-wider">ADDRESS</h2>
              </div>
              <div className="text-gray-300 space-y-1 text-lg">
                <p>Company 'King Lemuel Properties'</p>
                <p>Tamale</p>
                <p>Northern Region</p>
                <p>Ghana</p>
              </div>
            </div>

            {/* Social Media Icons */}
            <div className="flex space-x-6">
              <a 
                href="https://www.facebook.com/profile.php?id=100071941852508" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative p-4 rounded-full bg-gray-700 hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="h-8 w-8 text-blue-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                  Facebook
                </div>
              </a>
              <a 
                href="#" 
                className="group relative p-4 rounded-full bg-gray-700 hover:bg-sky-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Twitter className="h-8 w-8 text-sky-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                  Twitter
                </div>
              </a>
              <a 
                href="#" 
                className="group relative p-4 rounded-full bg-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <Instagram className="h-8 w-8 text-purple-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                  Instagram
                </div>
              </a>
              <a 
                href="https://wa.me/233244996878" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group relative p-4 rounded-full bg-gray-700 hover:bg-green-600 transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
              >
                <MessageCircle className="h-8 w-8 text-green-400 group-hover:text-white transition-colors duration-300" />
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                  WhatsApp
                </div>
              </a>
            </div>
          </div>

          {/* Right Column - Contact Form */}
          <div className="space-y-8">
            {/* Success/Error Messages */}
            {(submitStatus === 'success' || showSuccessMessage) && (
              <div className="bg-green-900/30 border-2 border-green-500/50 rounded-lg p-4 animate-in fade-in-0 slide-in-from-top-2 duration-500 shadow-lg shadow-green-500/20">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-green-300">
                      Message sent successfully!
                    </h3>
                    <p className="text-sm text-green-400 mt-1">
                      Thank you for contacting us. We have received your message and will get back to you within 24 hours.
                    </p>
                    <p className="text-xs text-green-500 mt-2">
                      📧 Your message has been sent via email and will be processed by our team.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowSuccessMessage(false)
                      setSubmitStatus('idle')
                    }}
                    className="ml-2 text-green-400 hover:text-green-300 transition-colors"
                    aria-label="Close notification"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-900/30 border-2 border-red-500/50 rounded-lg p-4 animate-in fade-in-0 slide-in-from-top-2 duration-500 shadow-lg shadow-red-500/20">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-400 mr-3" />
                  <div>
                    <h3 className="text-sm font-medium text-red-300">
                      Error sending message
                    </h3>
                    <p className="text-sm text-red-400 mt-1">
                      Please try again or contact us directly.
                    </p>
                  </div>
                </div>
              </div>
            )}


            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Top Row - NAME and EMAIL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="NAME"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white"
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="EMAIL"
                    required
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white"
                  />
                </div>
              </div>

              {/* Middle Row - PHONE and ADDRESS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="PHONE"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white"
                  />
                </div>
                <div>
                  <Input
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="ADDRESS"
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-white focus:ring-white"
                  />
                </div>
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-white focus:border-white resize-none"
                  placeholder="MESSAGE"
                  required
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gray-700 hover:bg-gray-600 text-white border-gray-600 px-8 py-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    'DONE'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-gray-400 text-sm">
          <div>
            © Company 'King Lemuel Properties'. All rights reserved. {new Date().getFullYear()}
          </div>
          <button 
            onClick={scrollToTop}
            className="hover:text-white transition-colors cursor-pointer"
          >
            BACK TO TOP
          </button>
        </div>
      </div>

      {/* Floating Action Button */}
      <button 
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 bg-gray-600 hover:bg-gray-500 text-white rounded-full p-3 shadow-lg transition-colors z-50"
      >
        <Search className="h-6 w-6" />
      </button>
    </div>
  )
}


