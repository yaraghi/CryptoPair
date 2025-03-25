import { PriceProvider, PriceData } from './providers/priceProvider';
import { ProviderError } from '../../utils/errors';
import logger from '../../utils/logger';

export class PriceService {
  private providers: PriceProvider[];

  constructor(providers: PriceProvider[]) {
    this.providers = providers;
  }

  async getCryptoPrice(baseSymbol: string, quoteSymbol: string): Promise<PriceData> {
    let baseData: PriceData | undefined;
    let lastError: Error | undefined;

    // Try each provider until we get a successful response
    for (const provider of this.providers) {
      try {
        baseData = await provider.getPrice(baseSymbol);
        break;
      } catch (err) {
        const error = err as Error;
        lastError = error;
        logger.warn(`Provider ${provider.constructor.name} failed: ${error.message}`);
      }
    }

    if (!baseData) {
      throw new ProviderError(
        'Failed to fetch price from all providers',
        'ALL_PROVIDERS_FAILED'
      );
    }

    // Try to get quote data if needed
    let quoteData: PriceData | undefined;
    if (quoteSymbol !== 'USD' && quoteSymbol !== 'USDT') {
      for (const provider of this.providers) {
        try {
          quoteData = await provider.getPrice(quoteSymbol);
          break;
        } catch (err) {
          const error = err as Error;
          logger.warn(`Provider ${provider.constructor.name} failed to fetch quote: ${error.message}`);
        }
      }
    }

    // Calculate final price and adjustments
    const quotePrice = quoteData ? quoteData.price : 1;
    const price = baseData.price / quotePrice;

    // Calculate relative percent changes
    const adjustPercentChange = (base: number, quote: number = 0) => {
      return Number((base - quote).toFixed(2));
    };

    return {
      price: Number(price.toFixed(2)),
      percent_change_1h: adjustPercentChange(baseData.percent_change_1h, quoteData?.percent_change_1h),
      percent_change_24h: adjustPercentChange(baseData.percent_change_24h, quoteData?.percent_change_24h),
      percent_change_7d: adjustPercentChange(baseData.percent_change_7d, quoteData?.percent_change_7d),
      market_cap: baseData.market_cap,
      volume_24h: baseData.volume_24h,
      last_updated: baseData.last_updated,
      base: baseSymbol,
      quote: quoteSymbol
    };
  }
} 