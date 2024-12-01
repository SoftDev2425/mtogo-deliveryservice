import { Request, Response } from 'express';
import { getDeliveryByOrderId } from '../services/delivery.service';

async function handleGetDeliveryByOrderId(req: Request, res: Response) {
  const { orderId } = req.params;

  try {
    const delivery = await getDeliveryByOrderId(orderId);

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    return res.status(200).json(delivery);
  } catch (error) {
    console.error('Error getting delivery:', error);
    return res.status(500).json({ message: 'Error getting delivery' });
  }
}

export default {
  handleGetDeliveryByOrderId,
};
