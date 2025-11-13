'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Building2 } from 'lucide-react'
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
    { href: '/', label: 'Home', color: 'blue' },
    { href: '/properties?type=land&purpose=buy', label: 'Buy Land', color: 'green' },
    { href: '/properties?type=house&purpose=rent', label: 'Houses for Rent', color: 'purple' },
    { href: '/properties?type=house&purpose=buy', label: 'Houses for Sale', color: 'orange' },
    { href: '/contact', label: 'Contact', color: 'red' },
  ]

  const adminNavItems = [
    { href: '/upload', label: 'Upload Property', color: 'indigo' },
    { href: '/admin', label: 'Admin', color: 'gray' },
  ]

  const navItems = adminStatus ? [...baseNavItems, ...adminNavItems] : baseNavItems

  const getNavColorClasses = (color: string, isActive: boolean) => {
    const colorMap: Record<
      string,
      {
        active: string
        inactive: string
      }
    > = {
      blue: {
        active: 'text-blue-700 border-blue-700',
        inactive: 'text-gray-600 border-transparent hover:text-blue-700 hover:border-blue-500',
      },
      green: {
        active: 'text-green-700 border-green-700',
        inactive: 'text-gray-600 border-transparent hover:text-green-700 hover:border-green-500',
      },
      purple: {
        active: 'text-purple-700 border-purple-700',
        inactive: 'text-gray-600 border-transparent hover:text-purple-700 hover:border-purple-500',
      },
      orange: {
        active: 'text-orange-700 border-orange-700',
        inactive: 'text-gray-600 border-transparent hover:text-orange-700 hover:border-orange-500',
      },
      red: {
        active: 'text-red-700 border-red-700',
        inactive: 'text-gray-600 border-transparent hover:text-red-700 hover:border-red-500',
      },
      indigo: {
        active: 'text-indigo-700 border-indigo-700',
        inactive: 'text-gray-600 border-transparent hover:text-indigo-700 hover:border-indigo-500',
      },
      gray: {
        active: 'text-gray-900 border-gray-900',
        inactive: 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-500',
      },
    }

    const colors = colorMap[color] || colorMap.gray
    return isActive ? colors.active : colors.inactive
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
              const isActive =
                pathname === item.href ||
                (item.href.startsWith('/properties') && pathname.startsWith('/properties')) ||
                (item.href === '/admin' && pathname.startsWith('/admin'))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'text-sm font-medium transition-colors border-b-2',
                    getNavColorClasses(item.color, isActive)
                  )}
                >
                  {item.label}
                </Link>
              )
            })}

            {/* Admin Login/Logout */}
            {adminStatus ? (
              <button
                onClick={handleLogout}
                className="ml-6 text-sm font-medium text-gray-600 hover:text-red-600 transition-colors border-b-2 border-transparent hover:border-red-400"
              >
                Logout Admin
              </button>
            ) : (
              <Link
                href="/admin-login"
                className="ml-6 text-sm font-medium text-gray-600 hover:text-green-600 transition-colors border-b-2 border-transparent hover:border-green-400"
              >
                Admin Login
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

        {/* Mobile Navigation Menu - left dark drawer like reference design */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            {/* Clickable backdrop on the right to close */}
            <button
              className="absolute inset-y-0 right-0 w-1/4 bg-transparent"
              aria-label="Close menu"
              onClick={toggleMobileMenu}
            />

            {/* Dark drawer */}
            <div className="relative h-full w-3/4 max-w-xs bg-slate-950">
              {/* Close pill in the top-right corner of the drawer */}
              <div className="flex justify-end px-4 pt-5 pb-2">
                <button
                  onClick={toggleMobileMenu}
                  aria-label="Close menu"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-400 bg-slate-900 text-emerald-300 shadow-sm"
                >
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Menu items */}
              <nav className="px-6 py-4 space-y-6">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href.startsWith('/properties') &&
                      pathname.startsWith('/properties')) ||
                    (item.href === '/admin' && pathname.startsWith('/admin'))

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        'block text-base font-medium',
                        isActive ? 'text-white' : 'text-slate-100'
                      )}
                    >
                      {item.label}
                    </Link>
                  )
                })}

                {/* Mobile Admin Login/Logout */}
                <div className="pt-4 space-y-2">
                  {adminStatus ? (
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left text-base font-medium text-slate-100"
                    >
                      Admin Logout
                    </button>
                  ) : (
                    <Link
                      href="/admin-login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block text-base font-medium text-slate-100"
                    >
                      Admin Login
                    </Link>
                  )}
                </div>
              </nav>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar


