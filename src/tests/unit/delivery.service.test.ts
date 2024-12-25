import prisma from '../../../prisma/client';
import {
  createDelivery,
  getDeliveryByOrderId,
} from '../../services/delivery.service';

describe('DeliveryService - createDelivery', () => {
  it('should create a delivery', async () => {
    const event = {
      orderId: '12345',
      deliveryAddress: {
        street: '123 Main St',
        city: 'City',
        state: 'State',
        zip: '12345',
      },
      menuItems: ['item1', 'item2'],
    };

    const mockAgents = [{ id: 'agent1' }, { id: 'agent2' }];
    const mockDelivery = {
      id: 'delivery1',
      orderId: '12345',
      agentId: 'agent1',
      deliveryTime: new Date(),
      deliveryAddress: '123 Main St, City, State, 12345',
    };

    // Mock prisma methods
    prisma.deliveryAgent.findMany = jest.fn().mockResolvedValue(mockAgents);
    prisma.delivery.create = jest.fn().mockResolvedValue(mockDelivery);

    // Act
    const result = await createDelivery(event);

    // Assert
    expect(prisma.deliveryAgent.findMany).toHaveBeenCalled();
    expect(prisma.delivery.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          orderId: '12345',
          agentId: 'agent1', // First agent from mockAgents
          deliveryAddress: '123 Main St, City, State, 12345',
        }),
      }),
    );
    expect(result).toEqual(mockAgents[0]); // Should return the assigned agent
  });

  it('should not create a delivery with invalid event data', async () => {});

  it('should assign a delivery agent to a delivery', async () => {});
});

describe('DeliveryService - getDeliveryByOrderId', () => {
  it('should return a delivery by order ID', async () => {
    const mockDelivery = {
      id: 'delivery1',
      orderId: '12345',
      deliveryAddress: '123 Main St, City, State, 12345',
      agent: { id: 'agent1', name: 'Agent One' },
    };

    prisma.delivery.findFirst = jest.fn().mockResolvedValue(mockDelivery);

    const result = await getDeliveryByOrderId('12345');

    expect(prisma.delivery.findFirst).toHaveBeenCalledWith({
      where: { orderId: '12345' },
      include: { agent: true },
    });
    expect(result).toEqual(mockDelivery);
  });

  it('should return null if no delivery is found', async () => {
    prisma.delivery.findFirst = jest.fn().mockResolvedValue(null);

    const result = await getDeliveryByOrderId('invalidOrderId');

    expect(prisma.delivery.findFirst).toHaveBeenCalledWith({
      where: { orderId: 'invalidOrderId' },
      include: { agent: true },
    });
    expect(result).toBeNull();
  });
});
