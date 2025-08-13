import React, { useEffect, useState } from 'react'
import { DevicesState } from '../hooks/useDevices'
import { RecorderState } from '../hooks/useRecorder'
import { Video, Wifi, Battery, Clock, Activity } from 'lucide-react'

interface Props {
  recorder: RecorderState
  devices: DevicesState
}

export default function VideoPreview({ recorder, devices }: Props) {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const settings = recorder.stream?.getVideoTracks()[0]?.getSettings()

  return (
    <div className="relative bg-black aspect-video rounded-2xl overflow-hidden border border-slate-700/30">
      <video ref={recorder.videoRef} autoPlay muted className="w-full h-full object-contain" />
      <div className="absolute top-2 left-2 flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs bg-slate-900/60 border ${/(droidcam|dev47apps)/i.test(devices.videoInputs.find(v=>v.deviceId===devices.selectedDeviceId)?.label || '') ? 'border-emerald-500 text-emerald-300' : 'border-slate-700/50'}`}>{devices.videoInputs.find(v=>v.deviceId===devices.selectedDeviceId)?.label || 'No Device'}</span>
        {/(droidcam|dev47apps)/i.test(devices.videoInputs.find(v=>v.deviceId===devices.selectedDeviceId)?.label || '') && (
          <span className="px-2 py-1 rounded-full text-xs bg-emerald-600/20 border border-emerald-500/50">DroidCam Active</span>
        )}
      </div>
      {recorder.recording && (
        <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-red-600/80 text-xs rounded-full animate-pulse">
          <span className="w-2 h-2 bg-red-300 rounded-full" /> REC
        </div>
      )}
      <div className="absolute bottom-2 left-2 right-2 grid grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-900/60 border border-slate-700/30 rounded-md px-2 py-1 flex items-center gap-1">
          <Video className="w-3 h-3" /> {settings?.width}×{settings?.height}
        </div>
        <div className="bg-slate-900/60 border border-slate-700/30 rounded-md px-2 py-1 flex items-center gap-1">
          <Activity className="w-3 h-3" /> {settings?.frameRate} fps
        </div>
        <div className="bg-slate-900/60 border border-slate-700/30 rounded-md px-2 py-1 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {recorder.timer}s
        </div>
        <div className="bg-slate-900/60 border border-slate-700/30 rounded-md px-2 py-1 flex items-center gap-1">
          <Wifi className="w-3 h-3" /> {time.toLocaleTimeString()}
        </div>
      </div>
    </div>
  )
}
