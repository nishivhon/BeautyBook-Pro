import app from './app.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const PORT = process.env.SERVER_PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n✓ Server running on http://localhost:${PORT}\n`);
  console.log('Services API available at:');
  console.log(`  - GET http://localhost:${PORT}/api/services`);
  console.log(`  - GET http://localhost:${PORT}/api/services/category/:category`);
  console.log(`  - GET http://localhost:${PORT}/api/services/categories/list\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
