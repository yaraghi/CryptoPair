import NodeCache from 'node-cache';
import { config } from '../../utils/config';

class CacheService {
  private static instance: CacheService;
  private cache: NodeCache;

  private constructor() {
    this.cache = new NodeCache({ stdTTL: config.CACHE_TTL });
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  public get<T>(key: string): T | undefined {
    return this.cache.get<T>(key);
  }

  public set(key: string, value: any): boolean {
    return this.cache.set(key, value);
  }

  public del(key: string): number {
    return this.cache.del(key);
  }
}

export const cacheService = CacheService.getInstance(); 