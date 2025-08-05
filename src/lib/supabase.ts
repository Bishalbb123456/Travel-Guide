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
      image_url: "https://trekthehimalayas.com/images/EverestBaseCampTrek/GalleryDesktop/Summer/8ebcab01-64a4-4a6b-9a4c-f2b4de2650fc_EBC-2.webp",
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
      image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      image_url: "https://images.unsplash.com/photo-1605640840605-14ac1855827b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      image_url: "https://images.unsplash.com/photo-1585058770932-eda3022b0e13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
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
      name: "Langtang Valley Trek",
      country: "Nepal",
      region: "Central",
      description: "Trek through the beautiful Langtang Valley, known as the 'Valley of Glaciers'. Experience Tamang culture, stunning mountain views, and pristine alpine forests.",
      rich_description: "The Langtang Valley Trek offers an incredible journey through one of Nepal's most accessible trekking regions. Walk through rhododendron forests, traditional Tamang villages, and witness the dramatic landscapes of the Langtang Himalayas.",
      image_url: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 1299,
      duration: "10 days",
      rating: 4.7,
      difficulty_level: "Moderate",
      best_season: "Autumn",
      highlights: ["Langtang Lirung views", "Tamang culture", "Kyanjin Gompa", "Cheese factory"],
      latitude: 28.2096,
      longitude: 85.5500,
      what_fresh: "Traditional yak cheese, pristine mountain air, and authentic Tamang hospitality",
      special_attractions: ["Kyanjin Gompa monastery", "Langtang village", "Tserko Ri viewpoint", "Local cheese factory"],
      seasonal_highlights: "October-November: Clear mountain views and perfect weather; March-May: Blooming rhododendrons",
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: "Chitwan National Park Safari",
      country: "Nepal",
      region: "Central",
      description: "Experience Nepal's wildlife in this UNESCO World Heritage site. Spot rhinos, tigers, elephants, and over 500 bird species in their natural habitat.",
      rich_description: "Chitwan National Park is Nepal's first national park and a UNESCO World Heritage Site. This lowland preserve protects one of the last populations of single-horned Asiatic rhinoceros and is home to many other endangered species.",
      image_url: "https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 599,
      duration: "4 days",
      rating: 4.5,
      difficulty_level: "Easy",
      best_season: "Winter",
      highlights: ["Rhino spotting", "Tiger tracking", "Elephant safari", "Bird watching"],
      latitude: 27.5291,
      longitude: 84.3542,
      what_fresh: "Pristine jungle atmosphere, diverse wildlife encounters, and traditional Tharu culture",
      special_attractions: ["One-horned rhinoceros", "Royal Bengal tigers", "Gharial crocodiles", "Tharu cultural show"],
      seasonal_highlights: "October-March: Best wildlife viewing with clear weather and active animals",
      created_at: new Date().toISOString()
    },
    {
      id: 7,
      name: "Upper Mustang Trek",
      country: "Nepal",
      region: "Western",
      description: "Journey to the forbidden kingdom of Upper Mustang, a remote region with Tibetan culture, ancient monasteries, and dramatic desert landscapes.",
      rich_description: "Upper Mustang, once the Kingdom of Lo, is a restricted area that preserves ancient Tibetan Buddhist culture. This trek takes you through a high-altitude desert landscape with cave dwellings, ancient monasteries, and the walled city of Lo Manthang.",
      image_url: "https://images.pexels.com/photos/1366957/pexels-photo-1366957.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 3299,
      duration: "18 days",
      rating: 4.8,
      difficulty_level: "Challenging",
      best_season: "Summer",
      highlights: ["Lo Manthang palace", "Ancient caves", "Tibetan culture", "Desert landscapes"],
      latitude: 28.9833,
      longitude: 83.8833,
      what_fresh: "Ancient Tibetan culture, mysterious cave dwellings, and untouched high-altitude desert",
      special_attractions: ["Lo Manthang walled city", "Chhoser caves", "Ghar Gompa monastery", "Sky caves"],
      seasonal_highlights: "May-September: Only accessible season due to high altitude and weather conditions",
      created_at: new Date().toISOString()
    },
    {
      id: 8,
      name: "Gokyo Lakes Trek",
      country: "Nepal",
      region: "Khumbu",
      description: "Trek to the stunning turquoise Gokyo Lakes and climb Gokyo Ri for spectacular views of Everest, Lhotse, Makalu, and Cho Oyu.",
      rich_description: "The Gokyo Lakes Trek is an alternative to the Everest Base Camp trek, offering equally stunning mountain views with fewer crowds. The trek features six pristine glacial lakes and the opportunity to climb Gokyo Ri for panoramic Himalayan views.",
      image_url: "https://images.pexels.com/photos/1366630/pexels-photo-1366630.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 2199,
      duration: "12 days",
      rating: 4.8,
      difficulty_level: "Challenging",
      best_season: "Autumn",
      highlights: ["Gokyo Lakes", "Gokyo Ri summit", "Everest views", "Ngozumpa Glacier"],
      latitude: 27.9667,
      longitude: 86.6833,
      what_fresh: "Pristine glacial lakes, world's largest glacier, and stunning mountain reflections",
      special_attractions: ["Six sacred lakes", "Gokyo Ri viewpoint", "Ngozumpa Glacier", "Sherpa villages"],
      seasonal_highlights: "October-November: Crystal clear lake reflections and perfect mountain views",
      created_at: new Date().toISOString()
    },
    {
      id: 9,
      name: "Manaslu Circuit Trek",
      country: "Nepal",
      region: "Western",
      description: "Trek around the eighth highest mountain in the world. Experience remote villages, diverse landscapes, and cross the challenging Larkya La Pass.",
      rich_description: "The Manaslu Circuit Trek is one of Nepal's most spectacular and challenging treks, circling the majestic Manaslu massif. This remote trek offers pristine mountain scenery, rich cultural diversity, and the thrill of crossing the high-altitude Larkya La Pass.",
      image_url: "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 2799,
      duration: "16 days",
      rating: 4.9,
      difficulty_level: "Expert",
      best_season: "Autumn",
      highlights: ["Manaslu views", "Larkya La Pass", "Remote villages", "Buddhist monasteries"],
      latitude: 28.5500,
      longitude: 84.5667,
      what_fresh: "Untouched mountain wilderness, authentic local culture, and challenging high-altitude adventure",
      special_attractions: ["Manaslu Base Camp", "Larkya La Pass (5,106m)", "Samagaon village", "Pungen Gompa"],
      seasonal_highlights: "September-November: Stable weather and clear mountain views for the challenging pass crossing",
      created_at: new Date().toISOString()
    },
    {
      id: 10,
      name: "Rara Lake Trek",
      country: "Nepal",
      region: "Western",
      description: "Visit Nepal's largest lake in the remote far-western region. Experience pristine wilderness, diverse wildlife, and the crystal-clear waters of Rara Lake.",
      rich_description: "Rara Lake Trek takes you to Nepal's largest and deepest lake, located in the remote Rara National Park. This off-the-beaten-path adventure offers pristine wilderness, diverse flora and fauna, and the stunning beauty of the crystal-clear Rara Lake.",
      image_url: "https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800",
      price: 1899,
      duration: "12 days",
      rating: 4.6,
      difficulty_level: "Moderate",
      best_season: "Autumn",
      highlights: ["Rara Lake", "National park", "Wildlife viewing", "Remote wilderness"],
      latitude: 29.5167,
      longitude: 82.0833,
      what_fresh: "Pristine wilderness, crystal-clear lake waters, and rare wildlife in untouched nature",
      special_attractions: ["Rara Lake", "Rara National Park", "Chuchemara Hill", "Local Thakuri culture"],
      seasonal_highlights: "September-November: Perfect weather with clear lake reflections and comfortable temperatures",
      created_at: new Date().toISOString()
    },
    {
      id: 11,
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
      id: 12,
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