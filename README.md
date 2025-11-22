# Spotify Music Player Clone

A modern, full-featured music player web application built with Next.js 14, PostgreSQL, Prisma, and shadcn/ui. This Spotify-inspired application provides a complete music streaming experience with playlists, search, library management, and a fully functional audio player.

![Music Player](https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200&h=400&fit=crop)

## Features

### Core Functionality
- **🎵 Full-Featured Audio Player**
  - Play/Pause, Next/Previous track controls
  - Volume control with mute toggle
  - Seek/progress bar with time display
  - Shuffle and Repeat modes (off/all/one)
  - Persistent playback queue

- **📝 Playlist Management**
  - Create, edit, and delete playlists
  - Add/remove songs from playlists
  - Reorder songs within playlists
  - Public/private playlist settings

- **🔍 Search**
  - Search songs, artists, and albums
  - Real-time search results
  - Debounced search queries

- **📚 Library**
  - Personal playlist collection
  - Liked songs management
  - Recently played tracks

- **🎨 Modern UI/UX**
  - Spotify-inspired design
  - Light/Dark mode toggle
  - Responsive layout (mobile-friendly)
  - Custom oklch color theme
  - Smooth animations and transitions

### Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **PostgreSQL** database
- **Prisma ORM** for database management
- **NextAuth.js** for authentication
- **Zustand** for state management
- **shadcn/ui** components with Tailwind CSS
- **Server-side rendering** and API routes

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages      │  │  Components  │  │    Store     │  │
│  │ - Home       │  │ - Player     │  │ - Zustand    │  │
│  │ - Search     │  │ - Sidebar    │  │              │  │
│  │ - Library    │  │ - AlbumCard  │  │              │  │
│  │ - Playlist   │  │ - SongRow    │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                  │
│  /api/playlists  │  /api/songs  │  /api/liked-songs    │
│  /api/albums     │  /api/auth   │                       │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│               Database (PostgreSQL + Prisma)             │
│  User │ Artist │ Album │ Song │ Playlist │ PlaylistSong │
└─────────────────────────────────────────────────────────┘
```

## Project Structure

```
NextPorto/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── playlists/       # Playlist CRUD
│   │   ├── songs/           # Songs endpoints
│   │   ├── liked-songs/     # Liked songs
│   │   └── albums/          # Albums endpoints
│   ├── playlist/[id]/       # Playlist detail page
│   ├── search/              # Search page
│   ├── library/             # Library page
│   ├── layout.tsx           # Root layout with sidebar & player
│   ├── page.tsx             # Home page
│   └── globals.css          # Global styles with theme
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── slider.tsx
│   │   └── ...
│   ├── player.tsx           # Audio player component
│   ├── sidebar.tsx          # Navigation sidebar
│   ├── album-card.tsx       # Album/Playlist card
│   ├── song-row.tsx         # Song list item
│   ├── playlist-actions.tsx # Playlist controls
│   ├── theme-provider.tsx   # Theme context
│   └── theme-toggle.tsx     # Light/Dark toggle
├── lib/                     # Utilities & config
│   ├── prisma.ts            # Prisma client
│   ├── player-store.ts      # Zustand store
│   ├── auth.ts              # NextAuth config
│   └── utils.ts             # Helper functions
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Seed data script
├── types/
│   └── next-auth.d.ts       # NextAuth type definitions
├── .env                     # Environment variables
├── package.json             # Dependencies
└── tailwind.config.ts       # Tailwind configuration
```

## Database Schema

### Core Models

**User**
- id, name, email, password
- Relations: playlists, listeningHistory, likedSongs

**Artist**
- id, name, imageUrl
- Relations: albums, songs

**Album**
- id, title, coverUrl, releaseDate, artistId
- Relations: artist, songs

**Song**
- id, title, duration, audioUrl, coverUrl, artistId, albumId
- Relations: artist, album, playlistSongs, likedBy

**Playlist**
- id, name, description, coverUrl, isPublic, userId
- Relations: user, songs (via PlaylistSong)

**PlaylistSong** (Junction Table)
- id, playlistId, songId, order
- Manages song order in playlists

**LikedSong**
- id, userId, songId, likedAt

**ListeningHistory**
- id, userId, songId, playedAt

## Installation & Setup

### Prerequisites

- **Node.js** 18+ installed
- **PostgreSQL** database running
- **npm** or **pnpm** package manager

### Step 1: Install Dependencies

```bash
npm install
# or
pnpm install
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/music_app"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

To generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### Step 3: Set Up the Database

#### Initialize Prisma

```bash
npx prisma generate
```

#### Run Migrations

```bash
npx prisma migrate dev --name init
```

This creates all the necessary tables in your PostgreSQL database.

#### Seed the Database

```bash
npm run db:seed
```

This populates your database with:
- 1 demo user
- 4 artists
- 4 albums
- 12 songs
- 3 playlists with songs

**Demo User Credentials:**
- Email: `demo@example.com`
- Password: `password123`

### Step 4: Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push schema changes to DB
npm run db:migrate   # Run database migrations
npm run db:seed      # Seed the database
npm run db:studio    # Open Prisma Studio (DB GUI)
```

## Theme Configuration

The application uses a custom oklch-based color theme defined in `app/globals.css`. The theme supports both light and dark modes with the following color tokens:

- `--background` / `--foreground`
- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive`
- `--border` / `--input` / `--ring`
- `--sidebar-*` (sidebar-specific colors)

Toggle between light and dark mode using the theme toggle in the sidebar.

## State Management

### Zustand Player Store

The global audio player state is managed using Zustand in `lib/player-store.ts`:

```typescript
interface PlayerStore {
  currentSong: Song | null
  queue: Song[]
  isPlaying: boolean
  volume: number
  shuffle: boolean
  repeat: 'off' | 'all' | 'one'
  // ... actions
}
```

### Key Actions

- `setQueue(songs, startIndex)` - Set play queue
- `playPause()` - Toggle playback
- `next()` / `previous()` - Navigate tracks
- `toggleShuffle()` / `toggleRepeat()` - Toggle modes
- `setVolume(volume)` - Adjust volume

## API Endpoints

### Playlists

- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/[id]` - Get playlist details
- `PATCH /api/playlists/[id]` - Update playlist
- `DELETE /api/playlists/[id]` - Delete playlist
- `POST /api/playlists/[id]/songs` - Add song to playlist
- `DELETE /api/playlists/[id]/songs?songId=X` - Remove song

### Songs

- `GET /api/songs?search=query` - Search songs
- `GET /api/liked-songs` - Get liked songs
- `POST /api/liked-songs` - Like a song
- `DELETE /api/liked-songs?songId=X` - Unlike a song

### Albums

- `GET /api/albums` - Get all albums

### Authentication

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/session` - Get session

## Component Highlights

### Player Component (`components/player.tsx`)

The sticky bottom player bar featuring:
- HTML5 Audio element integration
- Real-time progress tracking
- Volume control with mute
- Play queue management
- Repeat and shuffle modes

### Sidebar Component (`components/sidebar.tsx`)

Left navigation with:
- Logo and branding
- Main navigation links
- User playlists list
- Theme toggle

### Song Row (`components/song-row.tsx`)

Reusable song list item with:
- Album artwork
- Song metadata
- Play button on hover
- Duration display

## Adding Custom Songs

### Option 1: Manual Database Entry

Use Prisma Studio:
```bash
npm run db:studio
```

Navigate to the `Song` model and add entries.

### Option 2: Update Seed Script

Edit `prisma/seed.ts` to add your songs, then run:
```bash
npm run db:seed
```

### Audio File Requirements

Songs require an `audioUrl` field pointing to:
- **Local files**: Place in `public/audio/` folder
- **Remote URLs**: Use publicly accessible audio URLs (royalty-free)

## Deployment

### Build for Production

```bash
npm run build
npm run start
```

### Environment Variables for Production

Ensure these are set:
- `DATABASE_URL` - Production PostgreSQL connection string
- `NEXTAUTH_SECRET` - Strong random secret
- `NEXTAUTH_URL` - Your production domain

### Recommended Platforms

- **Vercel** (optimized for Next.js)
- **Railway** / **Render** (with PostgreSQL addon)
- **AWS** / **Google Cloud** / **Azure**

## Troubleshooting

### Database Connection Issues

```bash
# Test Prisma connection
npx prisma db pull

# Reset database
npx prisma migrate reset
```

### Audio Playback Issues

- Ensure `audioUrl` is accessible
- Check browser console for CORS errors
- Verify audio file format (MP3 recommended)

### Theme Not Applying

- Check `ThemeProvider` wraps app in `layout.tsx`
- Verify CSS variables in `globals.css`
- Clear browser cache

## Future Enhancements

- [ ] User authentication (register/login)
- [ ] Upload custom songs
- [ ] Social features (follow users, share playlists)
- [ ] Queue management page
- [ ] Lyrics display
- [ ] Audio visualizer
- [ ] Mobile app (React Native)
- [ ] Collaborative playlists
- [ ] Music recommendations
- [ ] Integration with Spotify/YouTube APIs

## License

MIT License - Feel free to use this project for learning or commercial purposes.

## Credits

- **UI Framework**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Sample Audio**: [SoundHelix](https://www.soundhelix.com/)
- **Images**: [Unsplash](https://unsplash.com/)

---

**Enjoy building your music player!** 🎵

For questions or issues, please open an issue on GitHub.
