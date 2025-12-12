# Traffic SCADA UI

Modern single-page web application for urban traffic intersection monitoring with industrial monochromatic design.

## Features

- **Real-time Phase Monitoring**: Visual display of actual and predicted traffic signal phases
- **Gantt-style Timeline**: Horizontal phase strip showing predicted (dashed) vs actual (solid) phases
- **Live Metrics Dashboard**: Total flow, average speed, occupancy, and queue lengths
- **Interactive Charts**:
  - Flow timeseries line chart
  - Occupancy gauge (circular)
  - Queue length bar chart
  - Camera/map placeholder
- **Lane-level Detectors**: Detailed table view of individual lane metrics
- **Alarm System**: Automatic alerts for high occupancy and controller faults
- **Control Panel**:
  - Live/Playback mode toggle
  - Prediction lead time adjustment (1-15 seconds)
  - Update rate control (0.5-5 seconds)
  - Mock/Live API toggle
  - Snapshot export functionality
- **Industrial Design**: Monochromatic grayscale/steel palette with high contrast
- **Accessibility**: WCAG compliant, keyboard navigable, reduced motion support

## Architecture

```
NextPorto/
├── server.js                    # Backend API server (already exists)
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind theme configuration
├── index.html                  # HTML entry point
└── src/
    ├── main.jsx                # React entry point
    ├── App.jsx                 # Main application component
    ├── index.css               # Global styles
    ├── services/
    │   └── api.js              # API service with mock fallback
    └── components/
        ├── PhaseIndicator.jsx  # Current phase display
        ├── Timeline.jsx        # Gantt-style phase timeline
        ├── SummaryCards.jsx    # Top-level metrics cards
        ├── LaneTable.jsx       # Lane-level detector table
        ├── Charts.jsx          # All chart components
        └── Controls.jsx        # Control panel
```

## Prerequisites

- Node.js 18+ and npm
- Backend server running on port 4000 (provided in `server.js`)

## Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Install backend dependencies** (if not already installed):
   ```bash
   npm install express cors
   ```

## Running the Application

### Option 1: Full Stack (Recommended)

Run both frontend and backend simultaneously:

```bash
# Terminal 1: Start backend server
npm run server

# Terminal 2: Start frontend dev server
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:4000

### Option 2: Frontend Only (Mock Data)

If you want to run only the frontend with mock data:

```bash
npm run dev
```

Then toggle "MOCK DATA" mode in the Control Panel.

## Mock vs Real API

The application supports two data modes:

### Real API Mode (Default)
- Connects to backend server at `http://localhost:4000`
- Calls endpoints:
  - `GET /api/scada/traffic/sample?lead=5`
  - `GET /api/scada/traffic/timeseries?n=50&lead=5&interval=1`
- Automatically falls back to mock data if API is unavailable

### Mock Data Mode
- Generates synthetic data in the browser
- No backend server required
- Toggle via "MOCK DATA" button in Control Panel
- Useful for development, testing, and demos

## API Endpoints

The backend provides the following endpoints:

### Get Single Sample
```http
GET /api/scada/traffic/sample?lead=5

Query Parameters:
- lead: Lead seconds for prediction (default: 5)

Response: Single traffic sample object
```

### Get Timeseries
```http
GET /api/scada/traffic/timeseries?n=50&lead=5&interval=1

Query Parameters:
- n: Number of samples (default: 50)
- lead: Lead seconds for prediction (default: 5)
- interval: Seconds between samples (default: 1)

Response: Timeseries array with metadata
```

### Sample Payload Structure
```json
{
  "intersection_id": "INT_001",
  "timestamp_actual": "2025-12-12T02:34:56.789Z",
  "timestamp_predicted": "2025-12-12T02:34:51.789Z",
  "actual": {
    "phase_id": "NS_GREEN",
    "phase_duration_sec": 28.5,
    "started_at": "2025-12-12T02:34:30.000Z"
  },
  "predicted": {
    "phase_id": "NS_YELLOW",
    "expected_start": "2025-12-12T02:34:51.789Z",
    "lead_seconds": 5,
    "confidence": 0.82,
    "predicted_duration_sec": 4.1
  },
  "detectors": {
    "lanes": [
      {
        "id": "NS_LEFT",
        "flow": 3,
        "queue": 2,
        "avg_speed": 25.3
      }
    ],
    "total_flow": 25,
    "avg_speed": 28.7,
    "occupancy_percent": 72.4,
    "avg_queue": 3
  },
  "actuators": {
    "signal_controller_mode": "AUTO",
    "manual_override": false
  },
  "meta": {
    "camera_image": null,
    "notes": "sample data"
  }
}
```

## Configuration

### Prediction Lead Time
- Adjustable from 1-15 seconds via Control Panel
- Shows how far ahead the system predicts the next phase
- Lower values = more immediate predictions
- Higher values = longer-term forecasting

### Update Rate
- Adjustable from 0.5-5 seconds
- Controls how frequently data is fetched
- Lower values = more real-time updates (higher load)
- Higher values = less frequent updates (lower load)

### Occupancy Threshold
- Default: 85%
- Triggers alarm when exceeded
- Configurable in `App.jsx` (OCCUPANCY_THRESHOLD constant)

## Design System

### Color Palette (Monochromatic Steel)
- **Background**: `steel-900` (#1a1d20)
- **Cards/Borders**: `steel-800` (#212529) / `steel-600` (#495057)
- **Text Primary**: `steel-100` (#e9ecef)
- **Text Secondary**: `steel-400` (#adb5bd)
- **Alerts Amber**: `#fbbf24` (warnings)
- **Alerts Red**: `#ef4444` (critical)

### Typography
- **Font**: Monospace (Consolas, Monaco, Courier New)
- **Sizes**: Responsive, optimized for readability

### Accessibility
- High contrast ratios (WCAG AAA compliant)
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support
- Focus indicators on all interactive elements

## Build for Production

```bash
npm run build
```

The production build will be created in the `dist/` folder.

Preview production build:
```bash
npm run preview
```

## Troubleshooting

### Port Already in Use
If port 3000 or 4000 is already in use:

```bash
# Change frontend port in vite.config.js
# Change backend port in server.js (PORT variable)
```

### API Connection Failed
1. Verify backend server is running on port 4000
2. Check browser console for errors
3. Toggle "MOCK DATA" mode to test frontend independently

### CORS Errors
The Vite dev server includes a proxy configuration. If you encounter CORS issues:
1. Ensure backend is running on port 4000
2. Check `vite.config.js` proxy settings
3. Verify backend has CORS enabled (already configured in server.js)

## Performance Optimization

- Timeseries limited to last 50 samples to prevent memory bloat
- Timeline displays only last 30 items for rendering performance
- Charts use efficient rendering via Recharts library
- Automatic cleanup of intervals on component unmount
- Responsive design with minimal re-renders

## Future Enhancements

- WebSocket support for true real-time streaming (currently uses polling)
- Historical data playback with date/time range selector
- Advanced filtering and search in lane table
- Camera feed integration (placeholder currently shown)
- Map overlay with intersection geometry
- Predictive analytics dashboard
- Multi-intersection support
- User authentication and role-based access

## License

MIT

## Support

For issues or questions, please refer to the project repository.