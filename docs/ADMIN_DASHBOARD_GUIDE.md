# Admin Dashboard Setup Guide

## 🎯 Quick Access

### Test Admin Account
```
Email:    admin@beautybook.pro
Password: admin123
Role:     admin (shop owner/operator)
```

### Magic Link (Copy & Paste in Browser)
```
/operators/login?token=YWRtaW5AYmVhdXR5Ym9vay5wcm98MTc3NDc5OTUxMjQyN3xhYmNkZWYxMjN4eXo
```

**Full Local URL:**
```
http://localhost:5174/operators/login?token=YWRtaW5AYmVhdXR5Ym9vay5wcm98MTc3NDc5OTUxMjQyN3xhYmNkZWYxMjN4eXo
```

---

## 📊 Dashboard Overview

The admin dashboard provides complete business insights:

### 📈 Key Statistics
- **Today's Appointments**: 24 appointments scheduled
- **In Queue Now**: 8 customers waiting
- **Revenue Today**: ₱12,450 (↑15%)
- **Avg. Wait Time**: 18 minutes (↓5 mins)

### 📋 Live Queue Management
- **Current Service**: Shows 3 clients being served now
- **Up Next**: Preview of incoming clients with wait time estimates
- **Queue Count**: View total queue size

### 👥 Staff Status Panel
- Real-time staff availability monitoring
- Next available time for each staff member
- Status indicators: Serving, Available, On Break

### 📊 Summary Statistics
- **Completed**: 16 appointments
- **In Progress**: 3 active services
- **Pending**: 5 upcoming appointments
- **Cancelled**: 2 cancellations

### 📥 Analytics & Reporting
- Download detailed reports
- View business metrics
- Track trends and patterns

---

## 🔐 How to Access Admin Dashboard

### Step 1: Use the Magic Link
Copy and paste the magic link above into your browser OR manually navigate to:
```
http://localhost:5174/operators/login?token=YWRtaW5AYmVhdXR5Ym9vay5wcm98MTc3NDc5OTUxMjQyN3xhYmNkZWYxMjN4eXo
```

### Step 2: Login
The email field will be **pre-filled** with `admin@beautybook.pro`

Enter password:
```
admin123
```

### Step 3: Access Dashboard
After successful login, you'll be automatically redirected to:
```
/admin/dashboard
```

### Step 4: Logout
Click the **"Log Out"** button in the top-right corner of the navbar to:
- Clear your session
- Return to the home page

---

## 🛠️ Technical Details

### Route Protection
The admin dashboard is protected by `<ProtectedRoute>`

**Only accessible by:**
- Users with role = `admin`
- Users with role = `super admin`

**If a staff member tries to access:**
- They'll be redirected to the home page
- Error message not shown (security best practice)

### Session Management
- Session stored in `localStorage` as `operator_user`
- Contains: email, role, token, login timestamp
- Persists across page refreshes
- Cleared on logout

### Magic Link Validation
- Token expires after 24 hours
- Base64 encoded format: `email|timestamp|random_string`
- Validated on login page before showing form
- Invalid/expired tokens show "Access Restricted" message

---

## 📁 File Structure

```
src/
├── pages/
│   ├── login.jsx                    # Magic link validation & login
│   └── admin/
│       └── admin_dashboard.jsx      # Admin dashboard (new)
├── components/
│   └── ProtectedRoute.jsx           # Route protection with role check
├── services/
│   ├── operatorAuth.js              # Session management
│   └── magicLink.js                 # Magic link generation/validation
└── app.jsx                          # Routes including admin dashboard
```

---

## 🔄 Login Flow Diagram

```
1. Click Magic Link
   ↓
2. Validate Token
   ├─ Valid: Show login form (email pre-filled)
   └─ Invalid: Show "Access Restricted" → Redirect home
   ↓
3. Enter Password & Submit
   ↓
4. Validate Credentials (mock validation)
   ├─ Success: Redirect based on role
   │   ├─ Admin role → /admin/dashboard
   │   ├─ Super admin role → /admin/dashboard
   │   └─ Staff role → / (home - TODO: create staff dashboard)
   └─ Failed: Show error message
   ↓
5. Logout (optional)
   ↓
6. Redirect to Home
```

---

## 🎨 Dashboard Components

### AdminNavbar
- Logo with scissors icon
- Navigation links (Home, Services, Queue Live Status, Staff Status)
- User info dropdown
- Logout button

### PageHeader
- Dashboard title and date
- Action buttons (Notifications, Settings)
- Stats cards with badges

### LiveQueue Panel
- Current appointments section
- Up next queue section
- View all queue button

### Sidebar Panels
1. **Staff Status** - Shows all staff members and availability
2. **Summary** - Quick count of appointment statuses
3. **Analytics** - Reports and download option

---

## ⚙️ Development Notes

### Temporary Mock Data
All dashboard data is currently **mocked** for demonstration:
- Appointment numbers are hardcoded
- Queue items are sample data
- Staff statuses are demo values

### Future Implementation
Connect to backend API to:
- Fetch real appointment data
- Update live queue
- Monitor actual staff status
- Generate real reports

### Adding Features
To add new dashboard features:

1. Create new component in admin dashboard file
2. Import data from backend API
3. Add styling to `src/styles/tailwind.css` (if needed)
4. Add route/navigation if required

---

## 🆘 Troubleshooting

### Can't Access Dashboard
**Problem**: "Access Restricted" message
- **Solution**: Use the full magic link provided above
- Ensure email and password match: `admin@beautybook.pro` / `admin123`

### Session Lost
**Problem**: Logged out unexpectedly
- **Solution**: Clear browser storage and login again
- Check if localStorage is enabled

### Wrong Role Redirects to Home
**Problem**: Logged in but redirected to home instead of dashboard
- **Solution**: Ensure your account has `admin` role
- Test with the admin credentials provided

### Styling Issues
**Problem**: Dashboard looks broken
- **Solution**: Ensure Tailwind CSS is built
- Check browser console for errors
- Clear cache (Ctrl+Shift+Delete)

---

## 📝 Next Steps

1. **Create Staff Dashboard** - `/staff/dashboard` for staff members
2. **Generate Magic Links** - Build super admin page to create new magic links
3. **Database Integration** - Store appointments, staff, and magic links in DB
4. **Real-time Updates** - WebSocket integration for live queue updates
5. **Analytics** - Implement actual reporting features

---

**Last Updated**: March 25, 2026
