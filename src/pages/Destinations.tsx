import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, SlidersHorizontal, X, MapPin } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import DestinationCard from '../components/DestinationCard'
import GoogleMap from '../components/GoogleMap'
import { fetchDestinations, searchDestinations, Destination, DestinationFilters } from '../lib/supabase'

const Destinations: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [filters, setFilters] = useState<DestinationFilters>({
    country: searchParams.get('country') || '',
    region: '',
    minPrice: undefined,
    maxPrice: undefined,
    difficulty: '',
    season: ''
  })

  const countries = ['Nepal', 'India', 'Bhutan', 'Tibet', 'Thailand', 'Japan', 'Indonesia']
  const difficulties = ['Easy', 'Moderate', 'Challenging']
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter']

  useEffect(() => {
    loadDestinations()
  }, [filters, searchParams])

  const loadDestinations = async () => {
    setLoading(true)
    try {
      const searchQuery = searchParams.get('search')
      let results: Destination[] = []

      if (searchQuery) {
        results = await searchDestinations(searchQuery)
      } else {
        const activeFilters = Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== '' && value !== undefined)
        )
        results = await fetchDestinations(activeFilters)
      }

      setDestinations(results)
    } catch (error) {
      console.error('Error loading destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    if (query) {
      setSearchParams({ search: query })
    } else {
      setSearchParams({})
    }
  }

  const handleFilterChange = (key: keyof DestinationFilters, value: string | number | undefined) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
    // Clear search when applying filters
    setSearchParams({})
  }

  const clearFilters = () => {
    setFilters({
      country: '',
      region: '',
      minPrice: undefined,
      maxPrice: undefined,
      difficulty: '',
      season: ''
    })
    setSearchParams({})
  }

  const hasActiveFilters = Object.values(filters).some(value => value !== '' && value !== undefined) || searchParams.get('search')

  const destinationsWithCoords = destinations.filter(d => d.latitude && d.longitude)
  const mapCenter = destinationsWithCoords.length > 0 
    ? { 
        lat: destinationsWithCoords.reduce((sum, d) => sum + (d.latitude || 0), 0) / destinationsWithCoords.length,
        lng: destinationsWithCoords.reduce((sum, d) => sum + (d.longitude || 0), 0) / destinationsWithCoords.length
      }
    : { lat: 28.3949, lng: 84.1240 } // Nepal center

  const mapMarkers = destinationsWithCoords.map(destination => ({
    position: { lat: destination.latitude!, lng: destination.longitude! },
    title: destination.name,
    info: `${destination.description.substring(0, 100)}... - $${destination.price}`
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Explore Destinations</h1>
          <p className="text-xl text-gray-600 mb-6">
            Discover amazing places around the world, with a special focus on Nepal's incredible destinations
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl">
            <SearchBar 
              onSearch={handleSearch}
              placeholder="Search destinations worldwide..."
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
              >
                <SlidersHorizontal className="h-5 w-5" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="bg-sky-500 text-white text-xs rounded-full px-2 py-1">
                    Active
                  </span>
                )}
              </button>

              <button
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center space-x-2 border rounded-lg px-4 py-2 transition-colors duration-200 ${
                  showMap 
                    ? 'bg-sky-500 text-white border-sky-500' 
                    : 'bg-white border-gray-300 hover:bg-gray-50'
                }`}
              >
                <MapPin className="h-5 w-5" />
                <span>Map View</span>
              </button>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
              >
                <X className="h-4 w-4" />
                <span>Clear all</span>
              </button>
            )}
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                {/* Country Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <select
                    value={filters.country}
                    onChange={(e) => handleFilterChange('country', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
                  <select
                    value={filters.difficulty}
                    onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    {difficulties.map(difficulty => (
                      <option key={difficulty} value={difficulty}>{difficulty}</option>
                    ))}
                  </select>
                </div>

                {/* Season Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Best Season</label>
                  <select
                    value={filters.season}
                    onChange={(e) => handleFilterChange('season', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  >
                    <option value="">All Seasons</option>
                    {seasons.map(season => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Min Price ($)</label>
                  <input
                    type="number"
                    value={filters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                {/* Max Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
                  <input
                    type="number"
                    value={filters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="10000"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>

                {/* Region Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                  <input
                    type="text"
                    value={filters.region}
                    onChange={(e) => handleFilterChange('region', e.target.value)}
                    placeholder="e.g., Himalayas"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-gray-900">
              {searchParams.get('search') ? `Search results for "${searchParams.get('search')}"` : 'All Destinations'}
            </h2>
            <span className="text-gray-600">
              {loading ? 'Loading...' : `${destinations.length} destinations found`}
            </span>
          </div>
        </div>

        {/* Destinations Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(12)].map((_, index) => (
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
        ) : destinations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onClick={() => window.open(`/destinations/${destination.id}`, '_blank')}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find more destinations.
            </p>
            <button
              onClick={clearFilters}
              className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
        {/* Map View */}
        {showMap && (
          <div className="mb-8 bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="h-96">
              <GoogleMap
                center={mapCenter}
                zoom={6}
                markers={mapMarkers}
              />
            </div>
          </div>
        )}

    </div>
  )
}

export default Destinations