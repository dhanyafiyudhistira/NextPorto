import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import VideoPreview from './components/VideoPreview'
import DeviceSelector from './components/DeviceSelector'
import RecorderControls from './components/RecorderControls'
import Gallery from './components/Gallery'
import StatusPanels from './components/StatusPanels'
import useDevices from './hooks/useDevices'
import useRecorder from './hooks/useRecorder'

export default function App() {
  const devices = useDevices()
  const recorder = useRecorder(devices.selectedDeviceId)
  const [showGallery, setShowGallery] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        recorder.toggle()
      } else if (e.key.toLowerCase() === 's') {
        recorder.stop()
      } else if (e.key.toLowerCase() === 'm') {
        recorder.toggleMute()
      } else if (e.key.toLowerCase() === 'r') {
        devices.refresh()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [recorder, devices])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Header onToggleGallery={() => setShowGallery(!showGallery)} />
      <main className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
        <section className="lg:col-span-8 space-y-4">
          <VideoPreview recorder={recorder} devices={devices} />
          <RecorderControls recorder={recorder} devices={devices} />
        </section>
        <aside className="lg:col-span-4 space-y-4">
          <DeviceSelector devices={devices} />
          <StatusPanels recorder={recorder} devices={devices} />
          {showGallery && <Gallery />}
        </aside>
      </main>
    </div>
  )
}
