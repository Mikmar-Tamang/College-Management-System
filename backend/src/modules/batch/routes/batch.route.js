import express from 'express';
const router = express.Router();
import batchController from '../controllers/batch.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, batchController.getAll);
router.post('/', authMiddleware, batchController.create);
router.put('/:id', authMiddleware, batchController.update);
router.delete('/:id', authMiddleware, batchController.remove);

export default router;
