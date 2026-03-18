import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import userRoutes from './routes/userRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import requestRoutes from './routes/requestRoutes.js';

dotenv.config();
connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:5173',
    /\.vercel\.app$/ // Matches any vercel.app subdomain
  ],
  credentials: true,
}));

// Request logger for debugging API issues
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - Origin: ${req.get('Origin')}`);
  next();
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Serve frontend static files
const frontendBuildPath = path.join(__dirname, '../client/dist');
app.use(express.static(frontendBuildPath));

app.get('*', (req, res) => {
  res.sendFile(path.join(frontendBuildPath, 'index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
