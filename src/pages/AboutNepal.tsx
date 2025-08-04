import React from 'react'
import { Mountain, Users, Globe, Heart, Camera, MapPin } from 'lucide-react'

const AboutNepal = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
        className="relative h-96 flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=1600)'
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            About Nepal
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            The Land of the Himalayas, Ancient Culture, and Endless Adventure
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Welcome to Nepal
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Nepal is a landlocked country in South Asia, nestled between the giants of China and India. 
              This small but mighty nation is home to eight of the world's ten highest peaks, including 
              the legendary Mount Everest, making it a paradise for trekkers and adventure enthusiasts 
              from around the globe.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Beyond its towering mountains, Nepal is a treasure trove of ancient culture, spiritual 
              heritage, and warm hospitality. From the medieval cities of the Kathmandu Valley to the 
              serene lakes of Pokhara, every corner of Nepal tells a story of resilience, beauty, and wonder.
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mountain className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Himalayan Giants</h3>
            <p className="text-gray-600">
              Home to 8 of the world's 14 peaks over 8,000 meters, including Mount Everest at 8,848.86m
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Rich Culture</h3>
            <p className="text-gray-600">
              Over 125 ethnic groups speaking 123 languages, creating a vibrant tapestry of traditions
            </p>
          </div>

          <div className="text-center p-8 bg-white rounded-xl shadow-lg">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Warm Hospitality</h3>
            <p className="text-gray-600">
              "Atithi Devo Bhava" - guests are treated as gods, experiencing unmatched warmth and kindness
            </p>
          </div>
        </div>

        {/* Geography & Climate */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Geography & Climate</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-gray-600">South Asia, between China and India</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Globe className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Area</h4>
                  <p className="text-gray-600">147,516 square kilometers</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mountain className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h4 className="font-semibold">Elevation Range</h4>
                  <p className="text-gray-600">From 60m (Terai) to 8,848m (Everest)</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Best Time to Visit</h3>
            <div className="space-y-4">
              <div className="bg-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-orange-800">Autumn (Sep-Nov)</h4>
                <p className="text-orange-700">Perfect for trekking with clear mountain views and stable weather</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-800">Spring (Mar-May)</h4>
                <p className="text-green-700">Rhododendrons bloom, warm weather, excellent for trekking</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-800">Winter (Dec-Feb)</h4>
                <p className="text-blue-700">Clear skies, cold temperatures, perfect for lower altitude treks</p>
              </div>
            </div>
          </div>
        </div>

        {/* Cultural Heritage */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Cultural Heritage</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">UNESCO World Heritage Sites</h4>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Kathmandu Durbar Square</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Patan Durbar Square</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Bhaktapur Durbar Square</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Swayambhunath Stupa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Boudhanath Stupa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Pashupatinath Temple</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Chitwan National Park</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Sagarmatha National Park</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Religious Harmony</h4>
              <p className="text-gray-700 mb-4">
                Nepal is a unique blend of Hinduism and Buddhism, where both religions coexist 
                peacefully. Many temples and stupas are revered by followers of both faiths.
              </p>
              <h4 className="text-xl font-semibold mb-4">Festivals</h4>
              <p className="text-gray-700">
                Experience vibrant festivals like Dashain, Tihar, Holi, and Buddha Jayanti 
                that showcase Nepal's rich cultural tapestry throughout the year.
              </p>
            </div>
          </div>
        </div>

        {/* Adventure Activities */}
        <div className="text-center mb-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Adventure Awaits</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mountain className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="font-semibold">Trekking</h4>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Camera className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold">Photography</h4>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h4 className="font-semibold">Cultural Tours</h4>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="font-semibold">Spiritual Journey</h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutNepal