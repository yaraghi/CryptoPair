import express from 'express';
import cors from 'cors';
import { config } from './utils/config';
import { logger } from './utils/logger';
import { validateInput } from './middleware/validateInput';
import errorHandler from './middleware/errorHandler';
import { PriceService } from './services/price/priceService';
import { CoinMarketCapProvider } from './services/price/providers/coinMarketCapProvider';
import { CoinGeckoProvider } from './services/price/providers/coinGeckoProvider';

const app = express();

// Initialize providers
const coinMarketCapProvider = new CoinMarketCapProvider(config.COINMARKETCAP_API_KEY);
const coinGeckoProvider = new CoinGeckoProvider();

// Initialize services
const priceService = new PriceService([coinMarketCapProvider, coinGeckoProvider]);

// Middleware
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Routes
app.get('/api/prices', validateInput, async (req, res, next) => {
  try {
    const { base, quote } = req.query;
    
    if (!base || !quote) {
      return res.status(400).json({ 
        error: 'Missing required parameters: base and quote' 
      });
    }

    const priceData = await priceService.getCryptoPrice(
      base as string,
      quote as string
    );

    res.json({
      base: priceData.base,
      quote: priceData.quote,
      price: priceData
    });
  } catch (error) {
    next(error);
  }
});

// Error handling
app.use(errorHandler);

export default app; 