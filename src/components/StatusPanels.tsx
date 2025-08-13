import React from 'react'
import { DevicesState } from '../hooks/useDevices'
import { RecorderState } from '../hooks/useRecorder'
import { Shield, Mic, Camera as CameraIcon } from 'lucide-react'

interface Props {
  recorder: RecorderState
  devices: DevicesState
}

export default function StatusPanels({ recorder, devices }: Props) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/30 rounded-2xl p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center gap-2">
        <CameraIcon className="w-4 h-4" />
        <span className="text-sm">{devices.videoInputs.length} video inputs</span>
      </div>
      <div className="flex items-center gap-2">
        <Mic className="w-4 h-4" />
        <span className="text-sm">Mic {recorder.mute ? 'Muted' : 'Live'}</span>
      </div>
      <div className="flex items-center gap-2">
        <Shield className="w-4 h-4" />
        <span className="text-sm">Local-only recording</span>
      </div>
    </div>
  )
}
