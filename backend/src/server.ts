import express, { Request, Response } from 'express';
import cors from 'cors';
import apiRoutes from './routes/apiRoutes.ts';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Mount modular v1 API routes
app.use('/api/v1', apiRoutes);

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'Framesports Modular Analysis API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`[Framesports API] Modular server running on http://localhost:${PORT}`);
});
