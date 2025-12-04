# Neural Network Digit Recognition Visualizer

A full-stack Next.js web application that visualizes a neural network used for digit (0-9) recognition. Draw a digit on a canvas and watch as the neural network predicts it in real-time, complete with layer activations and probability distributions.

Inspired by [Number-Guesser-Neural-Net](https://github.com/techwithtim/Number-Guesser-Neural-Net).

## Features

- **Interactive Drawing Canvas**: Draw digits (0-9) using mouse or touch
- **Real-time Predictions**: Neural network predictions powered by TensorFlow.js
- **Network Visualization**: See layer-by-layer activations and architecture
- **Probability Charts**: Visual representation of prediction confidence for all digits
- **History Dashboard**: Browse past predictions with filtering capabilities
- **CSV Export**: Download prediction history for analysis
- **PostgreSQL Database**: Persistent storage of all predictions using Prisma ORM

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: CSS Modules (no Tailwind)
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL
- **ORM**: Prisma
- **ML**: TensorFlow.js
- **Theme**: Blue, black, and white color palette

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.17 or higher
- **npm**: v9 or higher
- **PostgreSQL**: v12 or higher

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/dhanyafiyudhistira/NextPorto.git
cd NextPorto
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

Create a PostgreSQL database for the application:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE neural_net_db;

# Exit psql
\q
```

### 4. Configure Environment Variables

Copy the example environment file and update it with your database credentials:

```bash
cp .env.example .env
```

Edit `.env` and update the `DATABASE_URL`:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/neural_net_db?schema=public"
```

Replace:
- `YOUR_USERNAME` with your PostgreSQL username (default: `postgres`)
- `YOUR_PASSWORD` with your PostgreSQL password

### 5. Run Database Migrations

Generate Prisma client and create database tables:

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations (create tables)
npx prisma migrate dev --name init
```

If you encounter issues with Prisma binary downloads, you can use:

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### 6. Start Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## Usage

### Drawing and Predicting Digits

1. Navigate to the home page at `http://localhost:3000`
2. Draw a digit (0-9) on the canvas using your mouse or touch
3. Click the **"Predict"** button
4. View the prediction results:
   - **Predicted digit** with confidence percentage
   - **Probability distribution** for all digits (0-9)
   - **Neural network visualization** showing layer activations
5. Click **"Clear"** to draw a new digit

### Viewing History

1. Click **"History"** in the navigation
2. Browse all past predictions in a table format
3. Use filters to narrow results:
   - **Predicted Digit**: Filter by specific digit (0-9)
   - **Start Date**: Filter predictions from a specific date
   - **End Date**: Filter predictions up to a specific date
4. Click **"Download CSV"** to export filtered results

## Project Structure

```
NextPorto/
├── prisma/
│   └── schema.prisma          # Database schema
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── predict/
│   │   │   │   └── route.ts   # POST /api/predict endpoint
│   │   │   └── history/
│   │   │       ├── route.ts   # GET /api/history endpoint
│   │   │       └── export/
│   │   │           └── route.ts # CSV export endpoint
│   │   ├── history/
│   │   │   ├── page.tsx       # History page
│   │   │   └── page.module.css
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   ├── page.module.css
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── DrawingCanvas.tsx          # Interactive canvas
│   │   ├── DrawingCanvas.module.css
│   │   ├── NetworkVisualization.tsx   # NN visualization
│   │   ├── NetworkVisualization.module.css
│   │   ├── ProbabilityChart.tsx       # Probability bars
│   │   └── ProbabilityChart.module.css
│   └── lib/
│       ├── neuralNetwork.ts   # TensorFlow.js NN model
│       └── prisma.ts          # Prisma client
├── .env                       # Environment variables
├── .env.example              # Example environment file
├── next.config.js            # Next.js configuration
├── tsconfig.json             # TypeScript configuration
└── package.json
```

## API Endpoints

### POST /api/predict

Make a prediction on a drawn digit.

**Request Body:**
```json
{
  "imageData": [/* 784 pixel values (28x28) */],
  "inputLabel": "optional true label"
}
```

**Response:**
```json
{
  "success": true,
  "id": 1,
  "predictedDigit": 7,
  "confidence": 0.95,
  "probabilities": [0.01, 0.02, ...],
  "activations": {
    "input": [...],
    "hidden1": [...],
    "hidden2": [...],
    "output": [...]
  }
}
```

### GET /api/history

Retrieve prediction history with pagination and filters.

**Query Parameters:**
- `page` (number): Page number (default: 1)
- `limit` (number): Results per page (default: 20)
- `digit` (number): Filter by predicted digit (0-9)
- `startDate` (string): Filter from date (ISO format)
- `endDate` (string): Filter to date (ISO format)

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### GET /api/history/export

Export predictions as CSV file. Accepts same query parameters as `/api/history`.

## Neural Network Architecture

The application uses a feedforward neural network with the following architecture:

```
Input Layer:    784 neurons (28×28 pixel image)
      ↓
Hidden Layer 1: 128 neurons (ReLU activation)
      ↓
Hidden Layer 2: 64 neurons (ReLU activation)
      ↓
Output Layer:   10 neurons (Softmax activation)
```

### How It Works

1. **Input Processing**: The 28×28 canvas drawing is converted to a grayscale array of 784 pixel values (0-255)
2. **Normalization**: Pixel values are normalized to the range [0, 1]
3. **Forward Pass**: The input passes through each layer:
   - **Hidden Layer 1**: 784 → 128 neurons with ReLU activation
   - **Hidden Layer 2**: 128 → 64 neurons with ReLU activation
   - **Output Layer**: 64 → 10 neurons with Softmax activation
4. **Prediction**: The output layer produces probabilities for each digit (0-9)
5. **Activations**: Layer activations are captured for visualization

## Database Schema

```prisma
model Prediction {
  id             Int      @id @default(autoincrement())
  createdAt      DateTime @default(now())
  inputLabel     String?  // Optional true label
  predictedDigit Int      // Predicted digit (0-9)
  probabilities  Json     // Probabilities for all digits
  activations    Json?    // Layer activations
  meta           Json?    // Request metadata
}
```

## Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm start           # Start production server

# Linting
npm run lint        # Run ESLint

# Database
npx prisma generate  # Generate Prisma Client
npx prisma migrate dev  # Run migrations
npx prisma studio    # Open Prisma Studio (database GUI)
```

## Troubleshooting

### Database Connection Issues

If you encounter database connection errors:

1. Verify PostgreSQL is running: `pg_isready`
2. Check your credentials in `.env`
3. Ensure the database exists: `psql -U postgres -l`
4. Test connection: `psql -U postgres -d neural_net_db`

### Prisma Binary Download Issues

If Prisma can't download binaries (e.g., in restricted networks):

```bash
PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1 npx prisma generate
```

### Port Already in Use

If port 3000 is busy:

```bash
# Use a different port
PORT=3001 npm run dev
```

### TensorFlow.js Issues

If you encounter TensorFlow.js errors:

1. Ensure you're using Node.js v18.17 or higher
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

## Development Notes

### Adding Pre-trained Weights

The neural network currently uses randomly initialized weights. To use pre-trained weights:

1. Train a model on MNIST dataset
2. Export weights to JSON format
3. Load weights using:

```typescript
const network = getNetworkInstance();
await network.loadWeights('file://path/to/weights.json');
```

### Customizing the Network

To modify the network architecture, edit `src/lib/neuralNetwork.ts`:

```typescript
// Example: Add another hidden layer
tf.layers.dense({
  units: 32,
  activation: 'relu',
  name: 'hidden3',
})
```

## Production Deployment

### Environment Variables

Ensure these are set in production:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
NODE_ENV="production"
```

### Build and Deploy

```bash
# Build
npm run build

# Start production server
npm start
```

### Recommended Hosting

- **Vercel**: Best for Next.js apps (requires Serverless Postgres)
- **Railway**: Great for apps with PostgreSQL
- **DigitalOcean**: Full control with VPS

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -m 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Inspired by [Number-Guesser-Neural-Net](https://github.com/techwithtim/Number-Guesser-Neural-Net) by TechWithTim
- Built with [Next.js](https://nextjs.org/)
- Neural network powered by [TensorFlow.js](https://www.tensorflow.org/js)
- Database managed with [Prisma](https://www.prisma.io/)

## Support

If you encounter issues or have questions:

1. Check the [Troubleshooting](#troubleshooting) section
2. Open an issue on GitHub
3. Review Next.js documentation: https://nextjs.org/docs

---

**Built with ❤️ using Next.js, TensorFlow.js, and PostgreSQL**
