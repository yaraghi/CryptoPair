import { PriceService } from '../priceService';
import { CoinMarketCapProvider } from '../providers/coinMarketCapProvider';
import { AppError } from '../../../utils/errors';
import { PriceData } from '../providers/priceProvider';

jest.mock('../providers/coinMarketCapProvider');

describe('PriceService', () => {
  let priceService: PriceService;
  let mockCoinMarketCapProvider: jest.Mocked<CoinMarketCapProvider>;

  beforeEach(() => {
    mockCoinMarketCapProvider = new CoinMarketCapProvider('test-api-key') as jest.Mocked<CoinMarketCapProvider>;
    priceService = new PriceService([mockCoinMarketCapProvider]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch price successfully from CoinMarketCap', async () => {
    const mockPrice: PriceData = {
      base: 'TON',
      quote: 'USDT',
      price: 2.5,
      percent_change_1h: 1.5,
      percent_change_24h: -2.3,
      percent_change_7d: 5.7,
      market_cap: 1000000,
      volume_24h: 500000,
      last_updated: '2024-03-20T12:00:00Z',
    };

    mockCoinMarketCapProvider.getPrice.mockResolvedValue(mockPrice);

    const result = await priceService.getCryptoPrice('TON', 'USDT');

    expect(result).toEqual(mockPrice);
    expect(mockCoinMarketCapProvider.getPrice).toHaveBeenCalledWith('TON');
  });

  it('should throw error when all providers fail', async () => {
    mockCoinMarketCapProvider.getPrice.mockRejectedValue(new Error('Provider error'));

    await expect(priceService.getCryptoPrice('TON', 'USDT')).rejects.toThrow(AppError);
  });

  it('should handle invalid currency pair', async () => {
    await expect(priceService.getCryptoPrice('', 'USDT')).rejects.toThrow(AppError);
    await expect(priceService.getCryptoPrice('TON', '')).rejects.toThrow(AppError);
  });
}); 