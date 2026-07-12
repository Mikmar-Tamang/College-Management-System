import express from 'express';
const router = express.Router();
import departmentController from '../controllers/department.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, departmentController.getAll);
router.post('/', authMiddleware, departmentController.create);
router.put('/:id', authMiddleware, departmentController.update);
router.delete('/:id', authMiddleware, departmentController.remove);

export default router;
