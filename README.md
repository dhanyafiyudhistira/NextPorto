# DER SCADA System with Active Power Curtailment (APC)

A comprehensive web-based SCADA (Supervisory Control and Data Acquisition) system for Distributed Energy Resources (DER) with AI-powered Active Power Curtailment capabilities.

## 🌟 Features

### Core Capabilities
- **Real-time Monitoring**: Live telemetry from sensors, RTUs, PLCs, and field devices
- **DER Management**: Control and monitor PV, Wind, BESS, and other distributed energy resources
- **AI Optimization**: Advanced algorithms (LP, DP, GA, DRL, MIP) for optimal power curtailment
- **Command Execution**: Secure command translation and execution to field devices
- **Historian**: Time-series data storage with TimescaleDB
- **Alarm Management**: Comprehensive alarm handling with acknowledgment and audit trail
- **Protocol Support**: Modbus TCP, MQTT, OPC UA, IEC 61850
- **One-Line Diagram**: Interactive SVG-based system architecture visualization
- **Role-Based Access**: Support for Operator, Engineer, and Administrator roles

### Technical Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL + TimescaleDB extension
- **Real-time**: WebSocket server for live data streaming
- **Charts**: Recharts for data visualization
- **Styling**: Neon-blue cyber-themed industrial UI

## 📋 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Sensors & Field Devices                                    │
│  (CT/VT, Power Meters, PMU, 4-20mA, Modbus, IEC 61850)     │
└───────────────────┬─────────────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────────────┐
│  RTU / PLC / Edge Gateway                                   │
│  (Modbus TCP, MQTT, OPC UA, IEC 61850)                     │
└───────────────────┬─────────────────────────────────────────┘
                    │ VPN/Firewall
┌───────────────────▼─────────────────────────────────────────┐
│  SCADA Server (HMI, Alarms, Commands, Audit)               │
└─────┬──────────────┬──────────────┬────────────────────────┘
      │              │              │
  ┌───▼───┐     ┌───▼────┐    ┌───▼──────┐
  │Historian│   │AI Engine│   │Command   │
  │TimeScale│   │LP/DP/GA │   │Execution │
  └─────────┘   └─────────┘   └──────┬───┘
                                      │
                              ┌───────▼───────┐
                              │  DER Assets   │
                              │ (PV/Wind/BESS)│
                              └───────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ with TimescaleDB
- MQTT Broker (optional)
- OPC UA Server (optional)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your settings

# 3. Setup database
npm run prisma:generate
npm run prisma:push

# 4. Start development server
npm run dev
```

Application: http://localhost:3000
WebSocket: ws://localhost:3000/api/ws

## 📱 Pages

- **/dashboard** - Real-time metrics, charts, system status
- **/one-line** - Interactive SVG architecture diagram
- **/der-control** - DER management and curtailment control
- **/optimization** - AI-powered optimization engine
- **/historian** - Time-series data trends
- **/alarms** - Alarm management and audit trail
- **/settings** - System configuration
- **/users** - User and role management

## 🔌 API Routes

### SCADA
- `GET /api/scada/realtime` - Live telemetry
- `POST /api/scada/modbus` - Modbus TCP operations
- `POST /api/scada/mqtt` - MQTT messaging
- `POST /api/scada/opcua` - OPC UA operations

### Historian
- `POST /api/historian/write` - Write time-series
- `GET /api/historian/read` - Query historical data

### AI Engine
- `POST /api/ai/preprocess` - Data preprocessing
- `POST /api/ai/optimize` - Run optimization (LP/DP/GA/DRL/MIP)

### Commands
- `POST /api/command/translate` - Command translation
- `POST /api/command/send` - Execute field commands

### Resources
- `GET/POST/PUT /api/der` - DER management
- `GET/POST /api/assets` - Asset management
- `GET/POST /api/alarm` - Alarm handling

## 🎨 UI Theme

**Neon-Blue Cyber SCADA Theme**
- Primary: #00f0ff (Neon Blue)
- Accents: Cyan, Purple, Pink
- Dark backgrounds with glowing effects
- Industrial-grade visibility

## 🧠 AI Algorithms

1. **Linear Programming (LP)** - Convex optimization
2. **Dynamic Programming (DP)** - Sequential decisions
3. **Genetic Algorithm (GA)** - Evolutionary search
4. **Deep Reinforcement Learning (DRL)** - AI learning
5. **Mixed Integer Programming (MIP)** - Complex constraints

## 🔒 Security

- VPN segmentation for field devices
- Firewall protection
- Role-based access (Admin/Engineer/Operator)
- Complete audit logging
- Command validation

## 🛠️ Development

```bash
npm run dev              # Development mode
npm run build            # Production build
npm run start            # Production server
npm run prisma:studio    # Database GUI
```

## 📊 Database Schema

Key tables:
- `users` - System users
- `assets` - Field devices and equipment
- `der` - Distributed energy resources
- `telemetry` - Real-time measurements
- `historian_data` - Time-series storage
- `alarms` - System alarms
- `commands` - Control commands
- `ai_optimization_results` - Optimization history

## 📈 Performance

- WebSocket updates: 2-second intervals
- Indexed database queries
- Client-side state caching
- Async command execution
- Optimized chart rendering (50-100 points)

## 🔮 Roadmap

- [ ] NextAuth.js authentication
- [ ] Real protocol integration
- [ ] Mobile responsive design
- [ ] Advanced analytics
- [ ] Multi-site support
- [ ] ML model training UI

## 📄 License

Provided for demonstration purposes.

---

**Built by**: Senior SCADA, Automation, and Full-Stack Engineer

**Tech Stack**: Next.js • TypeScript • PostgreSQL • TimescaleDB • Prisma • WebSocket • Recharts

**Protocols**: Modbus TCP • MQTT • OPC UA • IEC 61850