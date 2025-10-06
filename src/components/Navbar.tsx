'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Building2, Home, Key, Upload, Phone, Settings, LogIn, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { isAdminLoggedIn, logoutAdmin } from '@/lib/auth'

const Navbar = () => {
  const pathname = usePathname()
  const [adminStatus, setAdminStatus] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setAdminStatus(isAdminLoggedIn())
    
    // Listen for admin status changes
    const handleStorageChange = () => {
      setAdminStatus(isAdminLoggedIn())
    }
    
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('adminStatusChanged', handleStorageChange)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('adminStatusChanged', handleStorageChange)
    }
  }, [])

  const handleLogout = () => {
    logoutAdmin()
    setAdminStatus(false)
    setIsMobileMenuOpen(false)
    window.dispatchEvent(new CustomEvent('adminStatusChanged'))
    // Redirect to home page
    window.location.href = '/'
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const baseNavItems = [
    { href: '/', label: 'Home', icon: Home, color: 'blue' },
    { href: '/properties?type=land&purpose=buy', label: 'Buy Land', icon: Building2, color: 'green' },
    { href: '/properties?type=house&purpose=rent', label: 'Houses for Rent', icon: Key, color: 'purple' },
    { href: '/properties?type=house&purpose=buy', label: 'Houses for Sale', icon: Building2, color: 'orange' },
    { href: '/contact', label: 'Contact', icon: Phone, color: 'red' },
  ]

  const adminNavItems = [
    { href: '/upload', label: 'Upload Property', icon: Upload, color: 'indigo' },
    { href: '/admin', label: 'Admin', icon: Settings, color: 'gray' },
  ]

  const navItems = adminStatus ? [...baseNavItems, ...adminNavItems] : baseNavItems

  const getColorClasses = (color: string, isActive: boolean) => {
    const colorMap = {
      blue: {
        active: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 border-2 border-blue-400',
        hover: 'hover:bg-gradient-to-r hover:from-blue-400 hover:to-blue-500 hover:text-white hover:shadow-xl hover:shadow-blue-300 hover:scale-105',
        icon: 'text-white',
        inactive: 'text-gray-600 hover:text-blue-600'
      },
      green: {
        active: 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg shadow-green-200 border-2 border-green-400',
        hover: 'hover:bg-gradient-to-r hover:from-green-400 hover:to-green-500 hover:text-white hover:shadow-xl hover:shadow-green-300 hover:scale-105',
        icon: 'text-white',
        inactive: 'text-gray-600 hover:text-green-600'
      },
      purple: {
        active: 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 border-2 border-purple-400',
        hover: 'hover:bg-gradient-to-r hover:from-purple-400 hover:to-purple-500 hover:text-white hover:shadow-xl hover:shadow-purple-300 hover:scale-105',
        icon: 'text-white',
        inactive: 'text-gray-600 hover:text-purple-600'
      },
      orange: {
        active: 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200 border-2 border-orange-400',
        hover: 'hover:bg-gradient-to-r hover:from-orange-400 hover:to-orange-500 hover:text-white hover:shadow-xl hover:shadow-orange-300 hover:scale-105',
        icon: 'text-white',
        inactive: 'text-gray-600 hover:text-orange-600'
      },
      red: {
        active: 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-200 border-2 border-red-400',
        hover: 'hover:bg-gradient-to-r hover:from-red-400 hover:to-red-500 hover:text-white hover:shadow-xl hover:shadow-red-300 hover:scale-105',
        icon: 'text-white',
        inactive: 'text-gray-600 hover:text-red-600'
      },
      indigo: {
        active: 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200 border-2 border-indigo-400',
        hover: 'hover:bg-gradient-to-r hover:from-indigo-400 hover:to-indigo-500 hover:text-white hover:shadow-xl hover:shadow-indigo-300 hover:scale-105',
        icon: 'text-white',
        inactive: 'text-gray-600 hover:text-indigo-600'
      },
      gray: {
        active: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg shadow-gray-200 border-2 border-gray-400',
        hover: 'hover:bg-gradient-to-r hover:from-gray-400 hover:to-gray-500 hover:text-white hover:shadow-xl hover:shadow-gray-300 hover:scale-105',
        icon: 'text-white',
        inactive: 'text-gray-600 hover:text-gray-600'
      }
    }

    const colors = colorMap[color as keyof typeof colorMap] || colorMap.blue
    
    return {
      container: isActive ? colors.active : `bg-white/80 backdrop-blur-sm ${colors.hover} border-2 border-transparent`,
      icon: isActive ? colors.icon : colors.inactive
    }
  }

  return (
    <nav className="bg-white/95 backdrop-blur-lg shadow-xl border-b border-gray-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Building2 className="h-10 w-10 text-primary-600 transition-all duration-300 group-hover:rotate-12 group-hover:text-primary-700" />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-600 rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-primary-700">King Lemuel</h1>
                <p className="text-sm text-gray-600 -mt-1 transition-colors duration-300 group-hover:text-primary-600">Properties</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || 
                (item.href.startsWith('/properties') && pathname.startsWith('/properties')) ||
                (item.href === '/admin' && pathname.startsWith('/admin'))
              
              const colorClasses = getColorClasses(item.color, isActive)
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden",
                    colorClasses.container
                  )}
                >
                  {/* Animated background effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                  
                  <Icon className={cn("h-4 w-4 transition-all duration-300 group-hover:rotate-12", colorClasses.icon)} />
                  <span className="relative transition-all duration-300 group-hover:translate-x-1">{item.label}</span>
                  
                  {/* Subtle glow effect for active state */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                  )}
                </Link>
              )
            })}
            
            {/* Admin Login/Logout */}
            {adminStatus ? (
              <button
                onClick={handleLogout}
                className="group relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 border border-red-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-red-300 active:scale-95 overflow-hidden"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                
                <LogOut className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
                <span className="relative transition-all duration-300 group-hover:translate-x-1">Logout Admin</span>
                
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
              </button>
            ) : (
              <Link
                href="/admin-login"
                className="group relative flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200 border border-green-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-green-300 active:scale-95 overflow-hidden"
              >
                {/* Animated background effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                
                <LogIn className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
                <span className="relative transition-all duration-300 group-hover:translate-x-1">Admin Login</span>
                
                {/* Pulse effect */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="relative p-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md shadow-primary-200 transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary-300"
              aria-label="Toggle menu"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-primary-500 rounded-lg opacity-0 transition-opacity duration-300 hover:opacity-100" />
              <div className="relative">
                {isMobileMenuOpen ? (
                  <svg className="h-5 w-5 transition-transform duration-300 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-t border-gray-200 shadow-2xl animate-slide-down">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item, index) => {
                const Icon = item.icon
                const isActive = pathname === item.href || 
                  (item.href.startsWith('/properties') && pathname.startsWith('/properties')) ||
                  (item.href === '/admin' && pathname.startsWith('/admin'))
                
                const colorClasses = getColorClasses(item.color, isActive)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      "group relative flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden",
                      colorClasses.container
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    
                    <Icon className={cn("h-4 w-4 transition-all duration-300 group-hover:rotate-12", colorClasses.icon)} />
                    <span className="relative transition-all duration-300 group-hover:translate-x-1">{item.label}</span>
                    
                    {/* Subtle glow effect for active state */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                    )}
                  </Link>
                )
              })}
              
              {/* Mobile Admin Login/Logout */}
              <div className="border-t border-gray-200 pt-3 mt-3">
                {adminStatus ? (
                  <button
                    onClick={handleLogout}
                    className="group relative flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md shadow-red-200 border border-red-400 transition-all duration-300 transform hover:scale-105 active:scale-95 w-full text-left overflow-hidden"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    
                    <LogOut className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
                    <span className="relative transition-all duration-300 group-hover:translate-x-1">Logout Admin</span>
                    
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                  </button>
                ) : (
                  <Link
                    href="/admin-login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group relative flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md shadow-green-200 border border-green-400 transition-all duration-300 transform hover:scale-105 active:scale-95 overflow-hidden"
                  >
                    {/* Animated background effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out" />
                    
                    <LogIn className="h-4 w-4 transition-all duration-300 group-hover:rotate-12" />
                    <span className="relative transition-all duration-300 group-hover:translate-x-1">Admin Login</span>
                    
                    {/* Pulse effect */}
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar


