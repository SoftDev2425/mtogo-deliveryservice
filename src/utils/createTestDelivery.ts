import prisma from '../../prisma/client';

export const createTestDelivery = async () => {
  // Create a test delivery agent first
  const testAgent = await prisma.deliveryAgent.create({
    data: {
      id: 'test-agent-id',
      name: 'Test Agent',
      phone: '123-456-7890',
      email: 'test@test.com',
      accountNo: '123456789',
      regNo: '1234',
      workingAddress: {
        create: {
          street: '123 Test St',
          city: 'Test City',
          x: 0,
          y: 0,
          zip: '12345',
        },
      },
    },
  });

  // Now create the delivery
  return await prisma.delivery.create({
    data: {
      orderId: 'test-order-id',
      deliveryTime: new Date(),
      agentId: testAgent.id, // Reference the test agent
      deliveryAddress: '123 Test St, Test City, TS, 12345',
    },
  });
};
