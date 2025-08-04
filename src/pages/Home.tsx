import React, { useState, useEffect } from 'react'
import { Mountain, Search, Star, TrendingUp } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import DestinationCard from '../components/DestinationCard'
import { fetchDestinations, Destination } from '../lib/supabase'

const Home: React.FC = () => {
  const [featuredDestinations, setFeaturedDestinations] = useState<Destination[]>([])
  const [nepalDestinations, setNepalDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        // Fetch featured destinations (top rated)
        const featured = await fetchDestinations()
        setFeaturedDestinations(featured.slice(0, 6))

        // Fetch Nepal-specific destinations
        const nepal = await fetchDestinations({ country: 'Nepal' })
        setNepalDestinations(nepal.slice(0, 8))
      } catch (error) {
        console.error('Error loading destinations:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDestinations()
  }, [])

  const handleSearch = (query: string) => {
    if (query) {
      // Navigate to destinations page with search query
      window.location.href = `/destinations?search=${encodeURIComponent(query)}`
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Mountain className="h-16 w-16 text-orange-400 mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Discover
              <span className="text-orange-400 block">Nepal</span>
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Experience the majestic Himalayas, ancient temples, and vibrant culture of Nepal. 
            Your adventure of a lifetime awaits.
          </p>

          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search destinations in Nepal and worldwide..."
              className="w-full"
            />
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              <span className="text-gray-600 text-sm">Popular:</span>
              {['Everest Base Camp', 'Annapurna Circuit', 'Kathmandu', 'Pokhara'].map((term) => (
                <button
                  key={term}
                  onClick={() => handleSearch(term)}
                  className="text-sky-600 hover:text-sky-800 text-sm underline"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Nepal Destinations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <Mountain className="h-8 w-8 text-sky-600 mr-2" />
              <h2 className="text-4xl font-bold text-gray-900">Explore Nepal</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From the world's highest peaks to ancient cultural treasures, 
              discover the incredible diversity of Nepal
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {nepalDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onClick={() => window.open(`/destinations/${destination.id}`, '_blank')}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/destinations?country=Nepal"
              className="inline-flex items-center bg-sky-600 text-white px-8 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200 font-semibold"
            >
              <Mountain className="h-5 w-5 mr-2" />
              Explore All Nepal Destinations
            </a>
          </div>
        </div>
      </section>

      {/* Global Featured Destinations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="h-8 w-8 text-orange-500 mr-2" />
              <h2 className="text-4xl font-bold text-gray-900">Trending Worldwide</h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover popular destinations around the globe, handpicked for unforgettable experiences
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                  <div className="h-64 bg-gray-300"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mb-4"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onClick={() => window.open(`/destinations/${destination.id}`, '_blank')}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <a
              href="/destinations"
              className="inline-flex items-center bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-200 font-semibold"
            >
              <Search className="h-5 w-5 mr-2" />
              Browse All Destinations
            </a>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-sky-600 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-sky-200">Nepal Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">200+</div>
              <div className="text-sky-200">Global Destinations</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-sky-200">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.9</div>
              <div className="text-sky-200 flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                Average Rating
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home