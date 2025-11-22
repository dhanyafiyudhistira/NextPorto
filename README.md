# 🎵 Spotify-like Music Player

A modern, full-featured music player web application built with Next.js 14, PostgreSQL, and Radix UI. Inspired by Spotify's design, this app provides a beautiful and intuitive interface for managing and playing your music collection.

![Music Player](https://via.placeholder.com/800x400/7c3aed/ffffff?text=Music+Player)

## ✨ Features

- 🎨 **Beautiful UI** - Spotify-inspired design with light/dark mode support
- 🎵 **Full Music Player** - Play, pause, next, previous, shuffle, and repeat
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔍 **Search** - Find songs, artists, and albums quickly
- 📚 **Library Management** - Create and manage playlists
- 🎯 **Queue Management** - View and control your play queue
- 🔊 **Volume Control** - Adjustable volume with mute toggle
- ⏱️ **Progress Bar** - Seek through tracks with precision
- 🎨 **CSS Variables** - Customizable theming without Tailwind
- 🔐 **Authentication** - Secure user authentication with NextAuth.js

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Radix UI** - Accessible, unstyled component primitives
- **CSS Modules** - Scoped styling with CSS variables
- **Zustand** - Lightweight state management

### Backend
- **PostgreSQL** - Relational database
- **Prisma** - Next-generation ORM
- **NextAuth.js** - Authentication for Next.js

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **pnpm**
- **PostgreSQL** (v14 or higher)

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd NextPorto
```

### 2. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 3. Set Up PostgreSQL Database

Create a new PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE music_app;

# Exit psql
\q
```

### 4. Configure Environment Variables

Copy the `.env.example` file to `.env` and update the values:

```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:

```env
# Database
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/music_app"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-change-this-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a secure `NEXTAUTH_SECRET`, run:

```bash
openssl rand -base64 32
```

### 5. Set Up the Database

Run Prisma migrations to create the database schema:

```bash
npx prisma generate
npx prisma db push
```

### 6. Add Sample Audio Files

Add MP3 audio files to the `public/audio` directory:

```
public/
  audio/
    sample1.mp3
    sample2.mp3
    sample3.mp3
```

You can download royalty-free music from:
- [Free Music Archive](https://freemusicarchive.org/)
- [Incompetech](https://incompetech.com/music/royalty-free/)
- [Bensound](https://www.bensound.com/)

### 7. Seed the Database

Populate the database with demo data:

```bash
npm run db:seed
```

This will create:
- A demo user (email: `demo@example.com`, password: `demo1234`)
- 3 artists with albums and songs
- 3 sample playlists

### 8. Start the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 9. Log In

Use the demo credentials to log in:
- **Email**: demo@example.com
- **Password**: demo1234

## 📁 Project Structure

```
NextPorto/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main app layout group
│   │   ├── layout.tsx            # Layout with sidebar + player
│   │   ├── page.tsx              # Home page
│   │   ├── search/               # Search page
│   │   ├── library/              # Library page
│   │   └── playlist/[id]/        # Playlist detail page
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── playlists/            # Playlist CRUD
│   │   ├── songs/                # Song endpoints
│   │   └── artists/              # Artist endpoints
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles with CSS variables
├── components/
│   ├── player/                   # Player component
│   │   ├── Player.tsx
│   │   └── Player.module.css
│   ├── sidebar/                  # Sidebar component
│   │   ├── Sidebar.tsx
│   │   └── Sidebar.module.css
│   └── ui/                       # Radix UI wrappers
│       ├── Button.tsx
│       ├── Dialog.tsx
│       ├── Slider.tsx
│       ├── Switch.tsx
│       ├── DropdownMenu.tsx
│       └── ScrollArea.tsx
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── prisma.ts                 # Prisma client
│   └── theme-provider.tsx        # Theme context provider
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seed script
├── public/
│   └── audio/                    # Audio files
├── store/
│   └── player-store.ts           # Zustand player state
├── types/
│   ├── index.ts                  # Shared TypeScript types
│   └── next-auth.d.ts            # NextAuth type extensions
└── package.json
```

## 🎨 Architecture Overview

### Database Schema

The application uses the following main entities:

- **User** - User accounts with authentication
- **Artist** - Music artists
- **Album** - Albums by artists
- **Song** - Individual tracks
- **Playlist** - User-created playlists
- **PlaylistSong** - Many-to-many relationship with ordering
- **ListeningHistory** - Track play history
- **LikedSong** - User's liked songs

### State Management

**Player State** (Zustand):
- Current track and queue
- Playback controls (play, pause, next, previous)
- Volume and mute state
- Shuffle and repeat modes
- Current time and duration

**Theme State** (React Context):
- Light/dark mode toggle
- Persists to localStorage

### Styling System

The app uses a custom CSS variable system (no Tailwind):

**Light Mode Variables**:
```css
--background, --foreground
--card, --card-foreground
--primary, --primary-foreground
--secondary, --secondary-foreground
--muted, --muted-foreground
--accent, --accent-foreground
--border, --input, --ring
--sidebar, --sidebar-foreground
```

All components use these variables for consistent theming.

## 🔌 API Routes

### Playlists
- `GET /api/playlists` - Get all user playlists
- `POST /api/playlists` - Create a new playlist
- `GET /api/playlists/[id]` - Get playlist details
- `PATCH /api/playlists/[id]` - Update playlist
- `DELETE /api/playlists/[id]` - Delete playlist
- `POST /api/playlists/[id]/songs` - Add song to playlist
- `DELETE /api/playlists/[id]/songs?songId=...` - Remove song

### Songs
- `GET /api/songs?search=...&limit=...` - Search and list songs
- `GET /api/songs/[id]` - Get song details

### Artists
- `GET /api/artists` - List all artists

## 🎵 Key Components

### Player Component

The global audio player with full controls:
- HTML5 `<audio>` element
- Radix UI Slider for progress and volume
- Play/pause, next/previous buttons
- Shuffle and repeat controls
- Real-time progress tracking

**Location**: `components/player/Player.tsx`

### Sidebar Component

Navigation and playlist management:
- App navigation (Home, Search, Library)
- Scrollable playlist list
- Theme toggle switch
- Responsive design

**Location**: `components/sidebar/Sidebar.tsx`

### Radix UI Components

Accessible, unstyled primitives styled with CSS Modules:
- `Dialog` - Modal dialogs
- `Slider` - Audio controls
- `Switch` - Theme toggle
- `ScrollArea` - Scrollable lists
- `DropdownMenu` - Context menus

**Location**: `components/ui/`

## 🎯 Usage Examples

### Playing a Song

```typescript
import { usePlayerStore } from '@/store/player-store'

const { setTrack, play } = usePlayerStore()

// Play a single song
setTrack(song)
play()

// Play with a queue
setTrack(song, songsArray)
play()
```

### Managing Playlists

```typescript
// Create playlist
const response = await fetch('/api/playlists', {
  method: 'POST',
  body: JSON.stringify({
    name: 'My Playlist',
    description: 'Description',
  }),
})

// Add song to playlist
await fetch(`/api/playlists/${playlistId}/songs`, {
  method: 'POST',
  body: JSON.stringify({ songId }),
})
```

### Searching Songs

```typescript
const response = await fetch(`/api/songs?search=${query}`)
const songs = await response.json()
```

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Database
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database with demo data

# Build & Production
npm run build        # Build for production
npm run start        # Start production server

# Linting
npm run lint         # Run ESLint
```

## 🎨 Customization

### Changing Theme Colors

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --primary: oklch(0.488 0.243 264.376);
  --primary-foreground: oklch(0.97 0.014 254.604);
  /* ... more variables */
}
```

### Adding New Pages

Create pages in the `app/(main)` directory to include sidebar and player:

```typescript
// app/(main)/new-page/page.tsx
export default function NewPage() {
  return <div>New Page Content</div>
}
```

## 🔐 Authentication

The app uses NextAuth.js with credentials provider. To add OAuth providers:

1. Install provider package
2. Add to `lib/auth.ts`
3. Configure environment variables

Example for GitHub:

```typescript
import GitHubProvider from 'next-auth/providers/github'

providers: [
  GitHubProvider({
    clientId: process.env.GITHUB_ID,
    clientSecret: process.env.GITHUB_SECRET,
  }),
]
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Database Setup

For production, use a managed PostgreSQL service:
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Supabase](https://supabase.com/)
- [Railway](https://railway.app/)
- [Neon](https://neon.tech/)

Update `DATABASE_URL` in your production environment.

## 📝 Notes

- Audio files must be in MP3 format
- The seed script uses placeholder image URLs from picsum.photos
- For production, replace with actual album artwork
- Consider implementing file upload for user-generated content

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Design inspired by [Spotify](https://www.spotify.com/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Icons from [Heroicons](https://heroicons.com/)

## 📧 Support

If you have any questions or issues, please open an issue on GitHub.

---

**Happy Listening! 🎵**
