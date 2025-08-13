import { useEffect, useRef, useState } from 'react'
import { save, RecordMeta } from '../db'

function parseQuality(q: string) {
  const [res, fps] = q.split('@')
  const [width, height] = res.split('x').map(Number)
  return { width, height, frameRate: Number(fps) }
}

export interface RecorderState {
  videoRef: React.RefObject<HTMLVideoElement>
  recording: boolean
  paused: boolean
  mute: boolean
  timer: number
  stream?: MediaStream
  start: () => Promise<void>
  stop: () => void
  pause: () => void
  resume: () => void
  toggle: () => void
  toggleMute: () => void
  takeSnapshot: () => string | undefined
}

export default function useRecorder(deviceId?: string, quality = '1280x720@30'): RecorderState {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream>()
  const [recorder, setRecorder] = useState<MediaRecorder | null>(null)
  const [chunks, setChunks] = useState<Blob[]>([])
  const [recording, setRecording] = useState(false)
  const [paused, setPaused] = useState(false)
  const [mute, setMute] = useState(false)
  const [timer, setTimer] = useState(0)
  const [mimeType, setMimeType] = useState('video/webm;codecs=vp9,opus')

  // preview stream when device changes
  useEffect(() => {
    const getStream = async () => {
      if (!deviceId) return
      try {
        const { width, height, frameRate } = parseQuality(quality)
        const s = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: deviceId }, width, height, frameRate },
          audio: true,
        })
        setStream(s)
        if (videoRef.current) {
          videoRef.current.srcObject = s
        }
      } catch (e) {
        console.error('getUserMedia', e)
      }
    }
    getStream()
    return () => {
      stream?.getTracks().forEach(t => t.stop())
    }
  }, [deviceId, quality])

  useEffect(() => {
    if (!recording) return
    const id = setInterval(() => setTimer(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [recording])

  const start = async () => {
    if (!stream) return
    const mt = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : 'video/webm;codecs=vp8,opus'
    setMimeType(mt)
    const rec = new MediaRecorder(stream, { mimeType: mt })
    setChunks([])
    rec.ondataavailable = e => {
      if (e.data.size > 0) setChunks(c => [...c, e.data])
    }
    rec.onstop = async () => {
      const blob = new Blob(chunks, { type: mt })
      const url = URL.createObjectURL(blob)
      const meta: RecordMeta = {
        id: crypto.randomUUID(),
        name: `record-${new Date().toISOString()}`,
        size: blob.size,
        duration: timer,
        createdAt: Date.now(),
        mimeType: mt,
        thumbnail: undefined,
        blob,
      }
      await save(meta)
      URL.revokeObjectURL(url)
    }
    rec.start()
    setRecorder(rec)
    setRecording(true)
    setTimer(0)
  }

  const stop = () => {
    recorder?.stop()
    setRecording(false)
    setPaused(false)
  }

  const pause = () => {
    recorder?.pause()
    setPaused(true)
  }
  const resume = () => {
    recorder?.resume()
    setPaused(false)
  }
  const toggle = () => {
    if (!recording) start()
    else if (paused) resume()
    else pause()
  }

  const toggleMute = () => {
    if (!stream) return
    const enabled = stream.getAudioTracks().some(t => t.enabled)
    stream.getAudioTracks().forEach(t => (t.enabled = !enabled))
    setMute(enabled)
  }

  const takeSnapshot = () => {
    if (!stream) return
    const video = videoRef.current
    if (!video) return
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/png')
  }

  return {
    videoRef,
    recording,
    paused,
    mute,
    timer,
    stream,
    start,
    stop,
    pause,
    resume,
    toggle,
    toggleMute,
    takeSnapshot,
  }
}
