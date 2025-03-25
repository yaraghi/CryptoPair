import axios from 'axios';
import { config } from '../../../utils/config';
import { ProviderError } from '../../../utils/errors';
import { logger } from '../../../utils/logger';
import { PriceProvider, PriceData } from './priceProvider';
import { cacheService } from '../../cache/cacheService';

export class CoinMarketCapProvider implements PriceProvider {
  constructor(private readonly apiKey: string) {
    if (!this.apiKey) {
      throw new Error('CoinMarketCap API key is required');
    }
  }

  private formatNumber(value: number | undefined | null): number {
    return Number((value || 0).toFixed(2));
  }

  private logError(error: unknown, symbol: string): void {
    const errorContext = {
      symbol,
      ...(axios.isAxiosError(error) 
        ? {
            status: error.response?.status,
            data: error.response?.data,
            errorMessage: error.message,
          }
        : {
            errorMessage: error instanceof Error ? error.message : 'Unknown error',
          }
      )
    };
    logger.error('CoinMarketCap API error', errorContext);
  }

  async getPrice(symbol: string): Promise<PriceData> {
    const cacheKey = `cmc_${symbol.toLowerCase()}`;
    const cachedData = cacheService.get<PriceData>(cacheKey);
    
    if (cachedData !== undefined) {
      return cachedData;
    }

    try {
      const response = await axios.get(
        `${config.COINMARKETCAP_API_URL}/v1/cryptocurrency/quotes/latest`,
        {
          params: {
            symbol,
            convert: 'USD',
            aux: 'num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,market_cap_by_total_supply,volume_24h_reported,volume_7d,volume_7d_reported,volume_30d,volume_30d_reported,is_active,is_fiat'
          },
          headers: {
            'X-CMC_PRO_API_KEY': this.apiKey,
            'Accept': 'application/json',
          },
          timeout: config.API_TIMEOUT,
        }
      );

      const data = response.data.data[symbol];
      if (!data) {
        throw new ProviderError(`No data found for symbol ${symbol}`, 'DATA_NOT_FOUND');
      }

      const quote = data.quote.USD;
      if (!quote) {
        throw new ProviderError(`No USD quote found for symbol ${symbol}`, 'QUOTE_NOT_FOUND');
      }

      const priceData: PriceData = {
        price: this.formatNumber(quote.price),
        percent_change_1h: this.formatNumber(quote.percent_change_1h),
        percent_change_24h: this.formatNumber(quote.percent_change_24h),
        percent_change_7d: this.formatNumber(quote.percent_change_7d),
        market_cap: this.formatNumber(quote.market_cap),
        volume_24h: this.formatNumber(quote.volume_24h),
        last_updated: quote.last_updated || new Date().toISOString()
      };

      cacheService.set(cacheKey, priceData);
      return priceData;
    } catch (error) {
      this.logError(error, symbol);
      throw new ProviderError('Failed to fetch price from CoinMarketCap', 'API_ERROR');
    }
  }
} 