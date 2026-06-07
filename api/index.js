import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './_lib/routes/auth.js';
import documentRoutes from './_lib/routes/documents.js';
import chatRoutes from './_lib/routes/chat.js';
import './_lib/utils/db.js';

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));

app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

export default app;
