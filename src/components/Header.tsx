import React, { useEffect, useState } from 'react'
import { Activity, Settings, Monitor } from 'lucide-react'

interface Props {
  onToggleGallery: () => void
}

export default function Header({ onToggleGallery }: Props) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <header className="bg-slate-900/80 border-b border-slate-700/50 backdrop-blur-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Monitor className="w-5 h-5" />
        <span className="font-semibold">DroidCam Recorder</span>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm font-mono">{time.toLocaleString('id-ID')}</span>
        <button
          onClick={onToggleGallery}
          className="px-3 py-1 rounded-full bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-sm"
        >
          <Activity className="inline w-4 h-4 mr-1" /> System Active
        </button>
        <Settings className="w-5 h-5" />
      </div>
    </header>
  )
}
