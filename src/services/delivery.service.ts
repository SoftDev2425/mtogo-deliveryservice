import prisma from '../../prisma/client';

interface DeliveryAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface DeliveryEvent {
  orderId: string;
  deliveryAddress: DeliveryAddress;
  menuItems: unknown;
}

export async function createDelivery(event: DeliveryEvent) {
  try {
    const { orderId, deliveryAddress, menuItems } = event;

    // validate the event
    if (!orderId || !deliveryAddress || !menuItems) {
      throw new Error('Invalid event data');
    }

    // get a list of available delivery agents - for now we randomly pick an agent
    // pick random agent from prisma.deliveryAgent.findMany()
    const deliveryAgent = await prisma.deliveryAgent.findMany().then(agents => {
      const randomIndex = Math.floor(Math.random() * agents.length);
      return agents[randomIndex];
    });

    // create a delivery
    await prisma.delivery.create({
      data: {
        orderId: orderId as string,
        agentId: deliveryAgent.id,
        deliveryAddress: `${deliveryAddress.street || ''}, ${deliveryAddress.city || ''}, ${deliveryAddress.state || ''}, ${deliveryAddress.zip || ''}`,
      },
    });

    return deliveryAgent;
  } catch (error) {
    console.error('Error creating delivery:', error);
    throw error;
  }
}
