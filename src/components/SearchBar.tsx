import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { DestinationFilters } from '../lib/supabase'

interface SearchBarProps {
  onSearch: (query: string) => void
  onFilter: (filters: DestinationFilters) => void
  filters: DestinationFilters
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onFilter, filters }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<DestinationFilters>(filters)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  const handleFilterChange = (key: keyof DestinationFilters, value: string | number | undefined) => {
    const newFilters = { ...localFilters, [key]: value || undefined }
    setLocalFilters(newFilters)
    onFilter(newFilters)
  }

  const clearFilters = () => {
    const emptyFilters: DestinationFilters = {}
    setLocalFilters(emptyFilters)
    onFilter(emptyFilters)
  }

  const hasActiveFilters = Object.values(localFilters).some(value => value !== undefined && value !== '')

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center space-x-2 px-4 py-3 rounded-lg border transition-colors ${
            showFilters || hasActiveFilters
              ? 'bg-blue-50 border-blue-300 text-blue-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          <Filter className="h-5 w-5" />
          <span>Filters</span>
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
              {Object.values(localFilters).filter(v => v !== undefined && v !== '').length}
            </span>
          )}
        </button>
      </form>

      {/* Filters */}
      {showFilters && (
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4" />
                <span>Clear All</span>
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Country Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <select
                value={localFilters.country || ''}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Countries</option>
                <option value="Nepal">Nepal</option>
                <option value="Japan">Japan</option>
                <option value="Indonesia">Indonesia</option>
              </select>
            </div>

            {/* Region Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <select
                value={localFilters.region || ''}
                onChange={(e) => handleFilterChange('region', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Regions</option>
                <option value="Khumbu">Khumbu</option>
                <option value="Annapurna">Annapurna</option>
                <option value="Central">Central</option>
                <option value="Western">Western</option>
                <option value="Eastern">Eastern</option>
              </select>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={localFilters.difficulty || ''}
                onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Season Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Best Season</label>
              <select
                value={localFilters.season || ''}
                onChange={(e) => handleFilterChange('season', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Seasons</option>
                <option value="Spring">Spring</option>
                <option value="Summer">Summer</option>
                <option value="Autumn">Autumn</option>
                <option value="Winter">Winter</option>
                <option value="All seasons">All Seasons</option>
              </select>
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="number"
                  placeholder="Min Price"
                  value={localFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <input
                  type="number"
                  placeholder="Max Price"
                  value={localFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchBar