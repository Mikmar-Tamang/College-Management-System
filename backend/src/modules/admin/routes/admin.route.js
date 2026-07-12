import express from 'express';
const router = express.Router();
import adminController from '../controllers/admin.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';
import superAdminMiddleware from '../../../middlewares/superadmin.middleware.js';

router.get('/me', authMiddleware, adminController.getMe);
router.put('/update-profile', authMiddleware, adminController.updateProfile);
router.put('/change-password', authMiddleware, adminController.changePassword);

// Super Admin routes
router.get('/dashboard-stats', authMiddleware, superAdminMiddleware, adminController.getDashboardStats);
router.get('/pending', authMiddleware, superAdminMiddleware, adminController.getPendingAdmins);
router.put('/approve/:id', authMiddleware, superAdminMiddleware, adminController.approveAdmin);
router.delete('/reject/:id', authMiddleware, superAdminMiddleware, adminController.rejectAdmin);
router.get('/colleges', authMiddleware, superAdminMiddleware, adminController.getAllColleges);
router.get('/colleges/banned', authMiddleware, superAdminMiddleware, adminController.getBannedColleges);
router.get('/colleges/:id/details', authMiddleware, superAdminMiddleware, adminController.getCollegeDetails);
router.put('/colleges/:id/ban', authMiddleware, superAdminMiddleware, adminController.banCollege);
router.put('/colleges/:id/unban', authMiddleware, superAdminMiddleware, adminController.unbanCollege);

export default router;
