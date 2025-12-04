# NILM Federated Learning - Quick Start Guide

Get the NILM Federated Learning system up and running in minutes!

## Prerequisites Check

```bash
# Check Node.js version (need v18+)
node --version

# Check Python version (need 3.9+)
python --version

# Check PostgreSQL (need 14+)
psql --version
```

## 🚀 5-Minute Setup

### Step 1: Start PostgreSQL

**Option A - Using Docker (Recommended):**
```bash
docker run --name nilm-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=nilm_federated \
  -p 5432:5432 \
  -d postgres:14
```

**Option B - Local PostgreSQL:**
```bash
psql -U postgres
CREATE DATABASE nilm_federated;
\q
```

### Step 2: Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Initialize database
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed

# Start server
npm run dev
```

✅ Backend running at http://localhost:3001

### Step 3: Setup FL Service

```bash
cd fl-service

# Create virtual environment
python -m venv venv

# Activate it
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start service
python -m app.main
```

✅ FL Service running at http://localhost:8000

### Step 4: Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env

# Start dev server
npm run dev
```

✅ Frontend running at http://localhost:3000

## 🎉 You're Ready!

Open your browser and go to: **http://localhost:3000**

## 🧪 Quick Test

1. **Real-time Telemetry**: Watch gauges update automatically every 2 seconds
2. **Run Inference**: Click "Run NILM Inference" to see appliance disaggregation
3. **Start Training**: Click "Start Local Training" to simulate federated learning
4. **Export Data**: Click any "Export CSV" button to download data

## 🔧 Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `docker ps` or `psql -U postgres -c "SELECT 1"`
- Verify DATABASE_URL in `backend/.env`

### FL Service won't start
- Make sure virtual environment is activated
- Try: `pip install --upgrade pip` then reinstall dependencies

### Frontend can't connect
- Verify backend is running at http://localhost:3001/health
- Verify FL service is running at http://localhost:8000/health

### Port conflicts
If ports are already in use, edit these files:
- Backend port: `backend/.env` (PORT=3001)
- FL service: Use `uvicorn app.main:app --port 8001`
- Frontend port: `npm run dev -- -p 3002`

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the [UML diagrams](docs/uml/) to understand the architecture
- Check out the API docs at http://localhost:8000/docs (FL Service)
- Try the Prisma Studio: `cd backend && npm run prisma:studio`

## 🛑 Stopping Services

```bash
# Stop frontend: Ctrl+C in the terminal

# Stop backend: Ctrl+C in the terminal

# Stop FL service: Ctrl+C in the terminal

# Stop PostgreSQL (Docker):
docker stop nilm-postgres
```

## 🔄 Restarting

To restart later, just run:
```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: FL Service
cd fl-service && source venv/bin/activate && python -m app.main

# Terminal 3: Frontend
cd frontend && npm run dev
```

---

**Having issues?** Check the main [README.md](README.md) for more detailed instructions!
