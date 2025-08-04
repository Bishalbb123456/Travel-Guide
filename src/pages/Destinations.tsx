import React, { useState, useEffect } from 'react'
import { fetchDestinations, searchDestinations, Destination, DestinationFilters } from '../lib/supabase'
import DestinationCard from '../components/DestinationCard'
import DestinationDetail from '../components/DestinationDetail'
import SearchBar from '../components/SearchBar'
import { Loader2 } from 'lucide-react'

const Destinations = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null)
  const [filters, setFilters] = useState<DestinationFilters>({})
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadDestinations()
  }, [filters])

  const loadDestinations = async () => {
    setLoading(true)
    try {
      const data = await fetchDestinations(filters)
      setDestinations(data)
    } catch (error) {
      console.error('Error loading destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (query: string) => {
    setSearchQuery(query)
    if (query.trim()) {
      setLoading(true)
      try {
        const data = await searchDestinations(query)
        setDestinations(data)
      } catch (error) {
        console.error('Error searching destinations:', error)
      } finally {
        setLoading(false)
      }
    } else {
      loadDestinations()
    }
  }

  const handleFilter = (newFilters: DestinationFilters) => {
    setFilters(newFilters)
    setSearchQuery('')
  }

  const handleDestinationClick = (destination: Destination) => {
    setSelectedDestination(destination)
  }

  const handleCloseDetail = () => {
    setSelectedDestination(null)
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing Destinations
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            From the majestic peaks of Nepal to exotic destinations worldwide, find your perfect adventure
          </p>
        </div>

        {/* Search and Filters */}
        <SearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          filters={filters}
        />

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${destinations.length} destination${destinations.length !== 1 ? 's' : ''} found`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        {/* Destinations Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                onClick={handleDestinationClick}
              />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && destinations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your search or filters to find more destinations.</p>
          </div>
        )}

        {/* Destination Detail Modal */}
        {selectedDestination && (
          <DestinationDetail
            destination={selectedDestination}
            onClose={handleCloseDetail}
          />
        )}
      </div>
    </div>
  )
}

export default Destinations