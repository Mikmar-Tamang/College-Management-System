import express from 'express';
const router = express.Router();
import authController from '../controllers/auth.controller.js';

router.post('/register', authController.registerAdmin);
router.post('/login', authController.loginAdmin);
router.post('/logout', authController.logoutAdmin)

router.post('/verify-email', authController.verifyEmail);

router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-code', authController.verifyResetCode);
router.post('/reset-password', authController.resetPassword);

export default router;