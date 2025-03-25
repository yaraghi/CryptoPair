export interface PriceData {
  price: number;
  percent_change_1h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  market_cap: number;
  volume_24h: number;
  last_updated: string;
  base?: string;
  quote?: string;
}

export interface PriceProvider {
  getPrice(symbol: string): Promise<PriceData>;
} 