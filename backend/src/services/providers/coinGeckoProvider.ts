import axios from 'axios';
import NodeCache from 'node-cache';
import { PriceData, PriceProvider } from '../../types/price';
import { ProviderError } from '../../utils/errors';
require('dotenv').config();

const cache = new NodeCache({ stdTTL: Number(process.env.CACHE_TTL) || 1800 });

if (!process.env.COINGECKO_API_URL) {
  throw new Error('COINGECKO_API_URL environment variable is required');
}

class CoinGeckoProvider implements PriceProvider {
  async getPrice(base: string, quote: string): Promise<PriceData> {
    const baseSymbol = base.toLowerCase();
    const quoteSymbol = quote.toLowerCase();
    const cacheKey = `gecko_${baseSymbol}_${quoteSymbol}`;

    const cached = cache.get<PriceData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(process.env.COINGECKO_API_URL!, {
        params: {
          ids: baseSymbol,
          vs_currencies: quoteSymbol,
          include_24hr_change: true,
          include_market_cap: true,
          include_24hr_vol: true,
        },
        timeout: 5000 // 5 second timeout
      });

      const data = response.data[baseSymbol];
      if (!data) throw new Error('Price not found');

      const result: PriceData = {
        base: baseSymbol.toUpperCase(),
        quote: quoteSymbol.toUpperCase(),
        price: {
          base: baseSymbol.toUpperCase(),
          quote: quoteSymbol.toUpperCase(),
          price: data[quoteSymbol],
          percent_change_24h: data[`${quoteSymbol}_24h_change`],
          market_cap: data[`${quoteSymbol}_market_cap`],
          volume_24h: data[`${quoteSymbol}_24h_vol`],
          last_updated: new Date().toISOString(),
        },
      };

      cache.set(cacheKey, result);
      return result;
    } catch (err: any) {
      console.error(`[CoinGecko] Error:`, err.response?.data || err.message);
      throw new ProviderError(
        `Failed to fetch price from CoinGecko: ${err.message}`,
        'coingecko'
      );
    }
  }
}

export default new CoinGeckoProvider(); 