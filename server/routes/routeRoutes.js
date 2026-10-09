import { Router } from 'express';
import {
  calculateRoute,
  getPresets,
  getPresetByKey,
  createPreset
} from '../controllers/routeController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = Router();

router.post('/calculate', calculateRoute);
router.get('/presets', getPresets);
router.get('/presets/:key', getPresetByKey);
router.post('/presets', authMiddleware, adminOnly, createPreset);

export default router;
