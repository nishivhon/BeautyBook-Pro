# BeautyBook Pro

A comprehensive digital appointment and customer management system for barbershops, hair salons, and spas. Includes customer-facing booking, real-time queue management, and multi-level admin dashboards with analytics, services management, and staff coordination.

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
  - Real-time metrics (Today's Appointments, Queue Status, Revenue, Wait Time)
  - Appointment analytics with trends charts
  - Services management
  - Staff status monitoring
  - Navigation between dashboard views
  
- **Super Admin Dashboard** (`/superadmin/dashboard`)
  - Full system analytics and metrics
  - User accounts management
  - Database administration
  - Security settings
  - Landing page management
  - Advanced reporting and revenue tracking

### Authentication
- Magic link-based operator authentication (admin, super admin, staff)
- Role-based access control (RBAC)
- Secure session management with localStorage
- Pre-filled login forms via magic tokens

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

## Documentation

- **[Admin Dashboard Guide](docs/ADMIN_DASHBOARD_GUIDE.md)** — Admin features and workflow
- **[Super Admin Setup](docs/SUPER_ADMIN_SETUP.md)** — Super admin account and magic link access
- **[Magic Link Guide](docs/MAGIC_LINK_GUIDE.md)** — Magic link authentication system
- **[Operator Auth Guide](docs/OPERATOR_AUTH_GUIDE.md)** — Operator authentication details
- **[Server Setup](docs/server.md)** — Backend server configuration
- **[Setup Guide](docs/setup.md)** — Initial project setup instructions

## Testing

### Admin Login

Visit the browser console when the app starts to find magic link URLs for testing:

```
👑 Super Admin Test Link
Email: superadmin@beautybook.pro
Password: superadmin123
Full URL: http://localhost:5173/operators/login?token=...
```

Or login directly at `/operators/login` with test credentials (see Super Admin Setup docs).

## Contact

- **Address:** Canvas City, Abc St., 245 Lot B
- **Phone:** (02) 123-4567
- **Email:** beautybookpro@gmail.com
- **Hours:** Mon–Fri, 8:00 AM – 5:00 PM

---

© 2026 BeautyBook Pro. All rights reserved. | Polytechnic University of the Philippines Institute of Technology

