import { Router } from 'express';
import {
  createDoctor,
  getDoctorById,
  getDoctors,
  updateDoctor,
} from '../controllers/doctorController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', protect, authorize('admin'), createDoctor);
router.put('/:id', protect, authorize('admin', 'doctor'), updateDoctor);

export default router;
