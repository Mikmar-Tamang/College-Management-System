import express from 'express';
const router = express.Router();
import semesterController from '../controllers/semester.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, semesterController.getAll);
router.post('/', authMiddleware, semesterController.create);
router.put('/:id', authMiddleware, semesterController.update);
router.delete('/:id', authMiddleware, semesterController.remove);

export default router;
