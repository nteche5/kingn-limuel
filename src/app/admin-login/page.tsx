'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Check if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('admin-logged-in') === 'true'
    if (isLoggedIn) {
      router.push('/admin')
    }
  }, [router])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Check credentials against environment variables
      const isValidCredentials = 
        formData.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL && 
        formData.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD

      // Debug logging (remove in production)
      console.log('Login attempt:', {
        email: formData.email,
        password: formData.password,
        expectedEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        expectedPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
        emailMatch: formData.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL,
        passwordMatch: formData.password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
        isValidCredentials,
        envVars: {
          adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
          adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD
        }
      })

      if (isValidCredentials) {
        // Store login state
        localStorage.setItem('admin-logged-in', 'true')
        if (rememberMe) {
          localStorage.setItem('admin-remember', 'true')
        }
        
        // Redirect to admin dashboard
        router.push('/admin')
      } else {
        setError('Invalid username or password')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Debug: Check if environment variables are loaded
  console.log('Environment check:', {
    adminEmail: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    adminPassword: process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
    hasEmail: !!process.env.NEXT_PUBLIC_ADMIN_EMAIL,
    hasPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD
  })

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Background Blur Effect */}
      <div className="absolute inset-0 backdrop-blur-3xl"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-sm sm:max-w-md mx-auto">
          {/* User Icon */}
          <div className="flex justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-2xl">
                <User className="w-8 h-8 sm:w-10 sm:h-10 text-white text-opacity-80" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-white bg-opacity-30 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-white bg-opacity-60 rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Login Form Container */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl border border-white border-opacity-20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white text-opacity-60" />
                  </div>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Email Address"
                    className="pl-10 bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-60 focus:bg-opacity-30 focus:border-opacity-50 rounded-xl h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white text-opacity-60" />
                  </div>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="••••••••••"
                    className="pl-10 pr-10 bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-60 focus:bg-opacity-30 focus:border-opacity-50 rounded-xl h-11 sm:h-12 text-sm sm:text-base"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white text-opacity-60 hover:text-opacity-80" />
                    ) : (
                      <Eye className="h-5 w-5 text-white text-opacity-60 hover:text-opacity-80" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 bg-white bg-opacity-20 border-white border-opacity-30 rounded focus:ring-2 focus:ring-white focus:ring-opacity-50"
                  />
                  <span className="text-white text-opacity-80 text-xs sm:text-sm">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-white text-opacity-80 hover:text-opacity-100 text-xs sm:text-sm transition-opacity text-left sm:text-right"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-400 border-opacity-30 rounded-lg p-3 flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-300" />
                  <span className="text-red-200 text-sm">{error}</span>
                </div>
              )}

              {/* Login Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm sm:text-base"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    <span>Logging in...</span>
                  </div>
                ) : (
                  'LOGIN'
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-6 sm:mt-8">
            <p className="text-white text-opacity-60 text-xs sm:text-sm">
              King Lemuel Properties Admin Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}