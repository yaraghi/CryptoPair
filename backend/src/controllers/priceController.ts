import { Request, Response } from 'express';
import { getCryptoPrice } from '../services/priceService';
import { ValidationError } from '../utils/errors';

export async function fetchPrice(req: Request, res: Response) {
  const { base, quote } = req.query;

  if (!base || !quote) {
    throw new ValidationError('Missing base or quote symbol');
  }

  try {
    const data = await getCryptoPrice(base as string, quote as string);
    return res.json(data);
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Internal Server Error' });
  }
} 