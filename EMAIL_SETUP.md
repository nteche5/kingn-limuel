# Email Setup Guide for Contact Form

This guide will help you set up email notifications so that contact form submissions are sent directly to King Lemuel Properties' email address.

## 📧 Email Configuration Options

### Option 1: Gmail (Recommended for Testing)

1. **Create a Gmail Account** (if you don't have one)
   - Use a dedicated email for your business
   - Example: `kinglemuelproperties@gmail.com`

2. **Enable 2-Factor Authentication**
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Enable 2-Step Verification

3. **Create an App Password**
   - Go to [App Passwords](https://myaccount.google.com/apppasswords)
   - Select "Mail" and "Other (Custom name)"
   - Enter "King Lemuel Properties Website"
   - Copy the generated 16-character password

4. **Update Environment Variables**
   ```bash
   # In your .env.local file
   EMAIL_USER=kinglemuelproperties@gmail.com
   EMAIL_PASSWORD=your_16_character_app_password
   ```

### Option 2: SendGrid (Recommended for Production)

1. **Sign up for SendGrid**
   - Go to [SendGrid](https://sendgrid.com/)
   - Create a free account (100 emails/day)

2. **Create an API Key**
   - Go to Settings > API Keys
   - Create a new API key with "Full Access"
   - Copy the API key

3. **Update Environment Variables**
   ```bash
   # In your .env.local file
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   EMAIL_USER=your_verified_sender_email@domain.com
   ```

### Option 3: Custom SMTP Server

If you have your own email server or hosting provider:

```bash
# In your .env.local file
EMAIL_HOST=smtp.yourdomain.com
EMAIL_PORT=587
EMAIL_USER=your_email@yourdomain.com
EMAIL_PASSWORD=your_email_password
EMAIL_SECURE=false
```

## 🚀 Setup Steps

1. **Copy Environment File**
   ```bash
   cp env.example .env.local
   ```

2. **Add Your Email Credentials**
   Edit `.env.local` and add your email configuration:
   ```bash
   EMAIL_USER=services@kinglemuelrealestategh.com
   EMAIL_PASSWORD=your_app_password_or_api_key
   ```

3. **Restart Development Server**
   ```bash
   npm run dev
   ```

4. **Test the Contact Form**
   - Go to `/contact` page
   - Fill out and submit the form
   - Check your email inbox

## 📧 Email Template Features

The email notification includes:
- **Professional HTML Design** with King Lemuel Properties branding
- **Complete Contact Information** (name, email, phone, address)
- **Formatted Message** with proper line breaks
- **Timestamp** in Ghana timezone
- **Reply Functionality** - you can reply directly to respond to customers

## 🔧 Troubleshooting

### Common Issues:

1. **"Invalid login" Error**
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Factor Authentication is enabled

2. **"Connection timeout" Error**
   - Check your internet connection
   - Verify SMTP settings for your email provider

3. **"Authentication failed" Error**
   - Double-check your email credentials
   - Make sure the email account exists and is active

4. **Emails not received**
   - Check spam/junk folder
   - Verify the recipient email address is correct
   - Check server logs for error messages

### Testing Email Configuration:

You can test your email setup by:
1. Submitting the contact form
2. Checking the browser console for success/error messages
3. Checking your email inbox
4. Looking at server logs in the terminal

## 📱 Alternative: WhatsApp Integration

For immediate notifications, you can also set up WhatsApp Business API to receive instant messages when someone submits the contact form.

## 🎯 Production Recommendations

For production deployment:
1. Use a professional email service (SendGrid, Mailgun, AWS SES)
2. Set up email templates with your branding
3. Add email analytics and tracking
4. Consider SMS notifications for urgent inquiries
5. Set up email forwarding rules for different types of inquiries

## 📞 Support

If you need help setting up email notifications:
- Check the server logs for error messages
- Verify your environment variables are correct
- Test with a simple email first
- Consider using a different email provider if issues persist
