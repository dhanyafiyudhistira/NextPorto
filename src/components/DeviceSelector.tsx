import React from 'react'
import { Camera, RefreshCcw } from 'lucide-react'
import { DevicesState } from '../hooks/useDevices'

interface Props {
  devices: DevicesState
}

export default function DeviceSelector({ devices }: Props) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/30 rounded-2xl p-6 backdrop-blur-sm space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold flex items-center gap-2"><Camera className="w-5 h-5" /> Video Source</h2>
        <button
          onClick={devices.refresh}
          className="flex items-center gap-1 text-sm px-2 py-1 rounded bg-slate-800/60 border border-slate-700/50"
        >
          <RefreshCcw className="w-4 h-4" /> Refresh
        </button>
      </div>
      <select
        className="w-full bg-slate-800/60 border border-slate-700/50 rounded p-2"
        value={devices.selectedDeviceId ?? ''}
        onChange={e => devices.selectDevice(e.target.value)}
      >
        {devices.videoInputs.map(d => (
          <option key={d.deviceId} value={d.deviceId}>
            {d.label || d.deviceId}
          </option>
        ))}
      </select>
      <div>
        <label className="block text-sm mb-1">Quality</label>
        <select
          className="w-full bg-slate-800/60 border border-slate-700/50 rounded p-2"
          value={devices.quality}
          onChange={e => devices.setQuality(e.target.value)}
        >
          <option value="1280x720@30">1280×720 @30fps</option>
          <option value="1920x1080@30">1920×1080 @30fps</option>
        </select>
      </div>
      {!devices.droidCamFound && (
        <div className="mt-4 text-sm text-amber-300">
          Start DroidCam Client, ensure phone app is connected, then click 'Refresh'
        </div>
      )}
    </div>
  )
}
