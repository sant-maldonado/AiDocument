import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './_lib/routes/auth.js';
import documentRoutes from './_lib/routes/documents.js';
import chatRoutes from './_lib/routes/chat.js';
import { connectDB } from './_lib/utils/db.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed: ' + err.message });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/debug-env', async (req, res) => {
  let cloudinaryConfig = null;
  try {
    const { getConfig } = await import('./_lib/utils/cloudinary.js');
    cloudinaryConfig = await getConfig();
  } catch (e) {
    cloudinaryConfig = { error: e.message };
  }
  res.json({
    MONGODB_URI: !!process.env.MONGODB_URI,
    JWT_SECRET: !!process.env.JWT_SECRET,
    GROQ_API_KEY: !!process.env.GROQ_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '(not set)',
    CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    cloudinary_config: cloudinaryConfig,
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    method: req.method,
    path: req.path,
    url: req.url,
    originalUrl: req.originalUrl,
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
