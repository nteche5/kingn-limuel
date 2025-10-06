# Google Maps API Setup Guide

## Step 1: Get Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account

2. **Create or Select Project**
   - Click "Select a project" → "New Project"
   - Name: "King Lemuel Properties" (or any name)
   - Click "Create"

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search and enable these APIs:
     - **Maps JavaScript API**
     - **Places API**
     - **Geocoding API**

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

5. **Restrict API Key (Recommended)**
   - Click on your API key to edit
   - Under "Application restrictions":
     - Select "HTTP referrers"
     - Add: `localhost:3000/*`
     - Add: `your-domain.com/*` (when deploying)
   - Under "API restrictions":
     - Select "Restrict key"
     - Choose: Maps JavaScript API, Places API, Geocoding API
   - Click "Save"

## Step 2: Configure Environment

1. **Edit .env.local file**
   ```bash
   nano .env.local
   ```

2. **Replace the placeholder with your API key**
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. **Save and restart the development server**
   ```bash
   npm run dev
   ```

## Step 3: Test the Integration

1. Go to: http://localhost:3000/upload
2. Scroll to "Property Location" section
3. You should see an interactive map with:
   - Search box for location
   - Clickable map
   - Draggable marker

## Troubleshooting

### Common Issues:

1. **"API key not found"**
   - Check .env.local file exists
   - Verify API key is correct
   - Restart development server

2. **"This page can't load Google Maps correctly"**
   - Check API restrictions
   - Ensure localhost:3000 is allowed
   - Verify APIs are enabled

3. **"Quota exceeded"**
   - Check billing is enabled
   - Monitor usage in Google Cloud Console
   - Set up billing alerts

### Free Tier Limits:
- Maps JavaScript API: 28,000 loads/month
- Places API: 1,000 requests/month
- Geocoding API: 40,000 requests/month

## Cost Management

1. **Set up billing alerts**
   - Go to "Billing" → "Budgets & Alerts"
   - Create budget alerts

2. **Monitor usage**
   - Check "APIs & Services" → "Dashboard"
   - Track API usage

3. **Optimize usage**
   - Use map caching
   - Implement request throttling
   - Consider alternative solutions for high traffic

## Security Best Practices

1. **Restrict API key**
   - Use HTTP referrers restriction
   - Limit to specific APIs
   - Don't expose in client-side code

2. **Environment variables**
   - Never commit .env.local to git
   - Use different keys for dev/prod
   - Rotate keys periodically

## Alternative Solutions

If you prefer not to use Google Maps:

1. **OpenStreetMap with Leaflet**
   - Free and open source
   - No API key required
   - Good for basic mapping needs

2. **Mapbox**
   - Alternative mapping service
   - Free tier available
   - Good customization options

## Support

If you need help:
1. Check Google Maps documentation
2. Review error messages in browser console
3. Test with a simple HTML page first
4. Contact Google Cloud Support if needed
