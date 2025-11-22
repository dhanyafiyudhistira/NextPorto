"use client"

import Image from "next/image"
import Link from "next/link"
import { Play } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AlbumCardProps {
  id: string
  title: string
  subtitle: string
  coverUrl?: string | null
  href: string
  onPlay?: () => void
}

export function AlbumCard({
  id,
  title,
  subtitle,
  coverUrl,
  href,
  onPlay,
}: AlbumCardProps) {
  return (
    <Link href={href}>
      <Card className="group relative overflow-hidden border-0 bg-card/50 hover:bg-card transition-all duration-200 cursor-pointer">
        <div className="p-4">
          {/* Cover Image */}
          <div className="relative aspect-square mb-4 overflow-hidden rounded-md bg-muted">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-primary/5">
                <span className="text-4xl font-bold text-muted-foreground/50">
                  {title.charAt(0)}
                </span>
              </div>
            )}

            {/* Play Button Overlay */}
            {onPlay && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  size="icon"
                  className="h-12 w-12 rounded-full bg-primary hover:bg-primary/90 hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.preventDefault()
                    onPlay()
                  }}
                >
                  <Play className="h-5 w-5 ml-0.5" />
                </Button>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-1">
            <h3 className="font-semibold truncate text-sm">{title}</h3>
            <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
          </div>
        </div>
      </Card>
    </Link>
  )
}
