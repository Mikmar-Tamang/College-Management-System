import express from 'express';
const router = express.Router();
import studentController from '../controllers/student.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, studentController.getAll);
router.post('/', authMiddleware, studentController.create);
router.put('/:id', authMiddleware, studentController.update);
router.delete('/:id', authMiddleware, studentController.remove);

export default router;
