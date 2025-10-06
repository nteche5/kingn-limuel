import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user'
}

// Simple authentication utility for admin access (legacy support)
export const requireAdmin = (): boolean => {
  if (typeof window === 'undefined') {
    return false // Server-side, always false
  }
  
  const isLoggedIn = localStorage.getItem('admin-logged-in') === 'true'
  return isLoggedIn
}

export const loginAdmin = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin-logged-in', 'true')
  }
}

export const logoutAdmin = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin-logged-in')
    localStorage.removeItem('admin-remember')
  }
}

export const isAdminLoggedIn = (): boolean => {
  return requireAdmin()
}

// New Supabase-based authentication functions
export const signIn = async (email: string, password: string): Promise<{ user: User | null; error: string | null }> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      return { user: null, error: error.message }
    }

    if (!data.user) {
      return { user: null, error: 'Authentication failed' }
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('email', email)
      .single()

    if (profileError || !userProfile) {
      return { user: null, error: 'User profile not found' }
    }

    return {
      user: {
        id: data.user.id,
        email: data.user.email!,
        name: userProfile.name,
        role: userProfile.role as 'admin' | 'user'
      },
      error: null
    }
  } catch (error) {
    return { user: null, error: 'An unexpected error occurred' }
  }
}

export const signOut = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signOut()
    return { error: error?.message || null }
  } catch (error) {
    return { error: 'An unexpected error occurred' }
  }
}

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return null
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('id, email, name, role')
      .eq('email', user.email)
      .single()

    if (profileError || !userProfile) {
      return null
    }

    return {
      id: user.id,
      email: user.email!,
      name: userProfile.name,
      role: userProfile.role as 'admin' | 'user'
    }
  } catch (error) {
    return null
  }
}

export const isAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return user !== null
}

export const isAdmin = async (): Promise<boolean> => {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}