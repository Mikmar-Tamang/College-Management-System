import express from 'express';
const router = express.Router();
import programController from '../controllers/program.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, programController.getAll);
router.post('/', authMiddleware, programController.create);
router.put('/:id', authMiddleware, programController.update);
router.delete('/:id', authMiddleware, programController.remove);

export default router;
