import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as authController from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import { registerValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator, changePasswordValidator } from '../validators/index.js';

const router = Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many login attempts, try again later' },
});

const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many password reset attempts, try again later' },
});

router.post('/register', registerValidator, authController.register);
router.post('/login', loginLimiter, loginValidator, authController.login);
router.post('/logout', auth, authController.logout);
router.post('/refresh', authController.refresh);
router.post('/forgot-password', resetLimiter, forgotPasswordValidator, authController.forgotPassword);
router.post('/reset-password', resetLimiter, resetPasswordValidator, authController.resetPassword);
router.post('/change-password', auth, changePasswordValidator, authController.changePassword);
router.get('/me', auth, authController.getMe);

export default router;
