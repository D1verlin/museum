import { Router } from 'express';
import {
  getAllHalls,
  getHallById,
  createHall,
  updateHall
} from '../controllers/hallController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllHalls);
router.get('/:id', getHallById);
router.post('/', authMiddleware, adminOnly, createHall);
router.put('/:id', authMiddleware, adminOnly, updateHall);

export default router;
