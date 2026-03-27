import express from 'express';
import cors from 'cors';
import appointmentRoutes from './routes/appointments.js';
import serviceRoutes from './routes/services.js';
import userRoutes from './routes/users.js';
import authRoutes from './routes/auth.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

export default app;
