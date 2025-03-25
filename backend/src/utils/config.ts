import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
const result = dotenv.config({ path: path.resolve(__dirname, '../../.env') });

if (result.error) {
  console.error('Error loading .env file:', result.error);
  console.log('Current working directory:', process.cwd());
  console.log('Attempted to load .env from:', path.resolve(__dirname, '../../.env'));
}

const configSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform(Number).default('3000'),
  CACHE_TTL: z.string().transform(Number).default('300'),
  COINMARKETCAP_API_KEY: z.string().min(1, 'CoinMarketCap API key is required'),
  COINMARKETCAP_API_URL: z.string().default('https://pro-api.coinmarketcap.com'),
  COINGECKO_API_URL: z.string().default('https://api.coingecko.com/api/v3'),
  API_TIMEOUT: z.string().transform(Number).default('5000'),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
});

type Config = z.infer<typeof configSchema>;

function validateConfig(): Config {
  try {
    
    return configSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => {
        const path = err.path.join('.');
        const message = err.message;
        return `${path}: ${message}`;
      }).join('\n');
      
      throw new Error(
        `Missing or invalid environment variables:\n${missingVars}\n\n` +
        'Please check your .env file and ensure all required variables are set.'
      );
    }
    throw error;
  }
}

export const config = validateConfig(); 