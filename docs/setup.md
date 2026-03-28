# NPM Setup Guide

## Prerequisites

Ensure you have the following installed on your system:
- Node.js (v16 or higher)
- npm (comes with Node.js)
- Git

## Installation Steps

1. Navigate to the project root directory:
   ```
   cd BeautyBook-Pro
   ```

2. Install all dependencies:
   ```
   npm install
   ```

## Environment Setup

Create a `.env` file in the project root with the necessary environment variables. Contact the team for the required configuration.

## Running the Application

### Development Mode

Run both frontend and backend simultaneously:

Frontend (React + Vite):
```
npm run dev
```

Backend (Express server):
```
npm run dev:server
```

Run these commands in separate terminals.

### Build for Production

```
npm run build
```

### Preview Production Build

```
npm run preview
```

## Production Server

Start the production server:

```
npm run start:server
```

## Core Dependencies

- React 19.2.4 - UI library
- Vite 8.0.1 - Build tool and dev server
- Express 4.18.2 - Backend framework
- Supabase - Database and authentication
- Tailwind CSS 4.2.2 - Styling
- PostgreSQL - Database driver (via Supabase)
- React Router DOM 7.13.1 - Client-side routing
