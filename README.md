# DroidCam Recorder

A Vite + React + TypeScript demo app for recording video from the DroidCam virtual webcam.

## Setup

1. Install [DroidCam Client](https://www.dev47apps.com/) on desktop and connect your phone app.
2. Ensure this project is served over **HTTPS** or `localhost` to access camera/microphone.
3. Install dependencies:

```bash
npm install
```

4. Run the development server:

```bash
npm run dev
```

The app will enumerate video inputs and auto-select **DroidCam** when available.

## Features

- Live preview and recording via `MediaRecorder`
- Auto detection of DroidCam virtual camera
- Device selector with refresh and quality presets
- Save recordings to IndexedDB for offline playback
- Gallery to play/download/rename/delete recordings
- Keyboard shortcuts: `Space` start/pause/resume, `S` stop, `M` mute, `R` refresh devices

## Notes

All recording happens locally and never leaves your machine.
