# NILM Federated Learning Web Application

A complete web application for **Non-Intrusive Load Monitoring (NILM)** with **Federated Learning**, featuring real-time telemetry visualization using gauges, NILM inference, federated training simulation, and comprehensive data logging with CSV export capabilities.

## 🏗️ Architecture

This system consists of three main components:

1. **Frontend** (Next.js + TypeScript) - Real-time dashboard with gauge visualizations
2. **Backend API** (Node.js + Express + Prisma + PostgreSQL) - RESTful API and data persistence
3. **FL Service** (Python + FastAPI) - NILM inference and federated learning coordination

## 📊 Features

### 1. Real-time Telemetry Dashboard
- **Gauge-based visualization** for current power consumption
- Auto-refreshing sensor data every 2 seconds
- Display of:
  - Main power consumption
  - Individual appliance readings (Fridge, Dish Washer, Electric Heater, Stove, Microwave, Washer/Dryer)

### 2. NILM Inference
- Run disaggregation on time-series window of main power
- Store inference results in PostgreSQL
- Display estimated appliance power consumption
- Compare estimated vs. actual power consumption

### 3. Federated Learning Simulation
- Simulate local training on client data
- Submit model updates to FL coordinator
- FedAvg aggregation algorithm
- Track training progress in real-time
- View global model status (version, accuracy, loss, round)

### 4. Data Logging & CSV Export
- All data persisted in PostgreSQL via Prisma ORM
- Export capabilities:
  - Time series samples
  - Appliance estimates
  - Model updates
  - Model versions
- One-click CSV download from dashboard

## 🗂️ Project Structure

```
NextPorto/
├── frontend/              # Next.js (App Router) + TypeScript
│   ├── app/              # Next.js app directory
│   │   ├── layout.tsx    # Root layout
│   │   ├── page.tsx      # Home page
│   │   └── globals.css   # Global styles
│   ├── components/       # React components
│   │   ├── Gauge.tsx     # Gauge visualization component
│   │   ├── Gauge.module.css
│   │   ├── TelemetryDashboard.tsx
│   │   └── TelemetryDashboard.module.css
│   ├── lib/              # API client
│   │   └── api.ts
│   ├── types/            # TypeScript interfaces
│   │   └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── .env.example
│
├── backend/              # Express.js + Prisma + PostgreSQL
│   ├── prisma/
│   │   ├── schema.prisma # Database schema
│   │   └── seed.ts       # Seed data
│   ├── src/
│   │   ├── routes/       # API routes
│   │   │   ├── nilm.ts
│   │   │   ├── training.ts
│   │   │   └── logs.ts
│   │   ├── services/     # Business logic
│   │   │   ├── nilmService.ts
│   │   │   ├── trainingService.ts
│   │   │   ├── exportService.ts
│   │   │   └── flService.ts
│   │   ├── types/        # TypeScript types
│   │   │   └── index.ts
│   │   ├── utils/        # Utilities
│   │   │   └── prisma.ts
│   │   └── index.ts      # Main server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── fl-service/           # Python FastAPI for NILM & FL
│   ├── app/
│   │   ├── models/       # Pydantic schemas
│   │   │   └── schemas.py
│   │   ├── services/     # Business logic
│   │   │   ├── nilm_inference.py
│   │   │   └── federated_coordinator.py
│   │   ├── routers/      # API routes
│   │   │   ├── inference.py
│   │   │   └── federated.py
│   │   └── main.py       # FastAPI app
│   ├── requirements.txt
│   └── .env.example
│
└── docs/
    └── uml/              # PlantUML diagrams
        ├── component-architecture.puml
        ├── domain-model.puml
        └── sequence-diagram.puml
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+ recommended)
- **Python** (3.9+ recommended)
- **PostgreSQL** (14+ recommended)
- **npm** or **yarn**

### 1. Database Setup (PostgreSQL)

Install and start PostgreSQL, then create a database:

```bash
# Using PostgreSQL CLI
psql -U postgres
CREATE DATABASE nilm_federated;
\q
```

Or use Docker:

```bash
docker run --name nilm-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nilm_federated \
  -p 5432:5432 \
  -d postgres:14
```

### 2. Backend Setup (Express + Prisma)

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your database connection string
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nilm_federated?schema=public"

# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database with sample data
npm run prisma:seed

# Start the backend server
npm run dev
```

The backend API will be running at **http://localhost:3001**

#### Backend API Endpoints

- **NILM Routes**:
  - `GET /api/nilm/sample` - Generate and store new dummy sample
  - `GET /api/nilm/samples` - Get recent samples
  - `POST /api/nilm/infer` - Run NILM inference
  - `GET /api/nilm/estimate/latest` - Get latest estimate
  - `GET /api/nilm/estimates` - Get recent estimates

- **Training Routes**:
  - `POST /api/training/start` - Start local training
  - `GET /api/training/status` - Get training status
  - `GET /api/training/model-status` - Get model status

- **Logs Routes**:
  - `GET /api/logs/export?type=samples` - Export samples as CSV
  - `GET /api/logs/export?type=estimates` - Export estimates as CSV
  - `GET /api/logs/export?type=updates` - Export updates as CSV
  - `GET /api/logs/export?type=models` - Export models as CSV

### 3. FL Service Setup (Python + FastAPI)

```bash
cd fl-service

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the FL service
python -m app.main
```

Or use uvicorn directly:

```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The FL service will be running at **http://localhost:8000**

Interactive API docs available at **http://localhost:8000/docs**

#### FL Service Endpoints

- `POST /infer` - Run NILM inference on time-series window
- `POST /federated/update` - Submit federated learning update
- `GET /federated/global-model` - Get current global model
- `GET /federated/round-info` - Get current round information
- `GET /health` - Health check

### 4. Frontend Setup (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env if backend is not on localhost:3001
# NEXT_PUBLIC_API_URL=http://localhost:3001

# Start the frontend dev server
npm run dev
```

The frontend will be running at **http://localhost:3000**

## 📖 Usage Guide

### Starting the Full System

1. **Start PostgreSQL** (if not already running)

2. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Start FL Service**:
   ```bash
   cd fl-service
   source venv/bin/activate  # or venv\Scripts\activate on Windows
   python -m app.main
   ```

4. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

5. **Open Browser**: Navigate to **http://localhost:3000**

### Using the Dashboard

#### Real-time Telemetry
- The dashboard automatically fetches and displays sensor data every 2 seconds
- Gauges show current power consumption for main power and all appliances
- Click **"Pause Auto-refresh"** to stop updates, **"Resume"** to continue

#### Running NILM Inference
1. Click **"Run NILM Inference"** button
2. The system will:
   - Collect the last 50 samples of main power
   - Send to FL service for disaggregation
   - Display estimated appliance powers in separate gauges
   - Show total estimated vs. actual main power
   - Display estimation error

#### Federated Training
1. Click **"Start Local Training"** button
2. Watch the training progress:
   - Status updates in real-time
   - Progress bar shows completion percentage
   - Training message shows current step
3. After completion:
   - Global model version increments
   - Model accuracy and loss update
   - Federated round advances

#### Exporting Data
- Click any of the **"Export CSV"** buttons to download:
  - **Samples**: Raw time-series sensor data
  - **Estimates**: NILM inference results
  - **Updates**: Federated learning client updates
  - **Models**: Model version history

## 🗄️ Database Schema (Prisma)

### Models

#### User
- `id`: UUID
- `email`: String (unique)
- `name`: String (optional)
- Relations: samples, applianceEstimates, modelUpdates

#### TimeSeriesSample
- `id`: UUID
- `timestamp`: DateTime
- `main`, `dishWasher`, `electricSpaceHeater`, `electricStove`, `fridge`, `microwave`, `washerDryer`: Float
- Relations: user

#### ApplianceEstimate
- `id`: UUID
- `timestamp`: DateTime
- `dishWasherPower`, `spaceHeaterPower`, `stovePower`, `fridgePower`, `microwavePower`, `washerDryerPower`: Float
- `totalEstimated`, `actualMain`: Float
- Relations: user, modelVersion

#### ModelVersion
- `id`: UUID
- `version`: Int (auto-increment)
- `type`: String (e.g., "CNN-LSTM")
- `weightsPath`: String (optional)
- `accuracy`, `loss`: Float (optional)
- `roundId`: Int
- `isGlobal`: Boolean
- Relations: applianceEstimates, modelUpdates

#### ModelUpdate
- `id`: UUID
- `clientId`: String
- `roundId`: Int
- `numSamples`: Int
- `deltaWeightsPath`: String (optional)
- `loss`, `accuracy`: Float (optional)
- `status`: String (pending | submitted | aggregated)
- Relations: user, modelVersion

### Useful Prisma Commands

```bash
# Generate Prisma client after schema changes
npm run prisma:generate

# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (GUI for database)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
npm run db:reset
```

## 🎨 Frontend Architecture

### Technology Stack
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **CSS Modules** for styling (monochrome theme)
- **Axios** for API requests

### Components
- **Gauge**: Reusable gauge visualization component
- **TelemetryDashboard**: Main dashboard with all features

### Key Features
- Client-side rendering for real-time updates
- Automatic polling for sensor data
- Manual controls for inference and training
- CSV export via backend API

## 🐍 FL Service Architecture

### Technology Stack
- **FastAPI** for high-performance API
- **Pydantic** for data validation
- **NumPy** for numerical operations

### NILM Inference Algorithm
The `NILMInferenceModel` uses heuristic-based disaggregation:
- Analyzes power patterns (mean, max, std, recent values)
- Detects appliance signatures based on thresholds
- Estimates individual appliance power consumption
- Adds realistic noise (±10%)

In production, replace with trained CNN-LSTM or similar deep learning model.

### Federated Learning Coordinator
The `FederatedCoordinator` implements:
- Client update aggregation (FedAvg)
- Round management
- Global model versioning
- Weighted averaging based on sample counts

## 📐 UML Diagrams

The project includes comprehensive UML diagrams in PlantUML format:

1. **Component Architecture** (`docs/uml/component-architecture.puml`)
   - Shows system architecture and component relationships
   - Illustrates data flow between services

2. **Domain Model** (`docs/uml/domain-model.puml`)
   - Entity relationship diagram
   - Database schema visualization
   - Model relationships and attributes

3. **Sequence Diagram** (`docs/uml/sequence-diagram.puml`)
   - Real-time telemetry flow
   - NILM inference sequence
   - Federated training workflow
   - CSV export process

To view PlantUML diagrams, use:
- [PlantUML Online Editor](http://www.plantuml.com/plantuml/uml/)
- VS Code extension: PlantUML
- IntelliJ IDEA plugin: PlantUML integration

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nilm_federated?schema=public"
PORT=3001
NODE_ENV=development
FL_SERVICE_URL="http://localhost:8000"
```

#### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### FL Service (.env)
```env
PORT=8000
HOST=0.0.0.0
MODEL_PATH=/models/
LOG_LEVEL=INFO
```

## 🧪 Testing the System

### 1. Verify All Services Are Running
- Backend: http://localhost:3001/health
- FL Service: http://localhost:8000/health
- Frontend: http://localhost:3000

### 2. Test NILM Inference
1. Open dashboard
2. Wait for samples to accumulate (at least 50)
3. Click "Run NILM Inference"
4. Verify estimates appear in gauges

### 3. Test Federated Training
1. Click "Start Local Training"
2. Watch progress bar advance
3. Verify model version increments after completion
4. Check model accuracy and loss values

### 4. Test CSV Export
1. Click any "Export CSV" button
2. Verify CSV file downloads
3. Open CSV to check data format

## 🚧 Development Notes

### Extending the System

#### Adding New Appliances
1. Update Prisma schema (`backend/prisma/schema.prisma`)
2. Add fields to TypeScript interfaces
3. Update gauge displays in frontend
4. Modify NILM inference logic in FL service

#### Implementing Real NILM Model
Replace `fl-service/app/services/nilm_inference.py` with:
- Load PyTorch/TensorFlow model
- Preprocess input window
- Run forward pass
- Postprocess predictions

#### Adding User Authentication
1. Implement auth middleware in Express
2. Add JWT token management
3. Protect API routes
4. Update frontend to handle auth

## 📚 References

- **NILM**: [Non-Intrusive Load Monitoring](https://en.wikipedia.org/wiki/Nonintrusive_load_monitoring)
- **REDD Dataset**: [Reference Energy Disaggregation Dataset](http://redd.csail.mit.edu/)
- **Federated Learning**: [Federated Learning: Collaborative ML without Centralized Training Data](https://ai.googleblog.com/2017/04/federated-learning-collaborative.html)
- **FedAvg**: [Communication-Efficient Learning of Deep Networks from Decentralized Data](https://arxiv.org/abs/1602.05629)

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ for energy monitoring and privacy-preserving machine learning**