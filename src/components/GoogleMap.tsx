import React, { useEffect, useRef } from 'react'

interface MapProps {
  center: { lat: number; lng: number }
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
  }>
  zoom?: number
  className?: string
}

const GoogleMap: React.FC<MapProps> = ({ 
  center, 
  markers = [], 
  zoom = 10, 
  className = "w-full h-full" 
}) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return

      // Check if Google Maps is available
      if (typeof google === 'undefined' || !google.maps) {
        // Fallback: Show a static map-like interface
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300">
              <div class="text-center p-4">
                <div class="text-gray-500 mb-2">
                  <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                </div>
                <p class="text-gray-600 font-medium">Location: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}</p>
                <p class="text-sm text-gray-500 mt-1">Interactive map not available</p>
              </div>
            </div>
          `
        }
        return
      }

      // Initialize Google Map
      const map = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        styles: [
          {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }]
          }
        ]
      })

      mapInstanceRef.current = map

      // Add markers
      markers.forEach(marker => {
        new google.maps.Marker({
          position: marker.position,
          map,
          title: marker.title,
          animation: google.maps.Animation.DROP
        })
      })
    }

    // Load Google Maps script if not already loaded
    if (typeof google === 'undefined') {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      script.onerror = initMap // Still call initMap to show fallback
      document.head.appendChild(script)
    } else {
      initMap()
    }
  }, [center, markers, zoom])

  return <div ref={mapRef} className={className} />
}

export default GoogleMap