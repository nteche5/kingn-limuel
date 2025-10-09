# King Lemuel Properties

A modern real estate website for King Lemuel Properties, built with Next.js, React, and TailwindCSS.

## 🌐 Live Demo

**View the live website:** [https://yourusername.github.io/king-limuel-properties2/](https://yourusername.github.io/king-limuel-properties2/)

> **Note:** Replace `yourusername` with your actual GitHub username after deployment.

## Features

- 🏠 **Property Listings**: Browse properties with advanced filtering
- 🔍 **Search Functionality**: Search by location, type, and purpose
- 📱 **Responsive Design**: Works perfectly on all devices
- 📍 **Location System**: Manual coordinate input for property locations
- 📸 **Image Galleries**: Beautiful property image galleries
- 🎥 **Video Support**: Property video uploads and playback
- 📄 **Document Upload**: Proof of ownership document support
- 👤 **Admin Dashboard**: Property management interface
- 📞 **Contact System**: Built-in contact forms and information

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Custom components with shadcn/ui patterns
- **Icons**: Lucide React
- **Maps**: Google Maps JavaScript API
- **State Management**: React hooks and context
- **File Handling**: Local file upload with preview

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd king-limuel-properties2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env.local
```

4. Add your Google Maps API key to `.env.local`:
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building for Production

```bash
npm run build
npm start
```

## 🚀 Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages.

### Automatic Deployment

1. **Push to main branch**: The site automatically deploys when you push to the `main` branch
2. **GitHub Actions**: The deployment is handled by GitHub Actions workflow
3. **Live URL**: Your site will be available at `https://yourusername.github.io/king-limuel-properties2/`

### Manual Deployment

If you need to deploy manually:

```bash
# Build the project
npm run build

# The static files will be in the 'out' directory
# You can then upload these files to any static hosting service
```

### Setting up GitHub Pages

1. **Enable GitHub Pages**:
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "GitHub Actions" as the source

2. **Update the base path** (if needed):
   - If your repository name is different, update the `basePath` in `next.config.js`
   - Update the live demo URL in this README

3. **First deployment**:
   - Push your code to the `main` branch
   - GitHub Actions will automatically build and deploy
   - Check the "Actions" tab for deployment status

## 📖 Quick Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

**TL;DR:**
1. Create a public GitHub repository
2. Upload your code
3. Enable GitHub Pages with "GitHub Actions" source
4. Your site will be live at `https://yourusername.github.io/king-limuel-properties2/`

## 🚀 Deployment to Netlify (with Supabase)

If you deploy to Netlify and use Supabase-backed API routes:

1. Configure required environment variables in Netlify (Production): see `NETLIFY_SETUP.md`.
2. Ensure `@netlify/plugin-nextjs` is enabled (already configured in `netlify.toml`).
3. Trigger a deploy with cache clear in Netlify after adding environment variables.

For full instructions, read `NETLIFY_SETUP.md`.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── contact/           # Contact page
│   ├── properties/        # Property listing and details
│   ├── upload/            # Property upload form
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── FileUploader.tsx  # File upload component
│   ├── Footer.tsx        # Site footer
│   ├── ImageGallery.tsx  # Image gallery component
│   ├── MapComponent.tsx  # Map component
│   ├── Navbar.tsx        # Navigation bar
│   ├── PropertyCard.tsx  # Property card component
│   ├── SearchBar.tsx     # Search functionality
│   └── VideoPlayer.tsx   # Video player component
├── data/                 # Mock data
│   └── properties.json   # Sample property data
├── lib/                  # Utility functions
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
    └── index.ts          # Type definitions
```

## Features Overview

### Homepage
- Hero section with search functionality
- Featured properties showcase
- Property categories (Lands, Houses for Rent/Sale)
- Call-to-action sections

### Property Listings
- Advanced filtering by location, type, purpose, and price
- Grid and list view options
- Responsive property cards
- Search functionality

### Property Details
- Image gallery with modal view
- Video player for property videos
- Interactive map with property location
- Contact information and forms
- Proof document download

### Upload Property
- Comprehensive property upload form
- Image, video, and document upload
- Location selection with map
- Contact information collection

### Admin Dashboard
- Property statistics and overview
- Property management interface
- Video upload functionality
- Quick actions and settings

### Contact Page
- Contact form with validation
- Office information display
- Quick contact options
- Location map

## Google Maps Integration

The application includes Google Maps integration for:
- Property location display
- Interactive maps on property details
- Location search and autocomplete
- Draggable markers for property uploads

To enable Google Maps:
1. Get a Google Maps API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Add the key to your `.env.local` file
3. Enable the following APIs:
   - Maps JavaScript API
   - Places API
   - Geocoding API

## Future Enhancements

### Supabase Integration
The application is structured to easily integrate with Supabase for:
- Property data storage
- User authentication
- File uploads and storage
- Real-time updates

### Additional Features
- User authentication and profiles
- Property favorites and saved searches
- Email notifications
- Advanced search filters
- Property comparison
- Virtual tours
- Mortgage calculator
- Property valuation tools

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, contact:
- Email: kinglemuelproperties@gmail.com
- Phone: +233 XX XXX XXXX

## Acknowledgments

- Design inspired by Global Properties Ghana
- Built with modern web technologies
- Responsive design principles
- Accessibility best practices


# GitHub Pages Deployment Ready
