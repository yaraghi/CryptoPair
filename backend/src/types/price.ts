export interface PriceData {
  base: string;
  quote: string;
  price: {
    base: string;
    quote: string;
    price: number;
    percent_change_1h?: number;
    percent_change_24h: number;
    percent_change_7d?: number;
    market_cap: number;
    volume_24h: number;
    last_updated: string;
  };
}

export interface PriceProvider {
  getPrice(base: string, quote: string): Promise<PriceData>;
}

export interface CacheConfig {
  ttl: number;
} 