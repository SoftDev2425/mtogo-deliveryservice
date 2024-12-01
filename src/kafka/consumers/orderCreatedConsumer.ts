import { EachMessagePayload } from 'kafkajs';
import { createConsumer } from '../consumerManager';
import { createDelivery } from '../../services/delivery.service';
import { produceEvent } from '../../utils/produceEvent';

export async function orderCreatedConsumer() {
  const consumer = await createConsumer('deliveryService_emailConsumer');

  await consumer.subscribe({
    topic: 'deliveryService_orderCreated',
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
      try {
        console.log(topic, partition, message);

        const value = message.value?.toString();

        if (value) {
          const event = JSON.parse(value);

          console.log(
            `orderCreatedConsumer received message from topic: ${topic}`,
            event,
          );

          // create a delivery and assign it to a delivery agent
          const deliveryAgent = await createDelivery(event);

          // send email notification to delivery agent - this should be an event that notifcation service listens to
          await produceEvent(
            'notificationService_emailNotificationDeliveryAgent',
            {
              recipentEmail: deliveryAgent.email,
              orderId: event.orderId,
              customerId: event.customerId,
              restaurantData: event.restaurantData,
              deliveryAddress: event.deliveryAddress,
              menuItems: event.menuItems,
              deliveryAgentName: deliveryAgent.name,
            },
          );

          // simulate 30 seconds delay for delivery
          produceEvent('orderStatusUpdate', {
            orderId: event.orderId,
            status: 'YOUR_FOOD_IS_ON_THE_WAY',
          });

          setTimeout(() => {
            produceEvent('orderStatusUpdate', {
              orderId: event.orderId,
              status: 'YOUR_FOOD_HAS_BEEN_DELIVERED',
            });
          }, 3000);
        }

        console.log('Message processed successfully');
      } catch (error) {
        console.error('Error processing message:', error);
      }
    },
  });

  return consumer;
}
