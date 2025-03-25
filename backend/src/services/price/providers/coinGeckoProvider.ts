import axios from 'axios';
import { config } from '../../../utils/config';
import { ProviderError } from '../../../utils/errors';
import { logger } from '../../../utils/logger';
import { PriceProvider, PriceData } from './priceProvider';
import { cacheService } from '../../cache/cacheService';

export class CoinGeckoProvider implements PriceProvider {
  async getPrice(symbol: string): Promise<PriceData> {
    const cacheKey = `coingecko_${symbol.toLowerCase()}`;
    const cachedData = cacheService.get<PriceData>(cacheKey);
    
    if (cachedData !== undefined) {
      return cachedData;
    }

    try {
      const response = await axios.get(
        `${config.COINGECKO_API_URL}/coins/${symbol.toLowerCase()}`,
        {
          params: {
            localization: false,
            tickers: false,
            market_data: true,
            community_data: false,
            developer_data: false,
            sparkline: false
          },
          timeout: config.API_TIMEOUT,
        }
      );

      const data = response.data.market_data;
      const priceData: PriceData = {
        price: data.current_price.usd,
        percent_change_1h: data.price_change_percentage_1h_in_currency.usd,
        percent_change_24h: data.price_change_percentage_24h_in_currency.usd,
        percent_change_7d: data.price_change_percentage_7d_in_currency.usd,
        market_cap: data.market_cap.usd,
        volume_24h: data.total_volume.usd,
        last_updated: data.last_updated
      };

      cacheService.set(cacheKey, priceData);
      return priceData;
    } catch (error) {
      logger.error('CoinGecko API error:', error);
      throw new ProviderError('Failed to fetch price from CoinGecko', 'coingecko');
    }
  }
} 