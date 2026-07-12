import express from 'express';
const router = express.Router();
import scholarshipController from '../controllers/scholarship.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, scholarshipController.getAll);
router.post('/', authMiddleware, scholarshipController.create);
router.put('/:id', authMiddleware, scholarshipController.update);
router.delete('/:id', authMiddleware, scholarshipController.remove);

export default router;
