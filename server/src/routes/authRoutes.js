import { Router } from 'express';
import { getCurrentUser, loginUser, registerPatient } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerPatient);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);

export default router;
