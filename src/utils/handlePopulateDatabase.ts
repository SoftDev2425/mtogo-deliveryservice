import prisma from '../../prisma/client';
import { faker } from '@faker-js/faker';

export const handlePopulateDatabase = async () => {
  try {
    const length = await prisma.deliveryAgent.count();
    if (length > 0) {
      console.log('Database already has delivery agents. Skipping...');
      return;
    }

    const deliveryAgents = Array.from({ length: 50 }).map(() => ({
      name: faker.person.fullName(),
      phone: faker.string.alphanumeric(8),
      email: faker.internet.email(),
      regNo: faker.string.alphanumeric(10),
      accountNo: faker.finance.accountNumber(),
      workingAddress: {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zip: faker.string.numeric(4),
        x: faker.location.latitude(),
        y: faker.location.longitude(),
      },
    }));

    for (const agent of deliveryAgents) {
      await prisma.deliveryAgent.upsert({
        where: { email: agent.email }, // Use email as the unique identifier for checking existence
        update: {}, // Do nothing if it already exists
        create: {
          name: agent.name,
          phone: agent.phone,
          email: agent.email,
          regNo: agent.regNo,
          accountNo: agent.accountNo,
          workingAddress: {
            create: agent.workingAddress,
          },
        },
      });
    }

    console.log(
      'Database populated with 50 delivery agents (created if not exist).',
    );
  } catch (error) {
    console.error('Error populating the database:', error);
  } finally {
    await prisma.$disconnect();
  }
};
