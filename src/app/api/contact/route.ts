import { NextRequest, NextResponse } from 'next/server'
import { sendContactFormEmail } from '@/lib/emailService'

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Prepare form data for email service
    const formData = {
      name: body.name.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || '',
      address: body.address?.trim() || '',
      message: body.message.trim()
    }

    // Send email
    const emailResult = await sendContactFormEmail(formData)
    
    if (!emailResult.success) {
      throw new Error('Failed to send email')
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Contact form submitted successfully',
      data: {
        id: Date.now().toString(),
        ...formData,
        status: 'sent',
        created_at: new Date().toISOString(),
        email_message_id: emailResult.messageId
      }
    })

  } catch (error) {
    console.error('Contact form API error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to process contact form submission',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}
