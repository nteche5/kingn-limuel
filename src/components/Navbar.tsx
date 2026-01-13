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
    <nav className="bg-gray-900 shadow-2xl border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Text Only */}
          <Link href="/" className="group flex items-center transition-all duration-300">
            <div>
              <h1 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-blue-400">King Lemuel</h1>
              <p className="text-sm text-gray-400 -mt-1 transition-colors duration-300 group-hover:text-blue-300">Properties</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href.startsWith('/properties') && pathname.startsWith('/properties')) ||
                (item.href === '/admin' && pathname.startsWith('/admin'))

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-4 py-2 text-sm font-medium text-gray-300 transition-all duration-300 group"
                >
                  {/* Text */}
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">{item.label}</span>

                  {/* Hover background - only shows on hover */}
                  <span className="absolute inset-0 bg-gray-800 opacity-0 group-hover:opacity-100 rounded-lg transition-all duration-300" />

                  {/* Active indicator - subtle underline */}
                  {isActive && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-blue-500 rounded-full" />
                  )}
                </Link>
              )
            })}

            {/* Admin Login/Logout Button */}
            {adminStatus ? (
              <button
                onClick={handleLogout}
                className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg shadow-lg shadow-red-900/50 hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/admin-login"
                className="ml-2 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg shadow-lg shadow-emerald-900/50 hover:bg-emerald-700 transition-all duration-300 transform hover:scale-105"
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

        {/* Mobile Navigation Menu - partial left drawer */}
        {isMobileMenuOpen && (
          <>
            {/* Transparent backdrop to detect outside clicks */}
            <button
              className="fixed inset-y-0 right-0 left-[70vw] bg-transparent z-40 md:hidden"
              aria-label="Close menu"
              onClick={toggleMobileMenu}
            />

            <div className="fixed inset-y-0 left-0 w-[70vw] max-w-xs bg-gradient-to-b from-[#020714] to-[#050811] text-white shadow-2xl z-50 md:hidden animate-slide-left min-h-screen">
              <div className="relative h-full px-6 py-10 flex flex-col justify-start space-y-6">
                <button
                  onClick={toggleMobileMenu}
                  aria-label="Close menu"
                  className="absolute -right-5 top-6 flex h-10 w-10 items-center justify-center rounded-full border-2 border-emerald-400 bg-slate-900 text-emerald-200 shadow-lg"
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

                <nav className="mt-10 space-y-4">
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
                          'block text-lg font-semibold tracking-wide transition-colors animate-fade-in',
                          isActive ? 'text-white' : 'text-slate-200 hover:text-white'
                        )}
                        style={{ textShadow: '0 6px 18px rgba(0, 0, 0, 0.5)' }}
                      >
                        {item.label}
                      </Link>
                    )
                  })}

                  <div className="border-t border-white/10 pt-6 space-y-2">
                    {adminStatus ? (
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-base font-medium text-slate-100"
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
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar


