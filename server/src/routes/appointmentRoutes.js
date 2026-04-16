import { Router } from 'express';
import {
  cancelAppointment,
  createAppointment,
  getAppointments,
  updateAppointmentStatus,
} from '../controllers/appointmentController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);
router.get('/', getAppointments);
router.post('/', authorize('patient'), createAppointment);
router.patch('/:id/status', authorize('doctor', 'admin'), updateAppointmentStatus);
router.patch('/:id/cancel', authorize('patient', 'doctor', 'admin'), cancelAppointment);

export default router;
