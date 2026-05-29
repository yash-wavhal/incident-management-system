import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import http from 'http';

import connectDB from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import incidentRoutes from './routes/incident.routes.js';

import { notFound, errorHandler } from './middleware/error.middleware.js';

import { initSocket } from './sockets/socket.js';
import cookieParser from 'cookie-parser';
import { startEscalationJob } from './jobs/escalation.job.js';

dotenv.config();

connectDB();

const app = express();

const server = http.createServer(app);

initSocket(server);
startEscalationJob();

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/auth', authRoutes);

app.use('/api/incidents', incidentRoutes);

app.use(notFound);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
