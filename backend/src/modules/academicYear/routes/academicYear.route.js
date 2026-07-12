import express from 'express';
const router = express.Router();
import academicYearController from '../controllers/academicYear.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, academicYearController.getAll);
router.post('/', authMiddleware, academicYearController.create);
router.put('/:id', authMiddleware, academicYearController.update);
router.delete('/:id', authMiddleware, academicYearController.remove);

export default router;
