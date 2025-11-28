# SCADA DER System with Active Power Curtailment (APC)

A comprehensive web-based SCADA system for Distributed Energy Resources (DER) featuring AI-powered Active Power Curtailment, real-time monitoring, and industrial-grade control capabilities.

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Sensor & Field Devices                          │
│  CT/VT │ Power Meters │ PMU │ 4-20mA Sensors │ Modbus Meters │ IEC61850 │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        RTU / PLC / Edge Gateway                         │
│         Modbus TCP │ MQTT │ IEC 61850 │ OPC UA │ Protocol Translation   │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼ (via VPN & Firewall)
┌─────────────────────────────────────────────────────────────────────────┐
│                           SCADA Server                                  │
│  ┌──────────────┬─────────────┬──────────────┬────────────────────┐    │
│  │ Data Acq     │ Historian   │ AI Engine    │ Command Execution  │    │
│  │ (Real-time)  │ (TimescaleDB)│ (Optimize)   │ (PLC Control)     │    │
│  └──────────────┴─────────────┴──────────────┴────────────────────┘    │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                       HMI / Web Dashboard                               │
│   Dashboard │ One-Line │ DER Control │ Historian │ AI Optimization     │
└─────────────────────────────────────────────────────────────────────────┘
```

## ✨ Features

### 🎯 Core Capabilities

- **Real-Time SCADA Monitoring**: Live telemetry from field devices via Modbus, MQTT, OPC UA
- **DER Management**: Control and monitor PV, Wind, BESS, and other distributed generation
- **Active Power Curtailment (APC)**: AI-driven optimization for grid congestion relief
- **Historian**: Time-series data storage with PostgreSQL + TimescaleDB
- **AI Optimization Engine**: Multiple algorithms (LP, DP, GA, DRL, Gradient Descent)
- **Alarm & Event Management**: Real-time alerts, audit trails, before/after logging
- **Command Execution**: Secure control commands to inverters and breakers
- **User Management**: Role-based access (Operator, Engineer, Admin)

### 📊 Pages & Interfaces

1. **Dashboard** (`/dashboard`) - Real-time system overview with live charts
2. **One-Line Diagram** (`/one-line`) - Interactive SVG system architecture
3. **DER Control** (`/der-control`) - DER management with AI-optimal curtailment
4. **Historian** (`/historian`) - Time-series trend visualization
5. **AI Optimization** (`/optimization`) - Multiple optimization algorithms
6. **Alarm & Event Log** (`/alarm-event-log`) - Real-time alarms and audit trail
7. **Settings** (`/settings`) - System configuration and user management

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ (with TimescaleDB extension)

### Installation

1. **Clone and install**:
   ```bash
   git clone <repository-url>
   cd scada-der-system
   npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database and protocol settings
   ```

3. **Set up database**:
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

4. **Run development server**:
   ```bash
   npm run dev
   ```

5. **Open**: [http://localhost:3000](http://localhost:3000)

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, Framer Motion, Recharts
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL + TimescaleDB
- **Protocols**: Modbus TCP, MQTT, OPC UA, IEC 61850
- **AI**: LP, DP, GA, DRL, Gradient Descent optimization

## 📁 Project Structure

```
scada-der-system/
├── app/                    # Next.js App Router pages
│   ├── dashboard/
│   ├── one-line/
│   ├── der-control/
│   ├── historian/
│   ├── optimization/
│   ├── alarm-event-log/
│   ├── settings/
│   └── api/                # API routes
├── components/             # React components
│   ├── layout/
│   ├── ui/
│   └── scada/
├── lib/                    # Core libraries
│   ├── db/                 # Prisma client
│   ├── protocols/          # Modbus, MQTT, OPC UA
│   ├── ai/                 # Optimization algorithms
│   └── utils/
├── prisma/
│   └── schema.prisma
└── public/
```

## 📊 Database Schema

Key models: Asset, Sensor, Rtu, Der, Telemetry, HistorianData, AiOptimizationResult, Command, Alarm, Event, User

## 🔐 Security

- VPN & Firewall for field communication
- JWT authentication
- Role-based access control (Operator, Engineer, Admin)
- Audit logging for all control actions

## 📈 API Endpoints

- `/api/scada/modbus` - Modbus RTU/PLC communication
- `/api/historian/{read,write}` - Time-series data
- `/api/ai/optimize` - AI optimization engine
- `/api/command/send` - Command execution
- `/api/alarm/raise` - Alarm management

## 📄 License

MIT License

---

**Built with ⚡ for modern power grid management**