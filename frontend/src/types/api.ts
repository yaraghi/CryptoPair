export interface ApiResponse<T> {
  data: T;
  status: number;
  message?: string;
}

export interface PriceResponse {
  base: string;
  quote: string;
  price: {
    base: string;
    quote: string;
    price: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    market_cap: number;
    volume_24h: number;
    last_updated: string;
  };
}

export interface ApiErrorResponse {
  status: 'fail';
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
} 