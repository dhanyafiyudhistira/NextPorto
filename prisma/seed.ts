import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create a demo user
  const password = await hash('demo1234', 12)
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password,
    },
  })
  console.log('✅ Created demo user')

  // Create artists
  const artists = await Promise.all([
    prisma.artist.upsert({
      where: { id: 'artist-1' },
      update: {},
      create: {
        id: 'artist-1',
        name: 'Luna Dreams',
        imageUrl: 'https://picsum.photos/seed/artist1/400/400',
        bio: 'Electronic music producer and DJ',
      },
    }),
    prisma.artist.upsert({
      where: { id: 'artist-2' },
      update: {},
      create: {
        id: 'artist-2',
        name: 'The Midnight Collective',
        imageUrl: 'https://picsum.photos/seed/artist2/400/400',
        bio: 'Indie rock band from Portland',
      },
    }),
    prisma.artist.upsert({
      where: { id: 'artist-3' },
      update: {},
      create: {
        id: 'artist-3',
        name: 'Aurora Waves',
        imageUrl: 'https://picsum.photos/seed/artist3/400/400',
        bio: 'Ambient and atmospheric soundscapes',
      },
    }),
  ])
  console.log('✅ Created artists')

  // Create albums
  const albums = await Promise.all([
    prisma.album.upsert({
      where: { id: 'album-1' },
      update: {},
      create: {
        id: 'album-1',
        title: 'Neon Nights',
        artistId: artists[0].id,
        coverUrl: 'https://picsum.photos/seed/album1/600/600',
        releaseDate: new Date('2023-06-15'),
      },
    }),
    prisma.album.upsert({
      where: { id: 'album-2' },
      update: {},
      create: {
        id: 'album-2',
        title: 'Echoes of Tomorrow',
        artistId: artists[1].id,
        coverUrl: 'https://picsum.photos/seed/album2/600/600',
        releaseDate: new Date('2023-09-20'),
      },
    }),
    prisma.album.upsert({
      where: { id: 'album-3' },
      update: {},
      create: {
        id: 'album-3',
        title: 'Celestial Journey',
        artistId: artists[2].id,
        coverUrl: 'https://picsum.photos/seed/album3/600/600',
        releaseDate: new Date('2024-01-10'),
      },
    }),
  ])
  console.log('✅ Created albums')

  // Create songs
  // Note: Using placeholder audio URLs - replace with actual audio files in production
  const songs = await Promise.all([
    // Luna Dreams songs
    prisma.song.upsert({
      where: { id: 'song-1' },
      update: {},
      create: {
        id: 'song-1',
        title: 'Digital Paradise',
        artistId: artists[0].id,
        albumId: albums[0].id,
        duration: 245,
        audioUrl: '/audio/sample1.mp3',
        coverUrl: 'https://picsum.photos/seed/album1/600/600',
        plays: 1250,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-2' },
      update: {},
      create: {
        id: 'song-2',
        title: 'Synthwave Dreams',
        artistId: artists[0].id,
        albumId: albums[0].id,
        duration: 198,
        audioUrl: '/audio/sample2.mp3',
        coverUrl: 'https://picsum.photos/seed/album1/600/600',
        plays: 890,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-3' },
      update: {},
      create: {
        id: 'song-3',
        title: 'Neon Lights',
        artistId: artists[0].id,
        albumId: albums[0].id,
        duration: 210,
        audioUrl: '/audio/sample3.mp3',
        coverUrl: 'https://picsum.photos/seed/album1/600/600',
        plays: 1520,
      },
    }),

    // The Midnight Collective songs
    prisma.song.upsert({
      where: { id: 'song-4' },
      update: {},
      create: {
        id: 'song-4',
        title: 'Fading Memories',
        artistId: artists[1].id,
        albumId: albums[1].id,
        duration: 267,
        audioUrl: '/audio/sample1.mp3',
        coverUrl: 'https://picsum.photos/seed/album2/600/600',
        plays: 2100,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-5' },
      update: {},
      create: {
        id: 'song-5',
        title: 'Midnight Rain',
        artistId: artists[1].id,
        albumId: albums[1].id,
        duration: 223,
        audioUrl: '/audio/sample2.mp3',
        coverUrl: 'https://picsum.photos/seed/album2/600/600',
        plays: 1780,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-6' },
      update: {},
      create: {
        id: 'song-6',
        title: 'Lost in the City',
        artistId: artists[1].id,
        albumId: albums[1].id,
        duration: 189,
        audioUrl: '/audio/sample3.mp3',
        coverUrl: 'https://picsum.photos/seed/album2/600/600',
        plays: 1340,
      },
    }),

    // Aurora Waves songs
    prisma.song.upsert({
      where: { id: 'song-7' },
      update: {},
      create: {
        id: 'song-7',
        title: 'Cosmic Drift',
        artistId: artists[2].id,
        albumId: albums[2].id,
        duration: 312,
        audioUrl: '/audio/sample1.mp3',
        coverUrl: 'https://picsum.photos/seed/album3/600/600',
        plays: 950,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-8' },
      update: {},
      create: {
        id: 'song-8',
        title: 'Stellar Winds',
        artistId: artists[2].id,
        albumId: albums[2].id,
        duration: 298,
        audioUrl: '/audio/sample2.mp3',
        coverUrl: 'https://picsum.photos/seed/album3/600/600',
        plays: 1120,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-9' },
      update: {},
      create: {
        id: 'song-9',
        title: 'Nebula Dreams',
        artistId: artists[2].id,
        albumId: albums[2].id,
        duration: 276,
        audioUrl: '/audio/sample3.mp3',
        coverUrl: 'https://picsum.photos/seed/album3/600/600',
        plays: 880,
      },
    }),

    // Additional singles
    prisma.song.upsert({
      where: { id: 'song-10' },
      update: {},
      create: {
        id: 'song-10',
        title: 'Summer Breeze',
        artistId: artists[0].id,
        duration: 201,
        audioUrl: '/audio/sample1.mp3',
        coverUrl: 'https://picsum.photos/seed/single1/600/600',
        plays: 2340,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-11' },
      update: {},
      create: {
        id: 'song-11',
        title: 'Urban Jungle',
        artistId: artists[1].id,
        duration: 234,
        audioUrl: '/audio/sample2.mp3',
        coverUrl: 'https://picsum.photos/seed/single2/600/600',
        plays: 1890,
      },
    }),
    prisma.song.upsert({
      where: { id: 'song-12' },
      update: {},
      create: {
        id: 'song-12',
        title: 'Aurora Borealis',
        artistId: artists[2].id,
        duration: 289,
        audioUrl: '/audio/sample3.mp3',
        coverUrl: 'https://picsum.photos/seed/single3/600/600',
        plays: 1560,
      },
    }),
  ])
  console.log('✅ Created songs')

  // Create playlists
  const playlist1 = await prisma.playlist.upsert({
    where: { id: 'playlist-1' },
    update: {},
    create: {
      id: 'playlist-1',
      name: 'Chill Vibes',
      description: 'Perfect for relaxing and unwinding',
      userId: user.id,
      coverUrl: 'https://picsum.photos/seed/playlist1/600/600',
      isPublic: true,
    },
  })

  const playlist2 = await prisma.playlist.upsert({
    where: { id: 'playlist-2' },
    update: {},
    create: {
      id: 'playlist-2',
      name: 'Workout Mix',
      description: 'High energy tracks to power your workout',
      userId: user.id,
      coverUrl: 'https://picsum.photos/seed/playlist2/600/600',
      isPublic: true,
    },
  })

  const playlist3 = await prisma.playlist.upsert({
    where: { id: 'playlist-3' },
    update: {},
    create: {
      id: 'playlist-3',
      name: 'Focus Flow',
      description: 'Ambient sounds for deep concentration',
      userId: user.id,
      coverUrl: 'https://picsum.photos/seed/playlist3/600/600',
      isPublic: true,
    },
  })
  console.log('✅ Created playlists')

  // Add songs to playlists
  await Promise.all([
    // Chill Vibes playlist
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist1.id,
          songId: songs[6].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist1.id,
        songId: songs[6].id,
        order: 0,
      },
    }),
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist1.id,
          songId: songs[7].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist1.id,
        songId: songs[7].id,
        order: 1,
      },
    }),
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist1.id,
          songId: songs[8].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist1.id,
        songId: songs[8].id,
        order: 2,
      },
    }),

    // Workout Mix playlist
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist2.id,
          songId: songs[0].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist2.id,
        songId: songs[0].id,
        order: 0,
      },
    }),
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist2.id,
          songId: songs[2].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist2.id,
        songId: songs[2].id,
        order: 1,
      },
    }),
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist2.id,
          songId: songs[9].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist2.id,
        songId: songs[9].id,
        order: 2,
      },
    }),

    // Focus Flow playlist
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist3.id,
          songId: songs[4].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist3.id,
        songId: songs[4].id,
        order: 0,
      },
    }),
    prisma.playlistSong.upsert({
      where: {
        playlistId_songId: {
          playlistId: playlist3.id,
          songId: songs[11].id,
        },
      },
      update: {},
      create: {
        playlistId: playlist3.id,
        songId: songs[11].id,
        order: 1,
      },
    }),
  ])
  console.log('✅ Added songs to playlists')

  console.log('🎉 Database seeded successfully!')
  console.log('\n📝 Demo credentials:')
  console.log('   Email: demo@example.com')
  console.log('   Password: demo1234')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
