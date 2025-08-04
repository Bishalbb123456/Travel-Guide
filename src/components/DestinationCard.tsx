import React from 'react'
import { Star, Clock, MapPin, Users, Calendar } from 'lucide-react'
import { Destination } from '../lib/supabase'

interface DestinationCardProps {
  destination: Destination
  onClick: (destination: Destination) => void
}

const DestinationCard: React.FC<DestinationCardProps> = ({ destination, onClick }) => {
  return (
    <div 
      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
      onClick={() => onClick(destination)}
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center space-x-1">
          <Star className="h-4 w-4 text-yellow-500 fill-current" />
          <span className="text-sm font-semibold">{destination.rating}</span>
        </div>
        <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
          {destination.difficulty_level}
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{destination.name}</h3>
          <span className="text-2xl font-bold text-blue-600">${destination.price}</span>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{destination.region}, {destination.country}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{destination.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{destination.duration}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{destination.best_season}</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex flex-wrap gap-2">
            {destination.highlights?.slice(0, 3).map((highlight, index) => (
              <span
                key={index}
                className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
              >
                {highlight}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DestinationCard