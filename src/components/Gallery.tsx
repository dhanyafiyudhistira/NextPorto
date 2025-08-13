import React, { useEffect, useState } from 'react'
import { getAll, remove, rename, RecordMeta } from '../db'
import { Download, Play, Trash2, Edit } from 'lucide-react'

export default function Gallery() {
  const [records, setRecords] = useState<RecordMeta[]>([])

  const load = async () => {
    const all = await getAll()
    setRecords(all)
  }
  useEffect(() => {
    load()
  }, [])

  return (
    <div className="bg-slate-900/60 border border-slate-700/30 rounded-2xl p-6 backdrop-blur-sm">
      <h2 className="font-semibold mb-4">Gallery</h2>
      <div className="grid grid-cols-1 gap-4">
        {records.map(r => (
          <div key={r.id} className="flex items-center justify-between bg-slate-800/40 p-2 rounded">
            <div className="flex-1">
              <div className="font-medium">{r.name}</div>
              <div className="text-xs text-slate-400">{(r.size / 1024 / 1024).toFixed(1)} MB · {r.duration}s</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  if (r.blob) {
                    const url = URL.createObjectURL(r.blob)
                    const video = document.createElement('video')
                    video.src = url
                    video.controls = true
                    const w = window.open('')
                    if (w) {
                      w.document.body.appendChild(video)
                      video.play()
                    }
                  }
                }}
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  if (!r.blob) return
                  const url = URL.createObjectURL(r.blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = r.name + '.webm'
                  a.click()
                  URL.revokeObjectURL(url)
                }}
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const name = prompt('Rename', r.name)
                  if (name) {
                    rename(r.id, name).then(load)
                  }
                }}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  remove(r.id).then(load)
                }}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
