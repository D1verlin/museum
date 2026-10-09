import { Router } from 'express';
import {
  createVisit,
  getVisits,
  getVisitByTicketOrId,
  updateVisitStatus,
  deleteVisit
} from '../controllers/visitController.js';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth.js';
import { validateVisitBooking } from '../middleware/validate.js';

const router = Router();

router.post('/', authMiddleware, validateVisitBooking, createVisit);
router.get('/', authMiddleware, getVisits);
router.get('/:ticketOrId', optionalAuthMiddleware, getVisitByTicketOrId);
router.patch('/:id/status', authMiddleware, updateVisitStatus);
router.delete('/:id', authMiddleware, deleteVisit);

export default router;
