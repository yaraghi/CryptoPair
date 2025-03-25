# CryptoPair Application

A full-stack cryptocurrency price tracking application built with React, Node.js, and PostgreSQL. The application specifically tracks TON/USDT and USDT/TON pairs with real-time price updates and provides comprehensive market data.

## Features

- Real-time cryptocurrency price tracking for TON/USDT and USDT/TON pairs
- Price updates with maximum 30-minute delay using in-memory caching
- Comprehensive market data including:
  - Current price
  - Percentage changes (1h, 24h, 7d)
  - Market cap
  - 24h trading volume
- Multiple data provider support (CoinMarketCap, CoinGecko) with automatic fallback mechanism
- User interface for selecting and viewing different cryptocurrency pairs
- Type-safe development with TypeScript throughout the stack
- Docker-based development environment for easy setup

## Implementation Status

This implementation satisfies the requirements of the Senior FullStack Developer test assignment:

✅ Backend REST API using Node.js/Express  
✅ Integration with cryptocurrency price providers (CoinMarketCap, CoinGecko)  
✅ Price updates with maximum 30-minute delay  
✅ In-memory data caching to minimize API calls to external services  
✅ Frontend UI with React allowing users to select and view cryptocurrency prices  
✅ Well-structured code with proper error handling  
✅ Docker configuration for all services  
✅ Unit tests for both frontend and backend  
✅ Scalable architecture that allows for future enhancements  

## Technology Choices

### Frontend: React with TypeScript

React was chosen for the frontend due to its:
- **Component-based architecture**: Enables building reusable UI elements which is ideal for this project's simple but extensible UI requirements
- **Virtual DOM**: Provides efficient rendering for real-time price updates
- **Large ecosystem**: Access to libraries and tools to accelerate development within the 2-hour timeframe
- **TypeScript integration**: Ensures type safety across the application
- **Declarative approach**: Makes the code more predictable and easier to debug

TypeScript adds static typing to JavaScript, which helps catch errors during development rather than at runtime, making the codebase more maintainable and robust - essential for a financial application.

### Backend: Node.js with Express

Node.js with Express was selected because:
- **JavaScript/TypeScript consistency**: Maintains the same language across frontend and backend
- **Non-blocking I/O**: Efficiently handles concurrent API requests to cryptocurrency providers
- **Lightweight framework**: Express provides minimal overhead while offering the necessary routing capabilities
- **Rich ecosystem**: Easy integration with libraries for caching, logging, and data validation
- **Quick development**: Allows rapid API development to meet the 2-hour timeframe requirement

### Database: PostgreSQL

PostgreSQL was chosen as the database solution for its:
- **ACID compliance**: Ensures data integrity for financial information
- **SQL support**: Powerful querying capabilities for future historical data analysis
- **Docker compatibility**: Easy to configure and deploy in containerized environments
- **Scalability**: Well-suited for the potential future growth of the application

Note: While PostgreSQL is configured in the Docker setup, the current implementation uses in-memory caching. Database integration is prepared for future enhancement.

## Tech Stack Details

### Frontend
- React 18 with TypeScript
- Modern React patterns (hooks, functional components)
- In-line styling for a clean, functional UI (focusing on usability as per requirements)
- Jest for unit testing

### Backend
- Node.js with Express
- TypeScript for type safety
- Multiple price data providers:
  - CoinMarketCap API integration (primary)
  - CoinGecko API (fallback)
- Winston for structured logging
- Zod for schema validation and input sanitization
- Jest for unit testing
- Node-cache for in-memory caching

## Implementation Details

### Price Caching Strategy
The application implements a caching strategy to ensure price data is always fresh and available:

**In-Memory Cache (node-cache)**
- 30-minute TTL (Time To Live) to satisfy the requirement of maximum 30-minute delay
- Prevents excessive API calls to external providers
- Ensures price updates are never older than 30 minutes

### API Provider Fallback Mechanism
The backend implements a robust fallback mechanism:
- Multiple price data providers (CoinMarketCap, CoinGecko)
- Automatic failover to alternate provider if primary fails
- Logging and monitoring of provider health

### Error Handling
- Comprehensive error handling throughout the application
- Structured error responses from the API
- Detailed logging for debugging and monitoring
- Custom error classes for different types of errors

## Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development outside Docker)
- npm or yarn
- CoinMarketCap API key

## Getting Started

### Quick Start with Docker

The fastest way to get the application running after cloning the repository:

```bash
# Clone the repository
git clone <repository-url>
cd crypto-pair-price

# Build and start all containers
docker compose up --build
```

Then access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

**Note:** The Docker setup includes the CoinMarketCap API key (`abda9354-e442-440b-8e21-864a5065b37c`) directly in the docker-compose.yml file, so you can run the application immediately without any additional configuration or environment files.

### Setting Up Environment Variables

The repository includes default environment files that work out of the box. However, if you need to customize:

1. Copy the example environment files:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

2. Edit the backend `.env` file to add your CoinMarketCap API key (a working key is provided by default):
```
COINMARKETCAP_API_KEY=abda9354-e442-440b-8e21-864a5065b37c
```

### Docker Commands Reference

```bash
# Build and start all services
docker compose up --build

# Build and start in detached mode (background)
docker compose up -d --build

# Build with a custom API key
COINMARKETCAP_API_KEY=your_custom_key docker compose up --build

# View logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend

# Stop all services
docker compose down

# Restart a specific service
docker compose restart frontend

# Access a container's shell
docker compose exec backend sh

# Start only the PostgreSQL database
docker compose up postgres -d
```

### Docker Services Explained

The application consists of three Docker services:

1. **Frontend** (React application)
   - Accessible at: http://localhost:3000
   - Container name: frontend
   - Automatically reloads on code changes

2. **Backend** (Node.js API)
   - Accessible at: http://localhost:8000
   - Container name: backend
   - Automatically restarts on code changes
   - Includes fallback data provider if API key is unavailable
   - Environment variables:
     - Pre-configured with CoinMarketCap API key
     - Cache TTL set to 30 minutes (1800 seconds)

3. **PostgreSQL** (Database)
   - Accessible at: localhost:5432
   - Container name: postgres
   - Persists data in a named volume
   - Connection details:
     - Username: postgres
     - Password: postgres
     - Database: crypto_app

### Docker Environment Configuration

The Docker Compose setup automatically configures all necessary environment variables directly in the docker-compose.yml file:

1. **API Keys**: The CoinMarketCap API key is pre-configured in the backend service environment in docker-compose.yml.

2. **Cache Settings**: The backend is configured with a 30-minute cache TTL to meet the assignment requirements.

3. **Network Configuration**: All services are connected through an internal Docker network, so they can communicate with each other using service names.

4. **Volume Persistence**: PostgreSQL data is stored in a named volume to persist between container restarts.

5. **Hot Reloading**: Both frontend and backend have live code reloading enabled in development mode.

To override any environment variables in Docker:

```bash
# Example: Using a different API key
docker compose run -e COINMARKETCAP_API_KEY=new_key backend
```

You can also edit the docker-compose.yml file directly to permanently change any configuration.

### Troubleshooting Docker Setup

If you encounter issues:

1. **Port conflicts**: Ensure ports 3000, 8000, and 5432 are available on your machine
   ```bash
   # Check if ports are in use
   netstat -ano | findstr 3000  # Windows
   lsof -i :3000               # Mac/Linux
   ```

2. **Container doesn't start**: Check logs for errors
   ```bash
   docker compose logs frontend
   docker compose logs backend
   ```

3. **API key issues**: The provided API key has limited rate quotas. If needed, get a free key from [CoinMarketCap](https://coinmarketcap.com/api/)

4. **Reset everything**: 
   ```bash
   docker compose down -v
   docker compose up --build
   ```

### Running Without Docker

If you prefer to run the services without Docker:

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

### Running Unit Tests

#### Backend Tests
```bash
cd backend
npm install
npm test
```

#### Frontend Tests
```bash
cd frontend
npm install
npm test
```

## Development Workflow

1. **Frontend Development**
   - Edit files in `frontend/src`
   - Changes are automatically reflected in the browser (HMR)
   - Run tests: `npm test` in the frontend directory

2. **Backend Development**
   - Edit files in `backend/src`
   - Server automatically restarts on changes (nodemon)
   - Run tests: `npm test` in the backend directory

3. **Database Development**
   - Data is persisted in Docker volume `postgres_data`
   - Connect using any PostgreSQL client with the credentials above

## Project Structure

```
crypto-app/
├── frontend/                   # React frontend application
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── common/         # Reusable UI components
│   │   │   │   ├── Button.tsx  # Button component
│   │   │   │   └── Card.tsx    # Card component
│   │   │   ├── PriceFetcher.tsx # Main price fetching component
│   │   │   ├── PairSelector.tsx # Currency pair selector
│   │   │   └── PriceDisplay.tsx # Price data display
│   │   ├── config/             # Frontend configuration
│   │   │   ├── api.ts          # API endpoints config
│   │   │   └── pairs.ts        # Currency pairs definition
│   │   ├── types/              # TypeScript type definitions
│   │   │   └── api.ts          # API-related types
│   │   └── App.tsx             # Main application component
│   ├── .env                    # Frontend environment variables
│   ├── tsconfig.json           # TypeScript configuration
│   └── Dockerfile              # Frontend Docker configuration
├── backend/                    # Node.js backend application
│   ├── src/
│   │   ├── services/           # Business logic services
│   │   │   ├── cache/          # Caching service
│   │   │   └── price/          # Price data service
│   │   │       └── providers/  # Price data providers
│   │   ├── routes/             # API routes definitions
│   │   ├── middleware/         # Express middleware
│   │   ├── utils/              # Utility functions
│   │   │   ├── config.ts       # Configuration management
│   │   │   ├── errors.ts       # Error classes and handling
│   │   │   └── logger.ts       # Logging utility
│   │   ├── types/              # TypeScript type definitions
│   │   └── app.ts              # Express application setup
│   ├── .env                    # Backend environment variables
│   ├── tsconfig.json           # TypeScript configuration
│   └── Dockerfile              # Backend Docker configuration
├── docker-compose.yml          # Docker Compose configuration
└── README.md                   # Project documentation
```

## Environment Variables

### Frontend Environment Variables
```
REACT_APP_API_URL=http://localhost:8000
NODE_ENV=development
WDS_SOCKET_PORT=0
CHOKIDAR_USEPOLLING=true
```

### Backend Environment Variables (directly configured in docker-compose.yml)
```
NODE_ENV=development
PORT=3000
CACHE_TTL=1800
COINMARKETCAP_API_KEY=abda9354-e442-440b-8e21-864a5065b37c
COINMARKETCAP_API_URL=https://pro-api.coinmarketcap.com
COINGECKO_API_URL=https://api.coingecko.com/api/v3
API_TIMEOUT=5000
LOG_LEVEL=info
```

## Proposed Database Schema

This is a proposed schema for future implementation of the PostgreSQL database:

### Price Data Table
```sql
CREATE TABLE price_data (
    id SERIAL PRIMARY KEY,
    symbol VARCHAR(10) NOT NULL,
    price DECIMAL(20, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    source VARCHAR(50) NOT NULL,
    percent_change_1h DECIMAL(10, 2),
    percent_change_24h DECIMAL(10, 2),
    percent_change_7d DECIMAL(10, 2),
    market_cap DECIMAL(30, 2),
    volume_24h DECIMAL(30, 2)
);

CREATE INDEX idx_symbol_timestamp ON price_data(symbol, timestamp);
```

Note: Currently, the application uses in-memory caching only. The database schema will be implemented in future updates.

## Recommended Future Improvements

Based on the assignment's scalability considerations, here are specific recommended improvements:

### Supporting More Trading Pairs and Tokens
1. **Dynamic Pair Configuration**
   - Implement an admin interface for adding/removing trading pairs
   - Create a database table to store supported pairs
   - Add API endpoints to fetch available pairs

2. **Token Metadata Service**
   - Develop a service to fetch and cache token metadata
   - Implement token search functionality
   - Add token icons and additional information

### Displaying Historical Cryptocurrency Data
1. **Time Series Database Integration**
   - Implement the proposed database schema
   - Store historical price data at regular intervals
   - Create endpoints for fetching time-series data

2. **Charting Components**
   - Add interactive price charts
   - Implement multiple timeframes (1h, 24h, 7d, 30d, 1y)
   - Add technical indicators and analysis tools

### Integrating with Multiple Data Providers
1. **Provider Framework Extension**
   - Extend the current provider framework to support more sources
   - Implement provider health monitoring and scoring
   - Create a weighted response system based on provider reliability

2. **Data Aggregation**
   - Develop algorithms to aggregate data from multiple providers
   - Implement conflict resolution for discrepancies
   - Add confidence scores for price data

### Additional Technical Improvements
1. **Performance Optimization**
   - Implement WebSocket for real-time price updates
   - Add Redis for distributed caching across multiple instances
   - Implement proper database indexing and query optimization

2. **Security Enhancements**
   - Add API rate limiting
   - Implement JWT authentication for API access
   - Add comprehensive input validation
   - Set up proper CORS policies

3. **Monitoring and Observability**
   - Enhance application logging
   - Implement error tracking
   - Add performance monitoring
   - Set up alerts for system health

4. **Enhanced Testing**
   - Increase unit test coverage beyond the minimal requirement
   - Add integration and end-to-end tests
   - Implement automated UI testing
   - Set up continuous integration pipelines

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Run tests to ensure everything works: `npm test`
5. Commit your changes: `git commit -m 'Add some feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

## License

ISC