# Nepal Explorer - Travel Destination App

A comprehensive travel destination application focused on Nepal and worldwide destinations, built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### 🏔️ Core Features
- **Destination Management**: Full CRUD operations for travel destinations
- **Rich Content**: Rich text descriptions, seasonal highlights, and special attractions
- **Image Management**: Upload and manage high-resolution destination images
- **Google Maps Integration**: Interactive maps with location markers and navigation
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices

### 🎯 User Features
- **Search & Filter**: Advanced search and filtering by country, region, price, difficulty, season
- **Destination Details**: Comprehensive destination pages with all information
- **Trip Planning**: Save and plan your travel itinerary
- **Navigation**: Direct Google Maps navigation to destinations
- **Social Sharing**: Share destinations via social media or direct links

### 🛠️ Admin Features
- **Admin Panel**: Complete destination management interface
- **Bulk Operations**: Manage multiple destinations efficiently
- **Image Upload**: Direct image upload with Supabase storage
- **Rich Text Editor**: Create detailed destination descriptions
- **Analytics**: View destination statistics and performance

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Storage, Auth)
- **Maps**: Google Maps API with fallback
- **Rich Text**: React Quill
- **Icons**: Lucide React
- **Build Tool**: Vite

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (optional - uses mock data if not configured)
- Google Maps API key (optional - uses fallback map if not provided)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-guide
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

### Supabase Setup (Optional)

If you want to use a real database instead of mock data:

1. Create a new Supabase project
2. Run the migration file in `supabase/migrations/` in your Supabase SQL editor
3. Enable Row Level Security policies
4. Set up storage bucket for images (optional)
5. Update your `.env` file with the real Supabase credentials

### Google Maps Setup (Optional)

1. Get a Google Maps API key from Google Cloud Console
2. Enable Maps JavaScript API and Places API
3. Add the API key to your `.env` file
4. The app will use a fallback map if no API key is provided

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── AdminPanel.tsx   # Admin management interface
│   ├── DestinationCard.tsx
│   ├── DestinationDetail.tsx
│   ├── DestinationForm.tsx
│   ├── GoogleMap.tsx    # Maps integration
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   └── SearchBar.tsx
├── pages/              # Page components
│   ├── Home.tsx
│   ├── Destinations.tsx
│   ├── AboutNepal.tsx
│   ├── Contact.tsx
│   └── Login.tsx
├── lib/                # Utilities and services
│   └── supabase.ts     # Database operations
└── App.tsx             # Main app component
```

## Key Features Explained

### 1. CRUD Operations
- **Create**: Add new destinations with rich content
- **Read**: Browse and search destinations
- **Update**: Edit existing destination information
- **Delete**: Remove destinations with confirmation

### 2. Rich Content Management
- Rich text descriptions with formatting
- Image upload and management
- Seasonal highlights and special attractions
- Location coordinates for mapping

### 3. Google Maps Integration
- Interactive maps showing destination locations
- Direct navigation to destinations
- Fallback map when API key is not available
- Marker clustering for better performance

### 4. Responsive Design
- Mobile-first approach
- Optimized for all screen sizes
- Touch-friendly interface
- Fast loading and smooth animations

### 5. Search and Filtering
- Real-time search across all destination fields
- Advanced filtering by multiple criteria
- URL-based search state management
- Debounced search for performance

## API Endpoints

The app uses Supabase for backend operations:

- `fetchDestinations(filters?)` - Get destinations with optional filtering
- `searchDestinations(query)` - Search destinations by text
- `getDestinationById(id)` - Get single destination details
- `createDestination(data)` - Create new destination
- `updateDestination(id, data)` - Update existing destination
- `deleteDestination(id)` - Delete destination
- `uploadDestinationImage(file, id)` - Upload destination image

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@nepalexplorer.com or create an issue in the repository.
