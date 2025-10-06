# King Limuel Properties - Backend Setup Guide

## Overview

The backend for King Limuel Properties has been successfully developed with the following components:

### ✅ Completed Backend Components

1. **Database Schema** - Complete PostgreSQL database with tables for:
   - Properties with ownership documents
   - Users with role-based access
   - Property inquiries and analytics
   - Row Level Security (RLS) policies

2. **API Routes** - RESTful API endpoints for:
   - `/api/properties` - CRUD operations for properties
   - `/api/properties/[id]` - Individual property management
   - `/api/properties/search` - Advanced property search
   - `/api/inquiries` - Property inquiry management
   - `/api/auth/login` - Admin authentication
   - `/api/upload` - File upload to Supabase Storage
   - `/api/analytics` - Analytics and reporting

3. **Authentication System** - Supabase Auth integration with:
   - Admin login/logout
   - Role-based access control
   - Session management

4. **File Upload System** - Supabase Storage integration for:
   - Property images (JPEG, PNG, WebP)
   - Documents (PDF)
   - Videos (MP4, WebM)
   - Organized folder structure

5. **Service Layer** - Comprehensive service functions:
   - `propertyService.ts` - Property management
   - `inquiryService.ts` - Inquiry handling
   - `analyticsService.ts` - Analytics and reporting
   - `uploadService.ts` - File management
   - `adminService.ts` - Admin-specific functions

## Database Tables Created

### Properties
- `id` (UUID, Primary Key)
- `title` (Text)
- `location` (Text)
- `price` (Decimal)
- `property_type` (Enum: 'land', 'house')
- `purpose` (Enum: 'buy', 'rent')
- `description` (Text)
- `images` (Text Array)
- `video` (Text)
- `proof_document` (Text)
- `coordinates` (JSONB)
- `contact` (JSONB)
- `uploaded_by` (Enum: 'admin', 'user')
- `featured` (Boolean)
- `is_active` (Boolean)
- `created_at`, `updated_at` (Timestamps)

### Ownership Documents
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key)
- `name` (Text)
- `type` (Text)
- `url` (Text)
- `description` (Text)

### Users
- `id` (UUID, Primary Key)
- `email` (Text, Unique)
- `name` (Text)
- `phone` (Text)
- `role` (Enum: 'admin', 'user')
- `is_active` (Boolean)

### Property Views (Analytics)
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key)
- `user_id` (UUID, Foreign Key, Nullable)
- `ip_address` (INET)
- `user_agent` (Text)
- `viewed_at` (Timestamp)

### Property Inquiries
- `id` (UUID, Primary Key)
- `property_id` (UUID, Foreign Key)
- `name` (Text)
- `email` (Text)
- `phone` (Text)
- `message` (Text)
- `status` (Enum: 'pending', 'contacted', 'closed')
- `created_at`, `updated_at` (Timestamps)

## API Endpoints

### Properties
- `GET /api/properties` - Get all active properties with filtering
- `POST /api/properties` - Create new property (admin only)
- `GET /api/properties/[id]` - Get specific property
- `PUT /api/properties/[id]` - Update property (admin only)
- `DELETE /api/properties/[id]` - Delete property (admin only)
- `GET /api/properties/search` - Advanced search with pagination

### Inquiries
- `GET /api/inquiries` - Get all inquiries (admin only)
- `POST /api/inquiries` - Create new inquiry
- `GET /api/inquiries/[id]` - Get specific inquiry (admin only)
- `PUT /api/inquiries/[id]` - Update inquiry status (admin only)
- `DELETE /api/inquiries/[id]` - Delete inquiry (admin only)

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Admin logout
- `GET /api/auth/me` - Get current user info

### File Upload
- `POST /api/upload` - Upload files to Supabase Storage
- `DELETE /api/upload` - Delete files from storage

### Analytics
- `GET /api/analytics` - Get analytics data (admin only)

## Security Features

1. **Row Level Security (RLS)** - Enabled on all tables
2. **Role-based Access Control** - Admin vs User permissions
3. **Input Validation** - Server-side validation for all endpoints
4. **File Type Restrictions** - Only allowed file types can be uploaded
5. **File Size Limits** - Maximum 10MB per file
6. **SQL Injection Protection** - Using Supabase's built-in protection

## Sample Data

The database has been populated with sample properties including:
- 2-acre land on Kumasi-Tamale Road
- 4-bedroom house at Zuo
- 1-acre land on Airport-Bolga Road
- Land in Adubiyili
- 3-bedroom house for rent in Kpalsi
- 1-bedroom apartment for rent in Gumani

## Next Steps

1. **Environment Setup**:
   - Copy `.env.local.example` to `.env.local`
   - Add your Supabase project URL and anon key
   - Add your Google Maps API key

2. **Admin Account Setup**:
   - Create an admin user in Supabase Auth
   - Update the users table with admin role

3. **Storage Configuration**:
   - The `property-files` bucket has been created
   - Storage policies are configured for admin-only uploads

4. **Frontend Integration**:
   - Update frontend components to use the new API endpoints
   - Replace localStorage-based property management with API calls
   - Implement proper error handling

## File Structure

```
src/
├── app/
│   └── api/
│       ├── properties/
│       ├── inquiries/
│       ├── auth/
│       ├── upload/
│       └── analytics/
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   ├── propertyService.ts
│   ├── inquiryService.ts
│   ├── analyticsService.ts
│   ├── uploadService.ts
│   └── adminService.ts
└── types/
    └── index.ts
```

## Testing the Backend

You can test the API endpoints using:
- Postman
- curl commands
- Frontend integration
- Supabase Dashboard

The backend is now fully functional and ready for frontend integration!
