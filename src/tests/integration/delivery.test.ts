import supertest from 'supertest';
import { app } from '../setup/setup';
import { createTestDelivery } from '../../utils/createTestDelivery';

describe('Integration Tests', () => {
  describe('/api/delivery/order/:orderId', () => {
    it('should return delivery details for a valid order ID', async () => {
      const testDelivery = await createTestDelivery(); // Ensure the delivery is created

      const response = await supertest(app).get(
        `/api/delivery/order/${testDelivery.orderId}`,
      ); // Use the correct order ID

      console.log(response.body);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(
        expect.objectContaining({
          id: testDelivery.id,
          orderId: testDelivery.orderId,
          deliveryAddress: testDelivery.deliveryAddress,
        }),
      );
    });

    it('should return 404 if no delivery is found', async () => {
      const response = await supertest(app).get(
        '/api/delivery/order/invalidOrderId',
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ message: 'Delivery not found' });
    });
  });
});
