import express from 'express';
const router = express.Router();
import feePaymentController from '../controllers/feePayment.controller.js';
import authMiddleware from '../../../middlewares/auth.middleware.js';

router.get('/', authMiddleware, feePaymentController.getAll);
router.post('/', authMiddleware, feePaymentController.create);
router.put('/:id', authMiddleware, feePaymentController.update);
router.delete('/:id', authMiddleware, feePaymentController.remove);

export default router;
