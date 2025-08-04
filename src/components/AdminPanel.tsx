import React, { useState, useEffect } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye } from 'lucide-react'
import { fetchDestinations, deleteDestination, Destination } from '../lib/supabase'
import DestinationForm from './DestinationForm'
import DestinationCard from './DestinationCard'

const AdminPanel: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDestination, setSelectedDestination] = useState<Destination | undefined>()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    loadDestinations()
  }, [])

  const loadDestinations = async () => {
    setLoading(true)
    try {
      const data = await fetchDestinations()
      setDestinations(data)
    } catch (error) {
      console.error('Error loading destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNew = () => {
    setSelectedDestination(undefined)
    setIsFormOpen(true)
  }

  const handleEdit = (destination: Destination) => {
    setSelectedDestination(destination)
    setIsFormOpen(true)
  }

  const handleDelete = async (destination: Destination) => {
    if (window.confirm(`Are you sure you want to delete "${destination.name}"?`)) {
      try {
        await deleteDestination(destination.id)
        setDestinations(prev => prev.filter(d => d.id !== destination.id))
      } catch (error) {
        console.error('Error deleting destination:', error)
        alert('Error deleting destination. Please try again.')
      }
    }
  }

  const handleSave = (savedDestination: Destination) => {
    if (selectedDestination) {
      // Update existing
      setDestinations(prev => 
        prev.map(d => d.id === savedDestination.id ? savedDestination : d)
      )
    } else {
      // Add new
      setDestinations(prev => [savedDestination, ...prev])
    }
  }

  const filteredDestinations = destinations.filter(destination =>
    destination.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    destination.region?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Panel</h1>
          <p className="text-xl text-gray-600">Manage travel destinations</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white text-sky-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-white text-sky-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  List
                </button>
              </div>

              <button
                onClick={handleAddNew}
                className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200 flex items-center gap-2 font-semibold"
              >
                <Plus className="h-5 w-5" />
                Add Destination
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              {loading ? 'Loading...' : `${filteredDestinations.length} destinations found`}
            </span>
            <span>
              Total: {destinations.length} destinations
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
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
        ) : filteredDestinations.length > 0 ? (
          viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredDestinations.map((destination) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  onClick={() => window.open(`/destinations/${destination.id}`, '_blank')}
                  onEdit={() => handleEdit(destination)}
                  onDelete={() => handleDelete(destination)}
                  showActions={true}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Destination</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Location</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Price</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Rating</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Duration</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredDestinations.map((destination) => (
                      <tr key={destination.id} className="hover:bg-gray-50">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <img
                              src={destination.image_url}
                              alt={destination.name}
                              className="w-16 h-16 object-cover rounded-lg"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=200'
                              }}
                            />
                            <div>
                              <div className="font-semibold text-gray-900">{destination.name}</div>
                              <div className="text-sm text-gray-600">{destination.difficulty_level}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900">{destination.country}</div>
                          {destination.region && (
                            <div className="text-sm text-gray-600">{destination.region}</div>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-sky-600">${destination.price}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1">
                            <span className="font-semibold">{destination.rating}</span>
                            <span className="text-yellow-400">★</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="text-gray-900">{destination.duration}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => window.open(`/destinations/${destination.id}`, '_blank')}
                              className="text-gray-600 hover:text-sky-600 p-2 rounded-lg hover:bg-sky-50 transition-colors duration-200"
                              title="View destination"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(destination)}
                              className="text-gray-600 hover:text-blue-600 p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                              title="Edit destination"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(destination)}
                              className="text-gray-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors duration-200"
                              title="Delete destination"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏝️</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'Try adjusting your search criteria.' : 'Start by adding your first destination.'}
            </p>
            <button
              onClick={handleAddNew}
              className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200 font-semibold"
            >
              Add First Destination
            </button>
          </div>
        )}

        {/* Form Modal */}
        <DestinationForm
          destination={selectedDestination}
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleSave}
        />
      </div>
    </div>
  )
}

export default AdminPanel