export interface OwnershipDocument {
  name: string;
  type: string;
  url: string;
  description: string;
}

export interface AdditionalDocument {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  propertyType: 'land' | 'house';
  purpose: 'buy' | 'rent';
  description: string;
  images: string[];
  video?: string;
  proofDocument?: string; // Legacy field for backward compatibility
  landTitleCertification?: string;
  additionalDocuments?: AdditionalDocument[];
  ownershipDocuments?: OwnershipDocument[];
  coordinates: {
    lat: number;
    lng: number;
  };
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  uploadedBy: 'admin' | 'user';
  createdAt: Date;
  featured?: boolean;
}

export interface SearchFilters {
  location?: string;
  propertyType?: 'land' | 'house';
  purpose?: 'buy' | 'rent';
  minPrice?: number;
  maxPrice?: number;
}

export interface UploadedFile {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'document';
}

export interface LocationOption {
  value: string;
  label: string;
}

export const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'tamale-central', label: 'Tamale Central' },
  { value: 'sagnarigu', label: 'Sagnarigu' },
  { value: 'nyohini', label: 'Nyohini' },
  { value: 'vittin', label: 'Vittin (Viting)' },
  { value: 'aboabo', label: 'Aboabo' },
  { value: 'kalpohin-estate', label: 'Kalpohin (Estate)' },
  { value: 'kalpohin-low-cost', label: 'Kalpohin (Low-Cost)' },
  { value: 'kobilmahagu', label: 'Kobilmahagu' },
  { value: 'gumani', label: 'Gumani' },
  { value: 'zagyuri', label: 'Zagyuri' },
  { value: 'kakpagyili', label: 'Kakpagyili' },
  { value: 'sakasaka', label: 'Sakasaka' },
];


