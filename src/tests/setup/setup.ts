import prisma from '../../../prisma/client';
import createServer from '../../utils/server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let app: any;

global.beforeAll(async () => {
  app = createServer();
});

global.beforeEach(async () => {
  // clear database from all tables
  await prisma.$transaction([
    prisma.delivery.deleteMany(),
    prisma.deliveryAgent.deleteMany(),
    prisma.workingAddress.deleteMany(),
  ]);
});

global.afterAll(async () => {
  console.log('Disconnecting from Prisma...');
  await prisma.$disconnect();
  console.log('Prisma disconnected.');
});
