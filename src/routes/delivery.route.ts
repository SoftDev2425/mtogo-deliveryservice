import express from 'express';
import deliveryController from '../controllers/delivery.controller';

const router = express.Router();

router.get('/order/:orderId', deliveryController.handleGetDeliveryByOrderId);

export default router;
