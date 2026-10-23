import { Router } from 'express';
import * as dashboardController from '../controllers/dashboardController.js';
import auth from '../middleware/auth.js';

const router = Router();
router.use(auth);

router.get('/stats', dashboardController.getStats);
router.get('/sla', dashboardController.getSlaStats);

export default router;
