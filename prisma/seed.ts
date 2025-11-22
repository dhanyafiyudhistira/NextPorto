import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clean existing data
  console.log('🧹 Cleaning existing data...')
  await prisma.listeningHistory.deleteMany()
  await prisma.likedSong.deleteMany()
  await prisma.playlistSong.deleteMany()
  await prisma.playlist.deleteMany()
  await prisma.song.deleteMany()
  await prisma.album.deleteMany()
  await prisma.artist.deleteMany()
  await prisma.user.deleteMany()

  // Create demo user
  console.log('👤 Creating demo user...')
  const hashedPassword = await bcrypt.hash('password123', 10)
  const user = await prisma.user.create({
    data: {
      email: 'demo@example.com',
      password: hashedPassword,
      name: 'Demo User',
    },
  })

  // Create artists
  console.log('🎤 Creating artists...')
  const artists = await Promise.all([
    prisma.artist.create({
      data: {
        name: 'The Midnight Collective',
        imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Luna Eclipse',
        imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Neon Waves',
        imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400',
      },
    }),
    prisma.artist.create({
      data: {
        name: 'Stellar Dreams',
        imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400',
      },
    }),
  ])

  // Create albums
  console.log('💿 Creating albums...')
  const albums = await Promise.all([
    prisma.album.create({
      data: {
        title: 'Midnight Stories',
        artistId: artists[0].id,
        coverUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400',
        releaseDate: new Date('2023-06-15'),
      },
    }),
    prisma.album.create({
      data: {
        title: 'Eclipse',
        artistId: artists[1].id,
        coverUrl: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400',
        releaseDate: new Date('2023-08-20'),
      },
    }),
    prisma.album.create({
      data: {
        title: 'Neon Nights',
        artistId: artists[2].id,
        coverUrl: 'https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400',
        releaseDate: new Date('2023-09-10'),
      },
    }),
    prisma.album.create({
      data: {
        title: 'Cosmic Journey',
        artistId: artists[3].id,
        coverUrl: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=400',
        releaseDate: new Date('2023-10-05'),
      },
    }),
  ])

  // Create songs with royalty-free audio URLs
  console.log('🎵 Creating songs...')
  const songs = await Promise.all([
    // Album 1 - Midnight Stories
    prisma.song.create({
      data: {
        title: 'Moonlight Serenade',
        duration: 245,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        coverUrl: albums[0].coverUrl,
        artistId: artists[0].id,
        albumId: albums[0].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'Starlight Dreams',
        duration: 198,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        coverUrl: albums[0].coverUrl,
        artistId: artists[0].id,
        albumId: albums[0].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'Midnight Dance',
        duration: 220,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        coverUrl: albums[0].coverUrl,
        artistId: artists[0].id,
        albumId: albums[0].id,
      },
    }),
    // Album 2 - Eclipse
    prisma.song.create({
      data: {
        title: 'Solar Flare',
        duration: 267,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
        coverUrl: albums[1].coverUrl,
        artistId: artists[1].id,
        albumId: albums[1].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'Lunar Phase',
        duration: 189,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
        coverUrl: albums[1].coverUrl,
        artistId: artists[1].id,
        albumId: albums[1].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'Eclipse Tonight',
        duration: 234,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
        coverUrl: albums[1].coverUrl,
        artistId: artists[1].id,
        albumId: albums[1].id,
      },
    }),
    // Album 3 - Neon Nights
    prisma.song.create({
      data: {
        title: 'Electric Dreams',
        duration: 212,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
        coverUrl: albums[2].coverUrl,
        artistId: artists[2].id,
        albumId: albums[2].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'Neon Lights',
        duration: 256,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
        coverUrl: albums[2].coverUrl,
        artistId: artists[2].id,
        albumId: albums[2].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'City Pulse',
        duration: 203,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
        coverUrl: albums[2].coverUrl,
        artistId: artists[2].id,
        albumId: albums[2].id,
      },
    }),
    // Album 4 - Cosmic Journey
    prisma.song.create({
      data: {
        title: 'Galaxy Drift',
        duration: 289,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
        coverUrl: albums[3].coverUrl,
        artistId: artists[3].id,
        albumId: albums[3].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'Cosmic Waves',
        duration: 241,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
        coverUrl: albums[3].coverUrl,
        artistId: artists[3].id,
        albumId: albums[3].id,
      },
    }),
    prisma.song.create({
      data: {
        title: 'Stellar Wind',
        duration: 276,
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
        coverUrl: albums[3].coverUrl,
        artistId: artists[3].id,
        albumId: albums[3].id,
      },
    }),
  ])

  // Create playlists
  console.log('📝 Creating playlists...')
  const playlists = await Promise.all([
    prisma.playlist.create({
      data: {
        name: 'My Favorites',
        description: 'A collection of my all-time favorite tracks',
        coverUrl: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400',
        userId: user.id,
        isPublic: true,
      },
    }),
    prisma.playlist.create({
      data: {
        name: 'Chill Vibes',
        description: 'Perfect for relaxing and unwinding',
        coverUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
        userId: user.id,
        isPublic: true,
      },
    }),
    prisma.playlist.create({
      data: {
        name: 'Workout Mix',
        description: 'High-energy tracks to power through your workout',
        coverUrl: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=400',
        userId: user.id,
        isPublic: true,
      },
    }),
  ])

  // Add songs to playlists
  console.log('🔗 Adding songs to playlists...')
  await Promise.all([
    // My Favorites
    prisma.playlistSong.create({
      data: { playlistId: playlists[0].id, songId: songs[0].id, order: 0 },
    }),
    prisma.playlistSong.create({
      data: { playlistId: playlists[0].id, songId: songs[3].id, order: 1 },
    }),
    prisma.playlistSong.create({
      data: { playlistId: playlists[0].id, songId: songs[6].id, order: 2 },
    }),
    prisma.playlistSong.create({
      data: { playlistId: playlists[0].id, songId: songs[9].id, order: 3 },
    }),
    // Chill Vibes
    prisma.playlistSong.create({
      data: { playlistId: playlists[1].id, songId: songs[1].id, order: 0 },
    }),
    prisma.playlistSong.create({
      data: { playlistId: playlists[1].id, songId: songs[4].id, order: 1 },
    }),
    prisma.playlistSong.create({
      data: { playlistId: playlists[1].id, songId: songs[10].id, order: 2 },
    }),
    // Workout Mix
    prisma.playlistSong.create({
      data: { playlistId: playlists[2].id, songId: songs[2].id, order: 0 },
    }),
    prisma.playlistSong.create({
      data: { playlistId: playlists[2].id, songId: songs[7].id, order: 1 },
    }),
    prisma.playlistSong.create({
      data: { playlistId: playlists[2].id, songId: songs[11].id, order: 2 },
    }),
  ])

  // Add some liked songs
  console.log('❤️ Adding liked songs...')
  await Promise.all([
    prisma.likedSong.create({
      data: { userId: user.id, songId: songs[0].id },
    }),
    prisma.likedSong.create({
      data: { userId: user.id, songId: songs[3].id },
    }),
    prisma.likedSong.create({
      data: { userId: user.id, songId: songs[6].id },
    }),
  ])

  console.log('✅ Seed completed successfully!')
  console.log(`
📊 Summary:
- Users: 1
- Artists: ${artists.length}
- Albums: ${albums.length}
- Songs: ${songs.length}
- Playlists: ${playlists.length}

🔐 Demo credentials:
- Email: demo@example.com
- Password: password123
  `)
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
