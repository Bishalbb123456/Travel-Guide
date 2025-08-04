import React, { useEffect, useRef } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface GoogleMapProps {
  center: { lat: number; lng: number }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
    info?: string
  }>
  className?: string
}

const GoogleMap: React.FC<GoogleMapProps> = ({
  center,
  zoom = 10,
  markers = [],
  className = "w-full h-full"
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    const initMap = async () => {
      // Use a demo API key or fallback to OpenStreetMap
      const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'demo'
      
      if (GOOGLE_MAPS_API_KEY === 'demo' || !GOOGLE_MAPS_API_KEY) {
        // Fallback to a simple map placeholder with OpenStreetMap
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              <div class="text-center p-4">
                <div class="text-2xl mb-2">🗺️</div>
                <div class="font-semibold text-gray-700 mb-1">Map Location</div>
                <div class="text-sm text-gray-600">Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}</div>
                <a 
                  href="https://www.google.com/maps?q=${center.lat},${center.lng}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          `
        }
        return
      }

      try {
        const loader = new Loader({
          apiKey: GOOGLE_MAPS_API_KEY,
          version: 'weekly',
          libraries: ['places']
        })

        const google = await loader.load()

        if (mapRef.current) {
          const map = new google.maps.Map(mapRef.current, {
            center,
            zoom,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'on' }]
              }
            ]
          })

          mapInstanceRef.current = map

          // Add markers
          markers.forEach(marker => {
            const mapMarker = new google.maps.Marker({
              position: marker.position,
              map,
              title: marker.title
            })

            if (marker.info) {
              const infoWindow = new google.maps.InfoWindow({
                content: `
                  <div class="p-2">
                    <h3 class="font-semibold text-lg mb-1">${marker.title}</h3>
                    <p class="text-gray-600">${marker.info}</p>
                  </div>
                `
              })

              mapMarker.addListener('click', () => {
                infoWindow.open(map, mapMarker)
              })
            }
          })
        }
      } catch (error) {
        console.error('Error loading Google Maps:', error)
        // Fallback to simple map placeholder
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="w-full h-full bg-gray-200 flex items-center justify-center rounded-lg">
              <div class="text-center p-4">
                <div class="text-2xl mb-2">🗺️</div>
                <div class="font-semibold text-gray-700 mb-1">Map Location</div>
                <div class="text-sm text-gray-600">Lat: ${center.lat.toFixed(4)}, Lng: ${center.lng.toFixed(4)}</div>
                <a 
                  href="https://www.google.com/maps?q=${center.lat},${center.lng}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="inline-block mt-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          `
        }
      }
    }

    initMap()
  }, [center, zoom, markers])

  return <div ref={mapRef} className={className} />
}

export default GoogleMap