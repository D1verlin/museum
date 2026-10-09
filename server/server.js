import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/database.js';
import { seedDatabase } from './seed/seedData.js';
import { User, Hall, Exhibit, Visit } from './models/index.js';

import authRoutes from './routes/authRoutes.js';
import exhibitRoutes from './routes/exhibitRoutes.js';
import hallRoutes from './routes/hallRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import visitRoutes from './routes/visitRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSwagger } from './config/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3017;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[API] ${req.method} ${req.originalUrl} ${res.statusCode} (${duration}ms)`);
    }
  });
  next();
});

app.get('/api/health', async (req, res) => {
  try {
    const [usersCount, exhibitsCount, hallsCount, visitsCount] = await Promise.all([
      User.count(),
      Exhibit.count(),
      Hall.count(),
      Visit.count()
    ]);

    res.json({
      success: true,
      data: {
        status: 'UP',
        museum: 'Национальный художественный музей Республики Беларусь (НХМ РБ)',
        database: 'SQLite (Sequelize)',
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        stats: {
          users: usersCount,
          halls: hallsCount,
          exhibits: exhibitsCount,
          visits: visitsCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: error.message
      }
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/exhibits', exhibitRoutes);
app.use('/api/halls', hallRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/visits', visitRoutes);

setupSwagger(app);

app.use('/api', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ENDPOINT_NOT_FOUND',
      message: `Маршрут ${req.originalUrl} не найден в API музея`
    }
  });
});

const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(distPath, 'index.html'));
    }
    next();
  });
}

app.use(errorHandler);

export const startServer = async () => {
  try {
    await connectDB();
    await seedDatabase(false);

    const server = app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`[SERVER] Сервер НХМ РБ запущен на порту ${PORT}`);
      console.log(`[DOCS]   Swagger UI:   http://localhost:${PORT}/api/docs`);
      console.log(`[HEALTH] Health check: http://localhost:${PORT}/api/health`);
      console.log(`[AUTH]   Администратор: admin@artmuseum.by / AdminPass123!`);
      console.log(`[AUTH]   Посетитель:    visitor@artmuseum.by / VisitorPass123!`);
      console.log(`====================================================`);
    });

    return server;
  } catch (error) {
    console.error('Fatal startup error:', error);
    process.exit(1);
  }
};

const isTestRun = process.env.NODE_ENV === 'test' || process.argv.some(arg => String(arg).includes('test'));
if (!isTestRun) {
  startServer();
}

export default app;
