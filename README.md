# 📱 Battery SOC Monitor - React Native App

A professional React Native mobile application for real-time battery State of Charge (SOC) monitoring using LSTM neural network predictions. This app provides an intuitive mobile interface for monitoring battery parameters and viewing predictive analytics.

## 🎯 Features

- **Real-time Battery Monitoring**: Live voltage, current, and temperature readings
- **LSTM SOC Predictions**: AI-powered State of Charge predictions with buffer management
- **Interactive Charts**: Real-time line charts for SOC and battery parameters
- **Connection Management**: Automatic service health monitoring and reconnection
- **Activity Logging**: Comprehensive event logging with timestamps
- **Settings Management**: Configurable API endpoints and preferences
- **Analytics Dashboard**: Historical data analysis with statistics
- **Dark Theme UI**: Modern, battery-themed dark interface
- **Cross-Platform**: Runs on both iOS and Android devices

## 🏗️ Architecture

```
📱 React Native App  →  🟢 Node.js (Port 3000)  →  🔵 Flask LSTM (Port 5001)
├─ Real-time charts      ├─ Battery data generator    ├─ LSTM inference engine
├─ SOC display          ├─ Dataset distribution      ├─ Model predictions
├─ Connection status    ├─ Physics simulation        └─ Buffer management
└─ Activity logging     └─ API endpoints
```

## 📋 Prerequisites

Before running the app, ensure you have:

- **Node.js** (v18 or higher)
- **React Native development environment** set up:
  - For Android: Android Studio, Android SDK
  - For iOS: Xcode (macOS only), CocoaPods
- **Backend Services Running**:
  - Node.js battery data server (port 3000)
  - Flask LSTM prediction server (port 5001)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd NextPorto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure API Endpoints

Edit `src/utils/Constants.js` and update with your computer's IP address:

```javascript
export const API_CONFIG = {
  nodeJs: 'http://YOUR_IP_ADDRESS:3000',  // Replace with your IP
  flask: 'http://YOUR_IP_ADDRESS:5001',   // Replace with your IP
  dataSource: 'dataset',
  pollInterval: 1000,
};
```

**Important**: Use your computer's local network IP (e.g., `192.168.1.100`), not `localhost` or `127.0.0.1`!

### 4. Platform-Specific Setup

#### Android Setup

```bash
# No additional setup required
# Make sure you have Android Studio installed
```

#### iOS Setup (macOS only)

```bash
cd ios
pod install
cd ..
```

## 📱 Running the App

### Start Metro Bundler

```bash
npm start
```

### Run on Android

```bash
npm run android
```

Or open `android/` in Android Studio and run from there.

### Run on iOS (macOS only)

```bash
npm run ios
```

Or open `ios/BatterySOCMonitor.xcworkspace` in Xcode and run from there.

## 🔧 Backend Services

You need to run both backend services before using the app:

### 1. Start Node.js Battery Data Server

```bash
# In your Node.js server directory
node server.js
# Server should be running on http://YOUR_IP:3000
```

Endpoints:
- `GET /simple` - Dataset distribution (V=12.76V, I=19.99A)
- `GET /data` - Realistic battery physics (V=3.7V, I=-2A)
- `GET /health` - Service health check

### 2. Start Flask LSTM Prediction Server

```bash
# In your Flask server directory
python app.py
# Server should be running on http://YOUR_IP:5001
```

Endpoints:
- `GET /predict` - LSTM SOC prediction
- `GET /status` - Engine status & statistics
- `POST /data/poll/start` - Start auto-polling
- `GET /health` - Service health check

## 📊 App Structure

```
src/
├── components/              # Reusable UI components
│   ├── SOCDisplay.js       # Circular SOC indicator
│   ├── BatteryDataCard.js  # Real-time data cards
│   ├── ConnectionStatus.js # Service status indicators
│   ├── ActivityLog.js      # Event logging component
│   └── ChartComponents/    # Chart implementations
│       ├── SOCChart.js     # SOC history chart
│       └── BatteryParamsChart.js  # Battery parameters chart
├── screens/                # Main application screens
│   ├── DashboardScreen.js  # Main monitoring screen
│   ├── AnalyticsScreen.js  # Historical data & statistics
│   └── SettingsScreen.js   # Configuration screen
├── services/               # Business logic & API
│   ├── ApiService.js       # HTTP API calls
│   ├── ConnectionManager.js # Network monitoring
│   └── DataProcessor.js    # Data processing & validation
├── context/                # State management
│   ├── DataContext.js      # Global data state
│   └── SettingsContext.js  # App settings state
└── utils/                  # Utilities & constants
    ├── Constants.js        # App constants
    ├── Helpers.js          # Helper functions
    └── Styles.js           # Shared styles
```

## 🎨 Usage Guide

### Dashboard Screen

1. **Connection Status**: Check if services are connected
2. **SOC Display**: View current State of Charge with circular progress
3. **Battery Cards**: Monitor voltage, current, and temperature
4. **Control Panel**:
   - **Start Data**: Begin streaming battery data from Node.js
   - **Start SOC**: Begin SOC predictions from Flask
   - **Clear Data**: Reset all data and buffers
5. **Charts**: View real-time SOC and battery parameter trends
6. **Activity Log**: Monitor system events and errors

### Settings Screen

Configure the app:
- **API Endpoints**: Set Node.js and Flask server URLs
- **Data Source**: Choose between dataset or realistic physics
- **Performance**: Adjust polling interval and chart points
- **Notifications**: Enable/disable alerts (future feature)

### Analytics Screen

View statistics and trends:
- **Overview**: Total samples and predictions count
- **SOC Statistics**: Current, average, min/max SOC values
- **Battery Parameters**: Detailed voltage, current, temperature stats
- **Performance Metrics**: Prediction time and buffer status

## 🔍 Troubleshooting

### Connection Issues

**Problem**: Services showing as "Offline"

**Solutions**:
1. Verify backend servers are running:
   ```bash
   # Test Node.js
   curl http://YOUR_IP:3000/health

   # Test Flask
   curl http://YOUR_IP:5001/health
   ```

2. Check your IP address is correct in Settings
3. Ensure your phone and computer are on the same Wi-Fi network
4. Disable any firewalls blocking ports 3000 or 5001
5. For Android: Make sure `usesCleartextTraffic` is enabled in AndroidManifest.xml

### Data Not Updating

**Problem**: Charts not showing new data

**Solutions**:
1. Tap "Start Data" button on Dashboard
2. Check connection status shows green dots
3. Verify Activity Log for error messages
4. Try clearing data and restarting streaming

### Build Errors

**Problem**: App won't build or install

**Solutions**:
1. Clean and rebuild:
   ```bash
   # Android
   cd android && ./gradlew clean && cd ..

   # iOS
   cd ios && pod install && cd ..
   ```

2. Clear Metro cache:
   ```bash
   npm start -- --reset-cache
   ```

3. Delete node_modules and reinstall:
   ```bash
   rm -rf node_modules
   npm install
   ```

## 📝 Configuration

### API Endpoints

In-app configuration (Settings screen):
- Node.js Server URL
- Flask Server URL
- Data source selection
- Polling interval

Or edit `src/utils/Constants.js` directly.

### Performance Tuning

Adjust these settings for better performance:

```javascript
// In src/utils/Constants.js
export const API_CONFIG = {
  pollInterval: 1000,        // Increase for slower updates (battery saving)
  connectionCheckInterval: 5000,  // Service health check frequency
};

export const CHART_CONFIG = {
  MAX_DATA_POINTS: 50,       // Reduce for better chart performance
};
```

## 🎯 Features Roadmap

- [x] Real-time data streaming
- [x] LSTM SOC predictions
- [x] Interactive charts
- [x] Settings management
- [x] Activity logging
- [x] Analytics dashboard
- [ ] Push notifications for low SOC
- [ ] Data export (CSV/JSON)
- [ ] Offline mode with caching
- [ ] Multiple battery support
- [ ] Cloud sync
- [ ] Theme customization

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React Native for the mobile framework
- React Navigation for navigation
- React Native Chart Kit for charting
- LSTM neural network for SOC predictions

## 📧 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review the Activity Log in the app for error messages

## 🔗 Related Projects

- Node.js Battery Data Generator (Backend)
- Flask LSTM Prediction Engine (Backend)
- HTML Dashboard (Web Interface)

---

**Made with ⚡ for battery monitoring enthusiasts**
