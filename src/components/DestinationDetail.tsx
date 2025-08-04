import React from 'react'
import { X, Star, Clock, MapPin, Calendar, Users, Mountain, Camera, Heart } from 'lucide-react'
import { Destination } from '../lib/supabase'
import GoogleMap from './GoogleMap'

interface DestinationDetailProps {
  destination: Destination
  onClose: () => void
}

const DestinationDetail: React.FC<DestinationDetailProps> = ({ destination, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative h-80 overflow-hidden rounded-t-2xl">
          <img
            src={destination.image_url}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
          <div className="absolute bottom-6 left-6 text-white">
            <h1 className="text-4xl font-bold mb-2">{destination.name}</h1>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <MapPin className="h-5 w-5 mr-1" />
                <span>{destination.region}, {destination.country}</span>
              </div>
              <div className="flex items-center">
                <Star className="h-5 w-5 mr-1 text-yellow-400 fill-current" />
                <span>{destination.rating}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8">
          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Duration</div>
              <div className="font-semibold">{destination.duration}</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <Mountain className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Difficulty</div>
              <div className="font-semibold">{destination.difficulty_level}</div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg text-center">
              <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Best Season</div>
              <div className="font-semibold">{destination.best_season}</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <Users className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-gray-600">Price</div>
              <div className="font-semibold text-xl">${destination.price}</div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4">About This Destination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">{destination.description}</p>
            {destination.rich_description && (
              <p className="text-gray-700 leading-relaxed">{destination.rich_description}</p>
            )}
          </div>

          {/* Highlights */}
          {destination.highlights && destination.highlights.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {destination.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Special Attractions */}
          {destination.special_attractions && destination.special_attractions.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Special Attractions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.special_attractions.map((attraction, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg flex items-center space-x-3">
                    <Camera className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">{attraction}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What's Fresh */}
          {destination.what_fresh && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">What's Fresh</h2>
              <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-500">
                <p className="text-gray-700">{destination.what_fresh}</p>
              </div>
            </div>
          )}

          {/* Seasonal Highlights */}
          {destination.seasonal_highlights && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Seasonal Information</h2>
              <div className="bg-orange-50 p-6 rounded-lg">
                <p className="text-gray-700">{destination.seasonal_highlights}</p>
              </div>
            </div>
          )}

          {/* Map */}
          {destination.latitude && destination.longitude && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2">
              <Heart className="h-5 w-5" />
              <span>Book Now - ${destination.price}</span>
            </button>
            <button className="flex-1 border border-blue-600 text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Save for Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationDetail