import axios from 'axios';
import NodeCache from 'node-cache';
import { PriceData, PriceProvider } from '../../types/price';
import { ProviderError } from '../../utils/errors';
require('dotenv').config();

const cache = new NodeCache({ stdTTL: Number(process.env.CACHE_TTL) || 1800 });

if (!process.env.COINMARKETCAP_API_KEY) {
  throw new Error('COINMARKETCAP_API_KEY environment variable is required');
}

if (!process.env.COINMARKETCAP_API_URL) {
  throw new Error('COINMARKETCAP_API_URL environment variable is required');
}

class CoinMarketCapProvider implements PriceProvider {
  async getPrice(base: string, quote: string): Promise<PriceData> {
    const baseSymbol = base.toUpperCase();
    const quoteSymbol = quote.toUpperCase();
    const cacheKey = `cmc_${baseSymbol}_${quoteSymbol}`;

    const cached = cache.get<PriceData>(cacheKey);
    if (cached) return cached;

    try {
      const response = await axios.get(process.env.COINMARKETCAP_API_URL!, {
        params: {
          symbol: baseSymbol,
          convert: quoteSymbol,
        },
        headers: {
          'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY,
        },
        timeout: 5000 // 5 second timeout
      });

      const raw = response.data?.data?.[baseSymbol]?.[0];
      const quoteData = raw?.quote?.[quoteSymbol];

      if (!quoteData?.price) throw new Error('Price not found');

      const result: PriceData = {
        base: baseSymbol,
        quote: quoteSymbol,
        price: {
          base: baseSymbol,
          quote: quoteSymbol,
          price: quoteData.price,
          percent_change_1h: quoteData.percent_change_1h,
          percent_change_24h: quoteData.percent_change_24h,
          percent_change_7d: quoteData.percent_change_7d,
          market_cap: quoteData.market_cap,
          volume_24h: quoteData.volume_24h,
          last_updated: quoteData.last_updated,
        },
      };

      cache.set(cacheKey, result);
      return result;
    } catch (err: any) {
      console.error(`[CMC] Error:`, err.response?.data || err.message);
      throw new ProviderError(
        `Failed to fetch price from CoinMarketCap: ${err.message}`,
        'coinmarketcap'
      );
    }
  }
}

export default new CoinMarketCapProvider(); 