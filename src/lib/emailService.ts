const FROM_EMAIL = process.env.EMAIL_USER || process.env.MAIL_FROM || 'no-reply@your-domain.com'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  address?: string
  message: string
}

export const sendContactFormEmail = async (formData: ContactFormData) => {
  try {
    const subject = `New Contact Form Submission from ${formData.name}`
    const htmlContent = `
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
      `
    const textContent = `
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
      `

    // Prefer SendGrid via API if configured
    if (process.env.SENDGRID_API_KEY) {
      const payload = {
        personalizations: [
          {
            to: [{ email: 'kinglemuelproperties57@gmail.com', name: 'King Lemuel Properties' }],
            subject,
          },
        ],
        from: { email: FROM_EMAIL, name: 'King Lemuel Properties' },
        reply_to: { email: formData.email },
        content: [
          { type: 'text/plain', value: textContent },
          { type: 'text/html', value: htmlContent },
        ],
      }

      const resp = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify(payload),
      })

      if (!resp.ok) {
        const errText = await resp.text()
        console.error('SendGrid error:', resp.status, errText)
        throw new Error('Failed to send email notification')
      }

      const messageId = resp.headers.get('x-message-id') || `${Date.now()}`
      return { success: true, messageId }
    }

    // Fallback to SMTP using Nodemailer (requires Node runtime)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const nodemailer = await import('nodemailer')

      const isGmail = /gmail\.com$/i.test(process.env.EMAIL_USER)
      let transporter
      if (isGmail) {
        // Use Gmail service preset for best compatibility with App Passwords
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASSWORD as string,
          },
        })
      } else {
        const smtpHost = process.env.EMAIL_HOST || 'smtp.yourdomain.com'
        const smtpPort = process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587
        const smtpSecure = process.env.EMAIL_SECURE ? process.env.EMAIL_SECURE === 'true' : false
        transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpSecure,
          auth: {
            user: process.env.EMAIL_USER as string,
            pass: process.env.EMAIL_PASSWORD as string,
          },
        })
      }

      // Skip SMTP verify to allow direct send; Gmail can reject verify in some environments

      const info = await transporter.sendMail({
        to: 'kinglemuelproperties57@gmail.com',
        from: {
          name: 'King Lemuel Properties',
          address: FROM_EMAIL,
        },
        replyTo: formData.email,
        subject,
        text: textContent,
        html: htmlContent,
      })

      const messageId = (info && (info.messageId as string)) || `${Date.now()}`
      return { success: true, messageId }
    }

    throw new Error('Email service is not configured. Set SENDGRID_API_KEY or SMTP env vars.')

  } catch (error) {
    console.error('Error sending email:', error)
    const message = error instanceof Error ? error.message : 'Unknown email error'
    throw new Error(message)
  }
}

// removed unused alternative stub
