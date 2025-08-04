import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Clock, 
  Calendar, 
  Mountain, 
  Navigation,
  Heart,
  Share2,
  BookOpen,
  Sparkles,
  Sun
} from 'lucide-react'
import { getDestinationById, Destination } from '../lib/supabase'
import GoogleMap from './GoogleMap'

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const loadDestination = async () => {
      if (!id) return
      
      try {
        const data = await getDestinationById(parseInt(id))
        setDestination(data)
      } catch (error) {
        console.error('Error loading destination:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDestination()
  }, [id])

  const handleNavigate = () => {
    if (destination?.latitude && destination?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.latitude},${destination.longitude}`
      window.open(url, '_blank')
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: destination?.name,
          text: destination?.description,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Error sharing:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  const handlePlanTrip = () => {
    // This would integrate with a trip planning system
    alert('Trip planning feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
          <button
            onClick={() => navigate('/destinations')}
            className="bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors duration-200"
          >
            Back to Destinations
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = 'https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1200'
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Navigation */}
        <div className="absolute top-6 left-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
        </div>

        {/* Actions */}
        <div className="absolute top-6 right-6 flex gap-3">
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className={`p-3 rounded-full shadow-lg transition-all duration-200 ${
              isFavorite 
                ? 'bg-red-500 text-white' 
                : 'bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900'
            }`}
          >
            <Heart className={`h-6 w-6 ${isFavorite ? 'fill-current' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-200"
          >
            <Share2 className="h-6 w-6" />
          </button>
        </div>

        {/* Title */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5" />
            <span className="text-lg">
              {destination.region && `${destination.region}, `}{destination.country}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{destination.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <span className="text-lg font-semibold">{destination.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-5 w-5" />
              <span>{destination.duration}</span>
            </div>
            <div className="text-2xl font-bold">
              ${destination.price}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {destination.difficulty_level && (
                  <div className="text-center">
                    <Mountain className="h-8 w-8 text-sky-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Difficulty</div>
                    <div className="font-semibold">{destination.difficulty_level}</div>
                  </div>
                )}
                {destination.best_season && (
                  <div className="text-center">
                    <Calendar className="h-8 w-8 text-sky-600 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Best Season</div>
                    <div className="font-semibold">{destination.best_season}</div>
                  </div>
                )}
                <div className="text-center">
                  <Clock className="h-8 w-8 text-sky-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="font-semibold">{destination.duration}</div>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-sky-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-600">Rating</div>
                  <div className="font-semibold">{destination.rating}/5</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-6 w-6 text-sky-600" />
                About This Destination
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {destination.description}
              </p>
              
              {destination.rich_description && (
                <div 
                  className="prose prose-lg max-w-none text-gray-700"
                  dangerouslySetInnerHTML={{ __html: destination.rich_description }}
                />
              )}
            </div>

            {/* What's Fresh */}
            {destination.what_fresh && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-orange-500" />
                  What's Fresh
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {destination.what_fresh}
                </p>
              </div>
            )}

            {/* Seasonal Highlights */}
            {destination.seasonal_highlights && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Sun className="h-6 w-6 text-yellow-500" />
                  Seasonal Highlights
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  {destination.seasonal_highlights}
                </p>
              </div>
            )}

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {destination.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-sky-50 rounded-lg">
                      <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                      <span className="text-gray-700">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Attractions */}
            {destination.special_attractions && destination.special_attractions.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Special Attractions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {destination.special_attractions.map((attraction, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      <span className="text-gray-700">{attraction}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            {destination.latitude && destination.longitude && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                  Location
                </h2>
                <div className="h-64 rounded-lg overflow-hidden">
                  <GoogleMap
                    center={{ lat: destination.latitude, lng: destination.longitude }}
                    markers={[{
                      position: { lat: destination.latitude, lng: destination.longitude },
                      title: destination.name
                    }]}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-sky-600 mb-2">
                  ${destination.price}
                </div>
                <div className="text-gray-600">per person</div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePlanTrip}
                  className="w-full bg-sky-600 text-white py-3 px-6 rounded-lg hover:bg-sky-700 transition-colors duration-200 font-semibold"
                >
                  Plan Your Trip
                </button>

                {destination.latitude && destination.longitude && (
                  <button
                    onClick={handleNavigate}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 font-semibold flex items-center justify-center gap-2"
                  >
                    <Navigation className="h-5 w-5" />
                    Navigate with Google Maps
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-semibold flex items-center justify-center gap-2"
                >
                  <Share2 className="h-5 w-5" />
                  Share Destination
                </button>
              </div>
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Country:</span>
                  <span className="font-semibold">{destination.country}</span>
                </div>
                {destination.region && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-semibold">{destination.region}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold">{destination.duration}</span>
                </div>
                {destination.difficulty_level && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Difficulty:</span>
                    <span className="font-semibold">{destination.difficulty_level}</span>
                  </div>
                )}
                {destination.best_season && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Best Season:</span>
                    <span className="font-semibold">{destination.best_season}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating:</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="font-semibold">{destination.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetail