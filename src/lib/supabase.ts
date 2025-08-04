import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Check if Supabase is properly configured
export const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'your_supabase_url_here' && 
  supabaseAnonKey !== 'your_supabase_anon_key_here' &&
  supabaseUrl.startsWith('https://')

// Only create Supabase client if properly configured
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Test the connection only if Supabase is configured
if (isSupabaseConfigured && supabase) {
  supabase.auth.getSession().then(({ data, error }) => {
    if (error) {
      console.error('Error connecting to Supabase:', error.message)
    } else {
      console.log('Successfully connected to Supabase')
    }
  })
} else {
  console.log('Using mock data - Supabase not configured')
}

// Types for our database
export interface Destination {
  id: number
  name: string
  country: string
  region?: string
  description: string
  rich_description?: string
  image_url: string
  price: number
  duration: string
  rating: number
  difficulty_level?: string
  best_season?: string
  highlights?: string[]
  latitude?: number
  longitude?: number
  what_fresh?: string
  special_attractions?: string[]
  seasonal_highlights?: string
  created_at: string
}

export interface DestinationFilters {
  country?: string
  region?: string
  minPrice?: number
  maxPrice?: number
  difficulty?: string
  season?: string
}

// Supabase functions
export const fetchDestinations = async (filters?: DestinationFilters) => {
  if (!isSupabaseConfigured || !supabase) {
    // Return mock data when Supabase is not configured
    return getMockDestinations(filters)
  }

  let query = supabase
    .from('destinations')
    .select('*')
    .order('rating', { ascending: false })

  if (filters?.country) {
    query = query.eq('country', filters.country)
  }
  
  if (filters?.region) {
    query = query.eq('region', filters.region)
  }
  
  if (filters?.minPrice) {
    query = query.gte('price', filters.minPrice)
  }
  
  if (filters?.maxPrice) {
    query = query.lte('price', filters.maxPrice)
  }
  
  if (filters?.difficulty) {
    query = query.eq('difficulty_level', filters.difficulty)
  }
  
  if (filters?.season) {
    query = query.eq('best_season', filters.season)
  }

  const { data, error } = await query
  
  if (error) {
    console.error('Error fetching destinations:', error)
    return []
  }
  
  return data || []
}

export const searchDestinations = async (searchTerm: string) => {
  if (!isSupabaseConfigured || !supabase) {
    const mockData = getMockDestinations()
    return mockData.filter(dest => 
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.region?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10)
  }

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,country.ilike.%${searchTerm}%,region.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('rating', { ascending: false })
    .limit(10)

  if (error) {
    console.error('Error searching destinations:', error)
    return []
  }
  
  return data || []
}

export const getDestinationById = async (id: number) => {
  if (!isSupabaseConfigured || !supabase) {
    const mockData = getMockDestinations()
    return mockData.find(dest => dest.id === id) || null
  }

  const { data, error } = await supabase
    .from('destinations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching destination:', error)
    return null
  }
  
  return data
}

// CRUD Operations
export const createDestination = async (destination: Omit<Destination, 'id' | 'created_at'>) => {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Mock: Creating destination', destination)
    return { id: Date.now(), ...destination, created_at: new Date().toISOString() }
  }

  const { data, error } = await supabase
    .from('destinations')
    .insert([destination])
    .select()
    .single()

  if (error) {
    console.error('Error creating destination:', error)
    throw error
  }

  return data
}

export const updateDestination = async (id: number, updates: Partial<Destination>) => {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Mock: Updating destination', id, updates)
    return { id, ...updates }
  }

  const { data, error } = await supabase
    .from('destinations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating destination:', error)
    throw error
  }

  return data
}

export const deleteDestination = async (id: number) => {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Mock: Deleting destination', id)
    return true
  }

  const { error } = await supabase
    .from('destinations')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting destination:', error)
    throw error
  }

  return true
}

// Image upload function
export const uploadDestinationImage = async (file: File, destinationId: number) => {
  if (!isSupabaseConfigured || !supabase) {
    console.log('Mock: Uploading image for destination', destinationId)
    return `https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=1200`
  }

  const fileExt = file.name.split('.').pop()
  const fileName = `${destinationId}-${Date.now()}.${fileExt}`
  const filePath = `destination-images/${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Error uploading image:', uploadError)
    throw uploadError
  }

  const { data } = supabase.storage
    .from('images')
    .getPublicUrl(filePath)

  return data.publicUrl
}
// Mock data for when Supabase is not configured
const getMockDestinations = (filters?: DestinationFilters): Destination[] => {
  const mockData: Destination[] = [
    {
      id: 1,
      name: "Everest Base Camp Trek",
      country: "Nepal",
      region: "Khumbu",
      description: "The ultimate trekking adventure to the base of the world's highest mountain. Experience Sherpa culture, stunning mountain views, and the thrill of reaching 5,364m.",
      rich_description: "Embark on the most iconic trek in the world to Everest Base Camp. This challenging 14-day journey takes you through the heart of the Khumbu region, home to the legendary Sherpa people. Experience breathtaking mountain vistas, ancient monasteries, and the unique high-altitude culture of the Himalayas.",
      image_url: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 2499,
      duration: "14 days",
      rating: 4.9,
      difficulty_level: "Challenging",
      best_season: "Autumn",
      highlights: ["Mount Everest views", "Sherpa culture", "Namche Bazaar", "Tengboche Monastery"],
      latitude: 27.9881,
      longitude: 86.9250,
      what_fresh: "Crystal clear mountain air, pristine glacial streams, and the spiritual energy of ancient Buddhist monasteries",
      special_attractions: ["Everest Base Camp", "Kala Patthar viewpoint", "Sherpa villages", "Buddhist monasteries"],
      seasonal_highlights: "October-December: Clear skies and stunning mountain views; March-May: Rhododendron blooms and warmer weather",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Annapurna Circuit Trek",
      country: "Nepal",
      region: "Annapurna",
      description: "A classic trek through diverse landscapes, from subtropical forests to high alpine terrain. Cross the Thorong La Pass at 5,416m and experience incredible mountain panoramas.",
      rich_description: "The Annapurna Circuit is one of Nepal's most diverse and rewarding treks, offering an incredible variety of landscapes, cultures, and experiences. Journey through lush rhododendron forests, traditional villages, and high-altitude deserts.",
      image_url: "https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 1899,
      duration: "16 days",
      rating: 4.8,
      difficulty_level: "Challenging",
      best_season: "Autumn",
      highlights: ["Thorong La Pass", "Diverse landscapes", "Hot springs", "Mountain panoramas"],
      latitude: 28.5967,
      longitude: 83.8202,
      what_fresh: "Natural hot springs, diverse ecosystems from tropical to alpine, and stunning 360-degree mountain views",
      special_attractions: ["Thorong La Pass", "Muktinath Temple", "Manang village", "Tilicho Lake"],
      seasonal_highlights: "Spring brings blooming rhododendrons, while autumn offers crystal clear mountain views",
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "Kathmandu Valley Tour",
      country: "Nepal",
      region: "Central",
      description: "Explore the cultural heart of Nepal with visits to ancient temples, palaces, and UNESCO World Heritage Sites in Kathmandu, Bhaktapur, and Patan.",
      rich_description: "Discover the living heritage of Nepal in the Kathmandu Valley, where ancient traditions blend seamlessly with modern life. Explore medieval cities, ornate temples, and vibrant markets that have remained unchanged for centuries.",
      image_url: "https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 299,
      duration: "3 days",
      rating: 4.6,
      difficulty_level: "Easy",
      best_season: "All seasons",
      highlights: ["UNESCO sites", "Ancient temples", "Local culture", "Traditional crafts"],
      latitude: 27.7172,
      longitude: 85.3240,
      what_fresh: "Living heritage sites, traditional craftsmanship, authentic Newari cuisine, and vibrant festivals",
      special_attractions: ["Durbar Squares", "Swayambhunath Stupa", "Pashupatinath Temple", "Boudhanath Stupa"],
      seasonal_highlights: "Year-round destination with special festivals throughout the seasons",
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: "Pokhara Lake District",
      country: "Nepal",
      region: "Western",
      description: "Relax by the serene Phewa Lake with stunning Annapurna mountain reflections. Perfect for boating, paragliding, and enjoying the laid-back atmosphere.",
      rich_description: "Pokhara is Nepal's adventure capital and a gateway to the Annapurna region. This lakeside city offers the perfect blend of natural beauty, adventure activities, and relaxation with stunning mountain backdrops.",
      image_url: "https://images.pexels.com/photos/1661546/pexels-photo-1661546.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 199,
      duration: "2 days",
      rating: 4.7,
      difficulty_level: "Easy",
      best_season: "All seasons",
      highlights: ["Phewa Lake", "Mountain views", "Paragliding", "Peace Pagoda"],
      latitude: 28.2096,
      longitude: 83.9856,
      what_fresh: "Mirror-like lake reflections, adventure sports, lakeside dining, and stunning sunrise views over the Himalayas",
      special_attractions: ["Phewa Lake", "World Peace Pagoda", "Devi's Fall", "Gupteshwor Cave"],
      seasonal_highlights: "Clear mountain views in autumn and winter, lush greenery during monsoon",
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: "Mount Fuji Climb",
      country: "Japan",
      region: "Honshu",
      description: "Climb Japan's sacred mountain and highest peak. Experience traditional Japanese culture and stunning sunrise views from the summit.",
      rich_description: "Mount Fuji is Japan's most iconic symbol and a sacred mountain that has inspired artists and pilgrims for centuries. The climbing season offers a unique spiritual and physical challenge with breathtaking rewards.",
      image_url: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 899,
      duration: "3 days",
      rating: 4.5,
      difficulty_level: "Moderate",
      best_season: "Summer",
      highlights: ["Sacred mountain", "Sunrise views", "Japanese culture", "Pilgrimage route"],
      latitude: 35.3606,
      longitude: 138.7274,
      what_fresh: "Sacred mountain energy, traditional climbing culture, spectacular sunrise views, and spiritual pilgrimage experience",
      special_attractions: ["Summit crater", "Mountain huts", "Five Lakes region", "Traditional shrines"],
      seasonal_highlights: "July-September climbing season with perfect weather and clear views",
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: "Bali Cultural Tour",
      country: "Indonesia",
      region: "Bali",
      description: "Discover the Island of Gods with visits to ancient temples, rice terraces, and traditional villages. Experience Balinese Hindu culture and stunning landscapes.",
      rich_description: "Bali offers a perfect blend of spiritual culture, natural beauty, and tropical paradise. Experience the unique Balinese Hindu culture, stunning rice terraces, and pristine beaches in this island paradise.",
      image_url: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 799,
      duration: "7 days",
      rating: 4.6,
      difficulty_level: "Easy",
      best_season: "Dry season",
      highlights: ["Hindu temples", "Rice terraces", "Traditional villages", "Cultural performances"],
      latitude: -8.3405,
      longitude: 115.0920,
      what_fresh: "Tropical paradise, spiritual temple ceremonies, traditional arts and crafts, and world-class beaches",
      special_attractions: ["Tanah Lot Temple", "Tegallalang Rice Terraces", "Ubud Monkey Forest", "Kuta Beach"],
      seasonal_highlights: "April-October dry season perfect for temple visits and beach activities",
      created_at: new Date().toISOString()
    }
  ]

  let filteredData = mockData

  if (filters?.country) {
    filteredData = filteredData.filter(dest => dest.country === filters.country)
  }
  
  if (filters?.region) {
    filteredData = filteredData.filter(dest => dest.region === filters.region)
  }
  
  if (filters?.minPrice) {
    filteredData = filteredData.filter(dest => dest.price >= filters.minPrice!)
  }
  
  if (filters?.maxPrice) {
    filteredData = filteredData.filter(dest => dest.price <= filters.maxPrice!)
  }
  
  if (filters?.difficulty) {
    filteredData = filteredData.filter(dest => dest.difficulty_level === filters.difficulty)
  }
  
  if (filters?.season) {
    filteredData = filteredData.filter(dest => dest.best_season === filters.season)
  }
  return filteredData
}