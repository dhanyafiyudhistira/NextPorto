import React from 'react'
import { RecorderState } from '../hooks/useRecorder'
import { DevicesState } from '../hooks/useDevices'
import { Circle, Square, Pause, Play, Mic, MicOff, Camera } from 'lucide-react'

interface Props {
  recorder: RecorderState
  devices: DevicesState
}

export default function RecorderControls({ recorder }: Props) {
  return (
    <div className="bg-slate-900/60 border border-slate-700/30 rounded-2xl p-6 backdrop-blur-sm flex flex-wrap gap-4 justify-center">
      {!recorder.recording ? (
        <button
          onClick={recorder.start}
          className="px-4 py-2 rounded bg-emerald-600/40 border border-emerald-500/50 hover:bg-emerald-600/60 flex items-center gap-2"
        >
          <Circle className="w-5 h-5" /> Start
        </button>
      ) : (
        <>
          {!recorder.paused ? (
            <button
              onClick={recorder.pause}
              className="px-4 py-2 rounded bg-amber-600/40 border border-amber-500/50 flex items-center gap-2"
            >
              <Pause className="w-5 h-5" /> Pause
            </button>
          ) : (
            <button
              onClick={recorder.resume}
              className="px-4 py-2 rounded bg-emerald-600/40 border border-emerald-500/50 flex items-center gap-2"
            >
              <Play className="w-5 h-5" /> Resume
            </button>
          )}
          <button
            onClick={recorder.stop}
            className="px-4 py-2 rounded bg-red-600/40 border border-red-500/50 flex items-center gap-2"
          >
            <Square className="w-5 h-5" /> Stop
          </button>
        </>
      )}
      <button
        onClick={recorder.toggleMute}
        className="px-4 py-2 rounded bg-slate-800/40 border border-slate-700/50 flex items-center gap-2"
      >
        {recorder.mute ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        {recorder.mute ? 'Unmute' : 'Mute'}
      </button>
      <button
        onClick={() => {
          const snap = recorder.takeSnapshot()
          if (snap) {
            const a = document.createElement('a')
            a.href = snap
            a.download = 'snapshot.png'
            a.click()
          }
        }}
        className="px-4 py-2 rounded bg-slate-800/40 border border-slate-700/50 flex items-center gap-2"
      >
        <Camera className="w-5 h-5" /> Snapshot
      </button>
    </div>
  )
}
