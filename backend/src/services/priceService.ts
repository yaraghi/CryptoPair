import cmcProvider from './providers/coinMarketCapProvider';
import geckoProvider from './providers/coinGeckoProvider';
import { PriceData, PriceProvider } from '../types/price';
import { ProviderError } from '../utils/errors';

const providers: PriceProvider[] = [
  cmcProvider,
  geckoProvider
];

export async function getCryptoPrice(base: string, quote: string): Promise<PriceData> {
  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      return await provider.getPrice(base, quote);
    } catch (error) {
      lastError = error as Error;
      console.error(`Provider failed:`, error);
      // Continue to next provider
    }
  }

  // If we get here, all providers failed
  throw new ProviderError(
    `All price providers failed. Last error: ${lastError?.message}`,
    'all'
  );
} 