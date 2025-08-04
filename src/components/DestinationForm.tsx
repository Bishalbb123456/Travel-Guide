import React, { useState, useRef } from 'react'
import { X, Upload, MapPin, Save, Loader } from 'lucide-react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { Destination, createDestination, updateDestination, uploadDestinationImage } from '../lib/supabase'

interface DestinationFormProps {
  destination?: Destination
  isOpen: boolean
  onClose: () => void
  onSave: (destination: Destination) => void
}

const DestinationForm: React.FC<DestinationFormProps> = ({
  destination,
  isOpen,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: destination?.name || '',
    country: destination?.country || '',
    region: destination?.region || '',
    description: destination?.description || '',
    rich_description: destination?.rich_description || '',
    image_url: destination?.image_url || '',
    price: destination?.price || 0,
    duration: destination?.duration || '',
    rating: destination?.rating || 4.0,
    difficulty_level: destination?.difficulty_level || '',
    best_season: destination?.best_season || '',
    highlights: destination?.highlights || [],
    latitude: destination?.latitude || 0,
    longitude: destination?.longitude || 0,
    what_fresh: destination?.what_fresh || '',
    special_attractions: destination?.special_attractions || [],
    seasonal_highlights: destination?.seasonal_highlights || ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(destination?.image_url || '')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleArrayChange = (name: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item)
    setFormData(prev => ({
      ...prev,
      [name]: array
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = formData.image_url

      // Upload new image if selected
      if (imageFile && destination?.id) {
        imageUrl = await uploadDestinationImage(imageFile, destination.id)
      }

      const destinationData = {
        ...formData,
        image_url: imageUrl
      }

      let savedDestination: Destination

      if (destination?.id) {
        // Update existing destination
        savedDestination = await updateDestination(destination.id, destinationData)
      } else {
        // Create new destination
        savedDestination = await createDestination(destinationData)
        
        // Upload image for new destination
        if (imageFile) {
          const newImageUrl = await uploadDestinationImage(imageFile, savedDestination.id)
          savedDestination = await updateDestination(savedDestination.id, { image_url: newImageUrl })
        }
      }

      onSave(savedDestination)
      onClose()
    } catch (error) {
      console.error('Error saving destination:', error)
      alert('Error saving destination. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {destination ? 'Edit Destination' : 'Add New Destination'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter destination name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter country"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Region
              </label>
              <input
                type="text"
                name="region"
                value={formData.region}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter region"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration *
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="e.g., 7 days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                min="0"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter price"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating (1-5)
              </label>
              <input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleInputChange}
                min="1"
                max="5"
                step="0.1"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter rating"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty Level
              </label>
              <select
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Challenging">Challenging</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Season
              </label>
              <input
                type="text"
                name="best_season"
                value={formData.best_season}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="e.g., Spring, Autumn"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Latitude
              </label>
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="any"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter latitude"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Longitude
              </label>
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="any"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                placeholder="Enter longitude"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Image
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
              {imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('')
                      setImageFile(null)
                      if (fileInputRef.current) fileInputRef.current.value = ''
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">Upload a high-resolution image</p>
                  <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg transition-colors duration-200"
              >
                {imagePreview ? 'Change Image' : 'Select Image'}
              </button>
            </div>
            
            {!imagePreview && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Or enter image URL
                </label>
                <input
                  type="url"
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            )}
          </div>

          {/* Descriptions */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Brief description of the destination"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rich Description
            </label>
            <ReactQuill
              value={formData.rich_description}
              onChange={(value) => setFormData(prev => ({ ...prev, rich_description: value }))}
              className="bg-white"
              placeholder="Detailed description with formatting..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What's Fresh
            </label>
            <textarea
              name="what_fresh"
              value={formData.what_fresh}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="What makes this destination special and fresh"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seasonal Highlights
            </label>
            <textarea
              name="seasonal_highlights"
              value={formData.seasonal_highlights}
              onChange={handleInputChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              placeholder="Best times to visit and seasonal attractions"
            />
          </div>

          {/* Arrays */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Highlights (comma-separated)
            </label>
            <input
              type="text"
              value={formData.highlights.join(', ')}
              onChange={(e) => handleArrayChange('highlights', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Mountain views, Cultural sites, Adventure activities"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Attractions (comma-separated)
            </label>
            <input
              type="text"
              value={formData.special_attractions.join(', ')}
              onChange={(e) => handleArrayChange('special_attractions', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Famous landmarks, Must-see places, Unique features"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {isLoading ? 'Saving...' : 'Save Destination'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DestinationForm