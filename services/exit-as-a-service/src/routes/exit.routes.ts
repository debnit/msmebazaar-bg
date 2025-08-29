import { Router } from 'express';
import { jwtMw } from '@msmebazaar/shared/auth';
import { listPrograms, expressInterest } from '../controllers/exit.controller';

const router = Router();

router.use(jwtMw(process.env.JWT_SECRET || 'default_secret', true));

router.get('/programs', listPrograms);
router.post('/interest', expressInterest);

export default router;
