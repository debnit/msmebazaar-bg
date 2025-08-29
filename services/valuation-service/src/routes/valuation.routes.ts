import { Router } from 'express';
import { jwtMw } from '@msmebazaar/shared/auth';
import { getValuation } from '../controllers/valuation.controller';

const router = Router();

router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

router.post('/calculate', getValuation);

export default router;
