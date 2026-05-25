Manual test commands:

```bash
curl.exe -X POST http://localhost:3000/api/cron/archive-daily-staff-logs -H "Content-Type: application/json" -d "{}" ; curl.exe -X POST http://localhost:3000/api/cron/sync-daily-staff-stats -H "Content-Type: application/json" -d "{}"
```