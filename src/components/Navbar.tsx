import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Mountain, User, Settings } from 'lucide-react'

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Destinations', path: '/destinations' },
    { name: 'About Nepal', path: '/about-nepal' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin' },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Mountain className="h-8 w-8 text-sky-600" />
            <span className="text-2xl font-bold text-gray-900">Nepal Explorer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center gap-2 ${
                    ? 'text-sky-600 bg-sky-50'
                    : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                }`}
              >
                {item.name === 'Admin' && <Settings className="h-4 w-4" />}
                {item.name === 'Admin' && <Settings className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
            
            <Link
              to="/login"
              className="flex items-center space-x-1 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              <User className="h-4 w-4" />
              <span>Login</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-sky-600 focus:outline-none focus:text-sky-600"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'text-sky-600 bg-sky-50'
                      : 'text-gray-700 hover:text-sky-600 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center space-x-1 bg-sky-600 text-white px-3 py-2 rounded-lg hover:bg-sky-700 transition-colors duration-200 w-fit"
              >
                <User className="h-4 w-4" />
                <span>Login</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar