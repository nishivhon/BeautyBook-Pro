import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import API handlers
import sendEmailOtpHandler from '../../api/auth/send-email-otp.js';
import verifyEmailOtpHandler from '../../api/auth/verify-email-otp.js';
import forgotPasswordHandler from '../../api/auth/forgot-password.js';
import resendOtpHandler from '../../api/sms/resend-otp.js';
import sendOtpHandler from '../../api/sms/send-otp.js';
import verifyOtpHandler from '../../api/sms/verify-otp.js';
import availableSlotsHandler from '../../api/appointments/read/available-slots.js';
import createAppointmentHandler from '../../api/appointments/create/index.js';
import servicesIndexHandler from '../../api/services/index.js';
import staffsWithAnyHandler from '../../api/staffs/with-any.js';

// Wrapper to convert serverless handlers to Express middleware
const wrapHandler = (handler) => {
  return async (req, res) => {
    try {
      await handler(req, res);
    } catch (error) {
      console.error('Handler error:', error);
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  };
};

// Auth routes
app.post('/api/auth/send-email-otp', wrapHandler(sendEmailOtpHandler));
app.post('/api/auth/verify-email-otp', wrapHandler(verifyEmailOtpHandler));
app.post('/api/auth/forgot-password', wrapHandler(forgotPasswordHandler));

// SMS routes
app.post('/api/sms/send-otp', wrapHandler(sendOtpHandler));
app.post('/api/sms/verify-otp', wrapHandler(verifyOtpHandler));
app.post('/api/sms/resend-otp', wrapHandler(resendOtpHandler));

// Appointments routes
app.get('/api/appointments/available-slots', wrapHandler(availableSlotsHandler));
app.post('/api/appointments/create', wrapHandler(createAppointmentHandler));

// Services routes
app.get('/api/services', wrapHandler(servicesIndexHandler));

// Staffs routes
app.get('/api/staffs/with-any', wrapHandler(staffsWithAnyHandler));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 BeautyBook API Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`✅ CORS enabled for: ${process.env.FRONTEND_URL || 'http://localhost:5173'}\n`);
});
