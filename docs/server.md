# Server Folder Structure

## Overview

The server folder contains the Express.js backend application that handles API requests, authentication, database connections, and business logic for the BeautyBook application.

## Folder Structure

```
server/
├── src/
│   ├── app.js              - Express app configuration
│   ├── server.js           - Server entry point
│   ├── db.js               - Database connection setup
│   ├── config/             - Configuration files
│   ├── controllers/        - Request handlers
│   ├── middlewares/        - Custom middleware
│   ├── models/             - Data models
│   ├── routes/             - API route definitions
│   │   ├── auth.js
│   │   ├── appointments.js
│   │   ├── services.js
│   │   └── users.js
│   └── services/           - Business logic layer
```

## Core Files

### server.js
- Main entry point for the server
- Loads environment variables from `.env` file
- Starts the Express server on port defined by `SERVER_PORT` (default: 5000)
- Command: `npm run start:server`

### app.js
- Configures Express application
- Sets up middleware (CORS, JSON parsing)
- Defines API routes:
  - `/api/auth` - Authentication endpoints
  - `/api/appointments` - Appointment management
  - `/api/services` - Services management
  - `/api/users` - User management
  - `/api/health` - Health check endpoint

### db.js
- PostgreSQL connection pool setup
- Uses environment variables for database credentials
- Connects to Supabase PostgreSQL database
- Handles connection errors

## Folder Descriptions

### /routes
Contains Express route handlers for different API endpoints:
- **auth.js** - Login, signup, magic links, verification
- **appointments.js** - Appointment CRUD operations
- **services.js** - Beauty services listing and management
- **users.js** - User profile and management operations

### /controllers
Should contain request handler logic separated from routes. Example:
```javascript
export const getAppointments = async (req, res) => { ... }
export const createAppointment = async (req, res) => { ... }
```

### /middlewares
Should contain custom middleware for:
- Authentication verification
- Request validation
- Error handling
- Logging

### /models
Should contain database query functions or ORM models:
```javascript
export const getUserById = async (id) => { ... }
export const createUser = async (userData) => { ... }
```

### /services
Should contain business logic separated from route handlers:
```javascript
export const bookAppointment = async (appointmentData) => { ... }
export const calculatePrice = async (serviceId, duration) => { ... }
```

### /config
Should contain configuration files for different environments

### database.sql
SQL file containing the complete database schema

## Folder Workflow

### Request Flow Through Folders

When a request comes into the API, it follows this path:

**1. routes/** → Receives the request
- Entry point for all API calls
- Defines endpoints (GET, POST, PUT, DELETE)
- Extracts request parameters and body
- Routes to appropriate controller

**2. middlewares/** → Validates request
- Checks authentication tokens
- Validates input data
- Adds context to request (user info, etc.)
- Returns errors for invalid requests

**3. controllers/** → Processes request logic
- Receives validated request from routes
- Calls service layer functions
- Prepares response format
- Handles request-response lifecycle

**4. services/** → Executes business logic
- Performs complex operations (calculations, data processing)
- Calls model layer for data access
- Implements business rules
- Returns processed data to controller

**5. models/** → Accesses database
- Writes SQL queries or ORM calls
- Communicates with database via db.js connection pool
- Returns raw data from database
- Handles database errors

**6. db.js** → Database connection
- Maintains connection pool to Supabase
- Executes queries from models
- Returns results back to models

### Example Workflow: Booking an Appointment

```
1. User submits appointment form
   ↓
2. POST /api/appointments (route receives request)
   ↓
3. Authentication middleware validates user token
   ↓
4. Input validation middleware checks data format
   ↓
5. appointmentController.createAppointment() processes request
   ↓
6. appointmentService.bookAppointment() executes business logic:
   - Check stylist availability
   - Calculate total price
   - Validate time slot
   ↓
7. appointmentModel.create() saves to database
   ↓
8. db.js executes INSERT query on Supabase
   ↓
9. Database returns confirmation
   ↓
10. Response flows back up through layers to frontend
```

## Development Workflow

### Starting Development Server
```bash
npm run dev:server
```
Uses Node.js watch mode to automatically restart on file changes.

### Starting Both Frontend and Backend
Run in separate terminals:
```bash
# Terminal 1 - Frontend
npm run dev
```
```bash
# Terminal 2 - Backend
npm run dev:server
```

## API Health Check

Test if server is running:
```bash
curl http://localhost:5000/api/health
```

Returns: `{ "status": "Server is running" }`
