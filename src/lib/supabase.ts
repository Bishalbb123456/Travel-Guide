import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file')
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Error connecting to Supabase:', error.message)
  } else {
    console.log('Successfully connected to Supabase')
  }
})

// Types for our database
export interface Destination {
  id: number
  name: string
  country: string
  region?: string
  description: string
  image_url: string
  price: number
  duration: string
  rating: number
  difficulty_level?: string
  best_season?: string
  highlights?: string[]
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
  if (!isSupabaseConfigured) {
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
  if (!isSupabaseConfigured) {
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

// Mock data for when Supabase is not configured
const getMockDestinations = (filters?: DestinationFilters): Destination[] => {
  const mockData: Destination[] = [
    {
      id: 1,
      name: "Everest Base Camp Trek",
      country: "Nepal",
      region: "Khumbu",
      description: "The ultimate trekking adventure to the base of the world's highest mountain. Experience Sherpa culture, stunning mountain views, and the thrill of reaching 5,364m.",
      image_url: "https://images.pexels.com/photos/1287460/pexels-photo-1287460.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 2499,
      duration: "14 days",
      rating: 4.9,
      difficulty_level: "Challenging",
      best_season: "Autumn",
      highlights: ["Mount Everest views", "Sherpa culture", "Namche Bazaar", "Tengboche Monastery"],
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "Annapurna Circuit Trek",
      country: "Nepal",
      region: "Annapurna",
      description: "A classic trek through diverse landscapes, from subtropical forests to high alpine terrain. Cross the Thorong La Pass at 5,416m and experience incredible mountain panoramas.",
      image_url: "https://images.pexels.com/photos/1559825/pexels-photo-1559825.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 1899,
      duration: "16 days",
      rating: 4.8,
      difficulty_level: "Challenging",
      best_season: "Autumn",
      highlights: ["Thorong La Pass", "Diverse landscapes", "Hot springs", "Mountain panoramas"],
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "Kathmandu Valley Tour",
      country: "Nepal",
      region: "Central",
      description: "Explore the cultural heart of Nepal with visits to ancient temples, palaces, and UNESCO World Heritage Sites in Kathmandu, Bhaktapur, and Patan.",
      image_url: "https://images.pexels.com/photos/2850287/pexels-photo-2850287.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 299,
      duration: "3 days",
      rating: 4.6,
      difficulty_level: "Easy",
      best_season: "All seasons",
      highlights: ["UNESCO sites", "Ancient temples", "Local culture", "Traditional crafts"],
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: "Pokhara Lake District",
      country: "Nepal",
      region: "Western",
      description: "Relax by the serene Phewa Lake with stunning Annapurna mountain reflections. Perfect for boating, paragliding, and enjoying the laid-back atmosphere.",
      image_url: "https://images.pexels.com/photos/1661546/pexels-photo-1661546.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 199,
      duration: "2 days",
      rating: 4.7,
      difficulty_level: "Easy",
      best_season: "All seasons",
      highlights: ["Phewa Lake", "Mountain views", "Paragliding", "Peace Pagoda"],
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      name: "Mount Fuji Climb",
      country: "Japan",
      region: "Honshu",
      description: "Climb Japan's sacred mountain and highest peak. Experience traditional Japanese culture and stunning sunrise views from the summit.",
      image_url: "https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 899,
      duration: "3 days",
      rating: 4.5,
      difficulty_level: "Moderate",
      best_season: "Summer",
      highlights: ["Sacred mountain", "Sunrise views", "Japanese culture", "Pilgrimage route"],
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: "Bali Cultural Tour",
      country: "Indonesia",
      region: "Bali",
      description: "Discover the Island of Gods with visits to ancient temples, rice terraces, and traditional villages. Experience Balinese Hindu culture and stunning landscapes.",
      image_url: "https://images.pexels.com/photos/2474690/pexels-photo-2474690.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 799,
      duration: "7 days",
      rating: 4.6,
      difficulty_level: "Easy",
      best_season: "Dry season",
      highlights: ["Hindu temples", "Rice terraces", "Traditional villages", "Cultural performances"],
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