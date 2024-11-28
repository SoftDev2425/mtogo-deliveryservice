import { orderCreatedConsumer } from '../consumers/orderCreatedConsumer';
import { shutdownConsumers } from './consumerManager';

const consumers: { disconnect: () => Promise<void> }[] = [];

async function startConsumers() {
  console.log('Starting Kafka consumers...');

  consumers.push(await orderCreatedConsumer());

  console.log('All consumers started successfully');
}

async function shutdownAll() {
  console.log('Shutting down all consumers...');
  await shutdownConsumers(consumers);
  process.exit(0);
}

process.on('SIGINT', shutdownAll);
process.on('SIGTERM', shutdownAll);

export default startConsumers;
