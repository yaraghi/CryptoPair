import axios from 'axios';
import { CoinMarketCapProvider } from '../coinMarketCapProvider';
import { ProviderError } from '../../../../utils/errors';
import { cacheService } from '../../../cache/cacheService';

// Mock dependencies
jest.mock('axios');
jest.mock('../../../cache/cacheService');
jest.mock('../../../../utils/logger');

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedCacheService = cacheService as jest.Mocked<typeof cacheService>;

describe('CoinMarketCapProvider', () => {
  let provider: CoinMarketCapProvider;
  const mockApiKey = 'test-api-key';

  beforeEach(() => {
    provider = new CoinMarketCapProvider(mockApiKey);
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should throw error if API key is not provided', () => {
      expect(() => new CoinMarketCapProvider('')).toThrow('CoinMarketCap API key is required');
    });
  });

  describe('getPrice', () => {
    const mockSymbol = 'BTC';
    const mockResponse = {
      data: {
        data: {
          BTC: {
            quote: {
              USD: {
                price: 50000.123456,
                percent_change_1h: 1.234567,
                percent_change_24h: 2.345678,
                percent_change_7d: 3.456789,
                market_cap: 1000000000.123456,
                volume_24h: 500000000.123456,
                last_updated: '2024-01-01T00:00:00.000Z'
              }
            }
          }
        }
      }
    };

    it('should return cached data if available', async () => {
      const cachedData = {
        price: 50000.12,
        percent_change_1h: 1.23,
        percent_change_24h: 2.34,
        percent_change_7d: 3.45,
        market_cap: 1000000000.12,
        volume_24h: 500000000.12,
        last_updated: '2024-01-01T00:00:00.000Z'
      };
      mockedCacheService.get.mockReturnValue(cachedData);

      const result = await provider.getPrice(mockSymbol);

      expect(result).toEqual(cachedData);
      expect(mockedAxios.get).not.toHaveBeenCalled();
    });

    it('should fetch and format price data from API', async () => {
      mockedCacheService.get.mockReturnValue(undefined);
      mockedAxios.get.mockResolvedValue(mockResponse);

      const result = await provider.getPrice(mockSymbol);

      expect(result).toEqual({
        price: 50000.12,
        percent_change_1h: 1.23,
        percent_change_24h: 2.35,
        percent_change_7d: 3.46,
        market_cap: 1000000000.12,
        volume_24h: 500000000.12,
        last_updated: '2024-01-01T00:00:00.000Z'
      });
      expect(mockedCacheService.set).toHaveBeenCalledWith(
        'cmc_btc',
        expect.any(Object)
      );
    });

    it('should handle missing data in API response', async () => {
      mockedCacheService.get.mockReturnValue(undefined);
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {}
        }
      });

      await expect(provider.getPrice(mockSymbol)).rejects.toThrow(
        new ProviderError('Failed to fetch price from CoinMarketCap', 'API_ERROR')
      );
    });

    it('should handle missing USD quote in API response', async () => {
      mockedCacheService.get.mockReturnValue(undefined);
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            BTC: {
              quote: {}
            }
          }
        }
      });

      await expect(provider.getPrice(mockSymbol)).rejects.toThrow(
        new ProviderError('Failed to fetch price from CoinMarketCap', 'API_ERROR')
      );
    });

    it('should handle API errors', async () => {
      mockedCacheService.get.mockReturnValue(undefined);
      mockedAxios.get.mockRejectedValue(new Error('API Error'));

      await expect(provider.getPrice(mockSymbol)).rejects.toThrow(
        new ProviderError('Failed to fetch price from CoinMarketCap', 'API_ERROR')
      );
    });

    it('should handle undefined/null values in API response', async () => {
      mockedCacheService.get.mockReturnValue(undefined);
      mockedAxios.get.mockResolvedValue({
        data: {
          data: {
            BTC: {
              quote: {
                USD: {
                  price: undefined,
                  percent_change_1h: null,
                  percent_change_24h: undefined,
                  percent_change_7d: null,
                  market_cap: undefined,
                  volume_24h: null,
                  last_updated: undefined
                }
              }
            }
          }
        }
      });

      const result = await provider.getPrice(mockSymbol);

      expect(result).toEqual({
        price: 0,
        percent_change_1h: 0,
        percent_change_24h: 0,
        percent_change_7d: 0,
        market_cap: 0,
        volume_24h: 0,
        last_updated: expect.any(String)
      });
    });
  });
}); 