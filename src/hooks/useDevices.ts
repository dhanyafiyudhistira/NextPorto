import { useEffect, useState } from 'react'

export interface DevicesState {
  videoInputs: MediaDeviceInfo[]
  selectedDeviceId?: string
  quality: string
  droidCamFound: boolean
  refresh: () => void
  selectDevice: (id: string) => void
  setQuality: (q: string) => void
}

const PREF_KEY = 'recorder-prefs-v1'

interface Prefs {
  deviceId?: string
  quality?: string
}

function loadPrefs(): Prefs {
  try {
    return JSON.parse(localStorage.getItem(PREF_KEY) || '{}')
  } catch {
    return {}
  }
}

function savePrefs(p: Prefs) {
  localStorage.setItem(PREF_KEY, JSON.stringify(p))
}

export default function useDevices(): DevicesState {
  const prefs = loadPrefs()
  const [videoInputs, setVideoInputs] = useState<MediaDeviceInfo[]>([])
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>(prefs.deviceId)
  const [quality, setQualityState] = useState<string>(prefs.quality || '1280x720@30')
  const [droidCamFound, setDroidCamFound] = useState(false)

  const refresh = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videos = devices.filter(d => d.kind === 'videoinput')
      setVideoInputs(videos)
      const droid = videos.find(d => /(droidcam|dev47apps)/i.test(d.label))
      setDroidCamFound(!!droid)
      if (!selectedDeviceId && droid) {
        setSelectedDeviceId(droid.deviceId)
        savePrefs({ deviceId: droid.deviceId, quality })
      }
    } catch (e) {
      console.error('enumerateDevices', e)
    }
  }

  useEffect(() => {
    refresh()
    navigator.mediaDevices.addEventListener('devicechange', refresh)
    return () => navigator.mediaDevices.removeEventListener('devicechange', refresh)
  }, [])

  const selectDevice = (id: string) => {
    setSelectedDeviceId(id)
    savePrefs({ deviceId: id, quality })
  }

  const setQuality = (q: string) => {
    setQualityState(q)
    savePrefs({ deviceId: selectedDeviceId, quality: q })
  }

  return { videoInputs, selectedDeviceId, quality, droidCamFound, refresh, selectDevice, setQuality }
}
