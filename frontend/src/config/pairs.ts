export interface CurrencyPair {
    base: string;
    quote: string;
  }
  
  export const currencyPairs: CurrencyPair[] = [
    { base: 'TON', quote: 'USDT' },
    { base: 'USDT', quote: 'TON' },
  ];
  