import { Router } from 'express';
import {
  getAllExhibits,
  getExhibitById,
  createExhibit,
  updateExhibit,
  deleteExhibit
} from '../controllers/exhibitController.js';
import { authMiddleware, adminOnly } from '../middleware/auth.js';

const router = Router();

router.get('/', getAllExhibits);
router.get('/:id', getExhibitById);
router.post('/', authMiddleware, adminOnly, createExhibit);
router.put('/:id', authMiddleware, adminOnly, updateExhibit);
router.delete('/:id', authMiddleware, adminOnly, deleteExhibit);

export default router;
