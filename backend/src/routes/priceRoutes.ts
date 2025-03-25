import express from 'express';
import { fetchPrice } from '../controllers/priceController';

const router = express.Router();

// GET /api/prices?base=TON&quote=USDT
router.get('/prices', fetchPrice);

export default router; 