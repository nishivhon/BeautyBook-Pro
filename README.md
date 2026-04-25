# BeautyBook Pro

A comprehensive digital appointment and customer management system for barbershops, hair salons, and spas. Includes customer-facing booking, real-time queue management, and multi-level admin dashboards.

**Primary Deployment Context:** Sta. Mesa, Manila, Philippines

> **Note:** This system is developed as an academic research project integrating Technology Acceptance Model (TAM), Customer Relationship Management (CRM), and SERVQUAL service quality frameworks. See [MANUSCRIPT_FRAMEWORK.md](docs/MANUSCRIPT_FRAMEWORK.md) for theoretical background and [SYSTEM_LIMITATIONS.md](docs/SYSTEM_LIMITATIONS.md) for important constraints.

## Tech Stack

- **React 19** — UI library
- **Vite** — build tool and dev server
- **React Router DOM** — client-side routing
- **Tailwind CSS** — utility-first styling
- **PostCSS / Autoprefixer** — CSS processing
- **Node.js / Express** — Backend API server
- **Supabase** — Database with migrations

## Features

### Customer Features
- Online appointment booking with service and stylist selection
- Real-time queue notifications ("Your Turn Soon" alerts)
- Discount and promotional code support
- Customer history and profile management
- Services offered:
  - Haircut & Styling, Hair Color, Hair Treatment, Beard Trimming
  - Manicures, Pedicures, Nail Art & Design
  - Facial Treatments, Skin Care
  - Swedish Massage, Deep Tissue Massage, Hot Stone Massage
  - Premium packages (Bridal, Couple's Massage, VIP Lounge)
- Responsive landing page with navbar, hero, how-it-works, services, and contact sections

### Admin Features
- **Admin Dashboard** (`/admin/dashboard`)
  - Real-time metrics cards (Today's Appointments, Queue Status, Revenue, Wait Time)
  - Appointment analytics with trends visualization
  - Services management interface
  - Staff status monitoring dashboard
  - Navigation menu with Home, Services, Live Status, and Staff Status views
  
- **Admin Live Status Dashboard** (`/admin/dashboard/live-status`)
  - Real-time queue visualization
  - Appointment status updates
  - Customer notifications
  
- **Admin Services Dashboard** (`/admin/dashboard/services`)
  - Manage services offered
  - Edit service details
  - Configure pricing and duration
  
- **Super Admin Dashboard** (`/superadmin/dashboard`)
  - Full system analytics and metrics
  - User accounts management
  - Database administration
  - Security settings and controls
  - Landing page content management with title and section editing
  - Add custom titles to hero, how-it-works, services, and footer sections
  - Advanced reporting and revenue tracking
  - Multi-section sidebar navigation

### Authentication
- Magic link-based operator authentication (admin, super admin, staff)
- Role-based access control (RBAC)
- Secure session management with localStorage
- Pre-filled login forms via magic tokens

## Key Limitations & Scope

⚠️ **Please note the following intentional limitations in v1.0:**

- **Payment Processing:** The system does NOT support online payment processing. All payments must be completed in-person at the salon/barbershop.
- **No-Show Policy:** Automatic fine systems for no-shows are NOT implemented. This feature is planned for future versions.
- **Fixed Service Duration:** The system assigns fixed time slots and does NOT automatically adjust for service duration variations. Admins must manually configure service durations.
- **Geographic Focus:** Current deployment context is Sta. Mesa, Manila, Philippines.

See [SYSTEM_LIMITATIONS.md](docs/SYSTEM_LIMITATIONS.md) for detailed explanation of each limitation.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts both the frontend (Vite on port 5173) and the backend server.

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Backend Server

The Express backend runs automatically with `npm run dev`. It handles:
- User authentication and operator management
- Appointment scheduling and management
- Services and staff coordination
- Database migrations and schema management

For backend-specific setup, see [Server Setup](docs/server.md).

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Vercel Deployment

BeautyBook Pro is configured for deployment on Vercel with optimized routing and API handling.

#### Prerequisites for Deployment

1. **Vercel Account** — Create an account at [vercel.com](https://vercel.com)
2. **Git Repository** — Push your code to GitHub, GitLab, or Bitbucket
3. **Environment Variables** — Configure the following in Vercel dashboard:
   ```
   VITE_SUPABASE_URL=<your-supabase-url>
   VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
   API_BASE_URL=<your-api-endpoint>
   NODE_ENV=production
   ```

#### Deployment Steps

1. **Connect Repository**
   - Go to Vercel dashboard → New Project
   - Import your GitHub/GitLab repository
   - Select the project root directory

2. **Configure Environment**
   - Add all required environment variables
   - Ensure Node.js version is set to 18 or higher

3. **Deploy**
   - Click "Deploy"
   - Vercel automatically builds and deploys on every push to main branch

#### Routing Configuration

The application uses the following routing structure on Vercel:

**Frontend Routes:**
- `/` — Landing page
- `/login` — Operator login
- `/register` — Customer registration
- `/admin/dashboard` — Admin dashboard (requires admin role)
- `/admin/dashboard/services` — Services management
- `/admin/dashboard/live-status` — Real-time queue
- `/admin/dashboard/staff-status` — Staff monitoring
- `/superadmin/dashboard` — Super admin dashboard (requires super admin role)
- `/operators/login` — Operator magic link authentication

**API Routes:**
Backend API endpoints are configured via environment variable `API_BASE_URL` and handle:
- `/api/auth/*` — Authentication and operator management
- `/api/appointments/*` — Appointment booking and management
- `/api/services/*` — Services CRUD operations
- `/api/staffs/*` — Staff management
- `/api/sms/*` — SMS OTP handling
- `/api/appointments/[category]` — Service-specific appointments

#### Backend Deployment Options

**Option 1: Express Server on Vercel**
- Deploy backend as separate Vercel project
- Configure frontend to point to backend API URL
- Backend handles all database operations

**Option 2: Serverless API Routes**
- Deploy API routes as Vercel serverless functions
- Place API files in `/api` directory
- Automatic routing: `/api/filename` → function handler
- See `api/` folder structure for available endpoints

#### Environment Variables for Production

Create `.env.production` or configure in Vercel dashboard:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# API Configuration
VITE_API_BASE_URL=https://your-api-domain.com
API_BASE_URL=https://your-api-domain.com

# Database
DATABASE_URL=postgresql://user:password@host/database

# Email Delivery
RESEND_API_KEY=your_resend_key

# Session & Security
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Environment
NODE_ENV=production
```

#### Vercel Configuration

The `vercel.json` file contains deployment configuration:
- Build commands
- API rewrites and routing
- Headers and redirects
- Environment fallbacks

#### Monitoring & Debugging

- **Vercel Dashboard** — Monitor deployments, logs, and analytics
- **Browser Console** — Check for frontend errors
- **Vercel CLI** — Run `vercel logs` to view production logs
- **Error Tracking** — Magic links and authentication errors logged to console

#### Production Checklist

- [ ] Environment variables configured in Vercel
- [ ] Supabase URL and keys updated for production database
- [ ] API endpoints pointed to production backend
- [ ] Email configuration (Resend) set up for production
- [ ] Database migrations applied to production database
- [ ] Magic link credentials updated with production URLs
- [ ] CORS settings configured for production domain
- [ ] Security headers configured in `vercel.json`
- [ ] Sta. Mesa, Manila contact information updated

## Documentation

- **[Manuscript Framework & Theory](docs/MANUSCRIPT_FRAMEWORK.md)** — TAM, CRM, and SERVQUAL theoretical mapping
- **[System Limitations](docs/SYSTEM_LIMITATIONS.md)** — Detailed v1.0 constraints and future roadmap
- **[Geographic Deployment](docs/GEOGRAPHIC_DEPLOYMENT.md)** — Sta. Mesa, Manila deployment context
- **[Admin Dashboard Guide](docs/ADMIN_DASHBOARD_GUIDE.md)** — Admin features and workflow
- **[Super Admin Setup](docs/SUPER_ADMIN_SETUP.md)** — Super admin account and magic link access
- **[Magic Link Guide](docs/MAGIC_LINK_GUIDE.md)** — Magic link authentication system
- **[Operator Auth Guide](docs/OPERATOR_AUTH_GUIDE.md)** — Operator authentication details
- **[Server Setup](docs/server.md)** — Backend server configuration
- **[Setup Guide](docs/setup.md)** — Initial project setup instructions

## Testing

### Magic Link Testing

Magic links are now **dynamically generated** with fresh timestamps on each app load:

1. Start the app: `npm run dev`
2. Open the browser console (F12)
3. Look for the **"🔐 BeautyBook Pro - Magic Links for Testing"** section
4. Copy any Full URL and paste it in your browser
5. Enter the corresponding password when prompted

**Test Accounts:**
- **Admin**: admin@beautybook.pro / admin123
- **Super Admin**: superadmin@beautybook.pro / superadmin123
- **Staff**: staff@beautybook.pro / staff123

### Admin Navigation

All admin dashboards are now fully functional with working navigation:
- **Admin Dashboard**: `/admin/dashboard` — Main admin dashboard with metrics and charts
  - Navigation: Home, Services, Live Status, Staff Status
- **Services**: `/admin/dashboard/services` — Services management
- **Live Status**: `/admin/dashboard/live-status` — Real-time appointment queue
- **Staff Status**: `/admin/dashboard/staff-status` — Staff monitoring
- **Super Admin**: `/superadmin/dashboard` — Multi-section super admin dashboard with full sidebar navigation

### Landing Page Editor (Super Admin)

The Super Admin dashboard includes a powerful landing page editor that allows you to:
- Add custom titles to each section (Hero, How It Works, Services, Footer)
- Edit section headings and descriptions
- Add subheadings and promotional content
- Manage content through an intuitive modal interface
- Preview changes in real-time

## Contact

- **Address:** Canvas City, Abc St., 245 Lot B, Sta. Mesa, Manila, Philippines
- **Phone:** (02) 123-4567
- **Email:** beautybookpro@gmail.com
- **Hours:** Mon–Fri, 8:00 AM – 5:00 PM

---

© 2026 BeautyBook Pro. All rights reserved. | Polytechnic University of the Philippines Institute of Technology
