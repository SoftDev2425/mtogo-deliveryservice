import { Express, Request, Response } from 'express';
import DeliveryRouter from './routes/delivery.route';

function routes(app: Express) {
  app.get('/', (_req: Request, res: Response) =>
    res.send(`Hello from MTOGO: Test Service!`),
  );

  // Register API routes
  app.use('/api/delivery', DeliveryRouter);

  // Catch unregistered routes
  app.all('*', (req: Request, res: Response) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
  });
}

export default routes;
