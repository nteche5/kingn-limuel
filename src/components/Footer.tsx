import Link from 'next/link'
import { Building2, Phone, Mail, MapPin, Facebook, Twitter, Instagram, MessageCircle } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Building2 className="h-8 w-8 text-primary-400" />
              <div>
                <h3 className="text-xl font-bold">King Lemuel Properties</h3>
                <p className="text-sm text-gray-400">Building Trust, One Property at a Time</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your trusted partner in finding the perfect property in Ghana. We specialize in 
              residential and commercial properties across Tamale and surrounding areas.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=100071941852508" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://wa.me/233244996878" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-400 transition-colors">
                <MessageCircle className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties?type=land&purpose=buy" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Buy Land
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house&purpose=rent" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Houses for Rent
                </Link>
              </li>
              <li>
                <Link href="/properties?type=house&purpose=buy" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Houses for Sale
                </Link>
              </li>
              <li>
                <Link href="/upload" className="text-gray-300 hover:text-primary-400 transition-colors">
                  Upload Property
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">Tamale, Ghana</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">+233 244 996 878</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-primary-400" />
                <span className="text-gray-300">services@kinglemuelrealestategh.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} King Lemuel Properties. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer


