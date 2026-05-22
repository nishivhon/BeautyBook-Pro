#!/usr/bin/env node

import staffStatsCron from '../api/cron/sync-daily-staff-stats.js';

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Manual test runner for api/cron/sync-daily-staff-stats.js

Usage:
  node scripts/test-sync-daily-staff-stats.mjs

What it does:
  - calls the cron handler directly with a mocked POST request
  - prints the HTTP status and JSON response
  - uses your current environment variables for Supabase access

Notes:
  - make sure SUPABASE_URL and SUPABASE_ANON_KEY are set
  - the handler will update staff records if the database is reachable
`);
  process.exit(0);
}

const result = {
  statusCode: 200,
  body: null,
};

const res = {
  status(code) {
    result.statusCode = code;
    return this;
  },
  json(payload) {
    result.body = payload;
    return payload;
  },
};

const req = {
  method: 'POST',
  body: {},
};

try {
  await staffStatsCron(req, res);

  console.log('\nCron test completed');
  console.log(`Status: ${result.statusCode}`);
  console.log('Response:');
  console.log(JSON.stringify(result.body, null, 2));
} catch (error) {
  console.error('\nCron test failed');
  console.error(error);
  process.exitCode = 1;
}