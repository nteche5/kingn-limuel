import nodemailer from 'nodemailer'

const EMAIL_USER = process.env.EMAIL_USER || process.env.SMTP_USER || process.env.MAIL_USER
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || process.env.SMTP_PASSWORD || process.env.MAIL_PASSWORD

interface ContactFormData {
  name: string
  email: string
  phone?: string
  address?: string
  message: string
}

// Create transporter for sending emails
const createTransporter = () => {
  // You can use different email providers:
  // 1. Gmail (recommended for testing)
  // 2. Outlook/Hotmail
  // 3. Custom SMTP server
  // 4. Email services like SendGrid, Mailgun, etc.

  return nodemailer.createTransport({
    service: 'gmail', // Change this to your preferred service
    auth: {
      user: EMAIL_USER, // Your email address
      pass: EMAIL_PASSWORD, // Your email password or app password
    },
  })
}

export const sendContactFormEmail = async (formData: ContactFormData) => {
  try {
    const transporter = createTransporter()

    // Email content
    const mailOptions = {
      from: EMAIL_USER, // Sender email
      to: 'kinglemuelproperties@gmail.com', // King Lemuel Properties email
      subject: `New Contact Form Submission from ${formData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: #2C2C2C; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="margin: 5px 0 0 0; color: #ccc;">King Lemuel Properties Website</p>
          </div>
          
          <div style="background-color: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h2 style="color: #2C2C2C; margin-top: 0;">Contact Details</h2>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #2C2C2C;">Name:</strong>
              <p style="margin: 5px 0; color: #666;">${formData.name}</p>
            </div>
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #2C2C2C;">Email:</strong>
              <p style="margin: 5px 0; color: #666;">
                <a href="mailto:${formData.email}" style="color: #007bff; text-decoration: none;">${formData.email}</a>
              </p>
            </div>
            
            ${formData.phone ? `
            <div style="margin-bottom: 20px;">
              <strong style="color: #2C2C2C;">Phone:</strong>
              <p style="margin: 5px 0; color: #666;">
                <a href="tel:${formData.phone}" style="color: #007bff; text-decoration: none;">${formData.phone}</a>
              </p>
            </div>
            ` : ''}
            
            ${formData.address ? `
            <div style="margin-bottom: 20px;">
              <strong style="color: #2C2C2C;">Address:</strong>
              <p style="margin: 5px 0; color: #666;">${formData.address}</p>
            </div>
            ` : ''}
            
            <div style="margin-bottom: 20px;">
              <strong style="color: #2C2C2C;">Message:</strong>
              <div style="margin: 10px 0; padding: 15px; background-color: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
                <p style="margin: 0; color: #333; line-height: 1.6;">${formData.message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                <strong>Submitted:</strong> ${new Date().toLocaleString('en-US', {
                  timeZone: 'Africa/Accra',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })} (Ghana Time)
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>This email was sent from the King Lemuel Properties contact form.</p>
            <p>Reply directly to this email to respond to the customer.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission - King Lemuel Properties

Name: ${formData.name}
Email: ${formData.email}
${formData.phone ? `Phone: ${formData.phone}` : ''}
${formData.address ? `Address: ${formData.address}` : ''}

Message:
${formData.message}

Submitted: ${new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Accra',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })} (Ghana Time)

---
This email was sent from the King Lemuel Properties contact form.
Reply directly to this email to respond to the customer.
      `,
    }

    // Send email
    const result = await transporter.sendMail(mailOptions)
    console.log('Email sent successfully:', result.messageId)
    
    return {
      success: true,
      messageId: result.messageId
    }

  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email notification')
  }
}

// Alternative: SendGrid integration (if you prefer)
export const sendContactFormEmailWithSendGrid = async (formData: ContactFormData) => {
  // This is an alternative implementation using SendGrid
  // You would need to install @sendgrid/mail and set SENDGRID_API_KEY
  // Uncomment and modify this if you prefer SendGrid over Nodemailer
  
  /*
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  const msg = {
    to: 'kinglemuelproperties@gmail.com',
    from: EMAIL_USER,
    subject: `New Contact Form Submission from ${formData.name}`,
    html: `...`, // Same HTML content as above
    text: `...`, // Same text content as above
  }

  try {
    await sgMail.send(msg)
    return { success: true }
  } catch (error) {
    console.error('SendGrid error:', error)
    throw new Error('Failed to send email notification')
  }
  */
}
