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

import { v2 as cloudinary } from 'cloudinary';

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.get('/api/debug-env', (req, res) => {
  res.json({
    MONGODB_URI: !!process.env.MONGODB_URI,
    JWT_SECRET: !!process.env.JWT_SECRET,
    OPENAI_API_KEY: !!process.env.OPENAI_API_KEY,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '(not set)',
    CLOUDINARY_API_KEY: !!process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: !!process.env.CLOUDINARY_API_SECRET,
    cloudinary_config: cloudinary.config(),
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
