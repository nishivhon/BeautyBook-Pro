# Toast Messages Testing Guide

## Overview
All toast messages now appear at the **top center** of the page (80px from top). Here's a complete list of all toast messages in the system and how to test them.

---

## 1. **Customer - Create Account Modal** 
📍 File: `src/components/modal/customer/create-account.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| `OTP sent to {email}` | Click "Send OTP" with email verification selected | success | 2800ms |
| `OTP sent to {phone}` | Click "Send OTP" with phone verification selected | success | 2800ms |
| `✓ Account created successfully!` | Complete OTP verification | success | 1500ms |

### How to Test:
1. Navigate to the landpage
2. Scroll down and click any "Book Appointment" or "Get Started" button
3. Opens customer create account modal
4. Fill in form with:
   - Full Name: `John Doe`
   - Select "Email" or "Phone"
   - Enter email/phone
   - Password: `Test@1234`
   - Confirm Password: `Test@1234`
5. Click "Send OTP" → **Toast appears at top**

---

## 2. **Customer - OTP Verification**
📍 File: `src/components/modal/customer/otp.jsx`

### Toast Messages:
| Message | Trigger | Type |
|---------|---------|------|
| Custom message from verify endpoint | Successfully verify OTP | success |
| Error message from API | Failed OTP verification | error |

### How to Test:
1. Complete step 1 of account creation (OTP sent toast appears)
2. Get OTP from email/SMS
3. Enter OTP code in the modal
4. Click "Verify" → **Toast shows verification result**

---

## 3. **Customer - Register Page**
📍 File: `src/pages/register.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| `OTP sent to {email}` | Submit registration form with email | info | 10000ms |
| `OTP sent to {phone}` | Submit registration form with phone | info | 10000ms |
| `✅ Phone verified successfully! Proceeding to booking...` | Verify phone OTP | info | varies |
| `✅ Email verified successfully! Proceeding to booking...` | Verify email OTP | info | varies |
| Custom error message | API call fails | error | varies |

### How to Test:
1. Navigate to `/register` (Register page)
2. Fill in registration details
3. Choose email or phone verification
4. Click "Send OTP" → **Toast with OTP sent message**
5. Complete OTP verification → **Toast with success message**

---

## 4. **Customer - Appointment Booking (Phase 4)**
📍 File: `src/components/modal/customer/appointment/phase_four.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| `Booking Confirmed!` | User confirms booking details | success | 2000ms |
| `Booking Successful!` | Booking is completed | success | 2000ms |

### How to Test:
1. Navigate to customer dashboard
2. Click "Book Appointment" button
3. Complete phases 1-3 (select time, services, details)
4. In phase 4 (confirmation), click confirm → **Toast appears**
5. Complete booking → **Second toast appears**

---

## 5. **Staff Dashboard**
📍 File: `src/pages/staff/staff_dashboard.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| Custom action messages | Various staff actions | info | 2600ms |

### How to Test:
1. Login as Staff member
2. Perform actions like:
   - Mark customer as done
   - Complete service
   - Update status
3. **Toast appears at top center** (amber color)

---

## 6. **Staff - Queue Dashboard**
📍 File: `src/pages/staff/staff_queue_dashboard.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| Custom queue action messages | Queue management actions | info | 2500ms |

### How to Test:
1. Login as Staff
2. Navigate to Queue Dashboard
3. Perform queue actions → **Toast shows status**

---

## 7. **Staff - Service Dashboard**
📍 File: `src/pages/staff/staff_service_dashboard.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| Service availability toggled | Toggle service on/off | info | 2500ms |

### How to Test:
1. Login as Staff
2. Go to Service Dashboard
3. Toggle any service on/off → **Toast appears at top**

---

## 8. **Super Admin - Users Dashboard**
📍 File: `src/pages/superadmin/super_admin_users_dashboard.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| `No new notifications` | Click Notifications bell | info | 2800ms |
| `Settings coming soon` | Click Settings icon | info | 2800ms |
| `Failed to fetch staff data` | API call fails | error | 2800ms |

### How to Test:
1. Login as Super Admin
2. Go to Users Dashboard
3. Click **Notifications (bell icon)** → Toast: "No new notifications"
4. Click **Settings (gear icon)** → Toast: "Settings coming soon"

---

## 9. **Super Admin - Services Dashboard**
📍 File: `src/pages/superadmin/super_admin_services_dashboard.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| `No new notifications` | Click Notifications bell | info | 2800ms |
| `Settings coming soon` | Click Settings icon | info | 2800ms |

### How to Test:
1. Login as Super Admin
2. Go to Services Dashboard
3. Click **Notifications** → Toast appears
4. Click **Settings** → Toast appears

---

## 10. **Super Admin - Security Dashboard**
📍 File: `src/pages/superadmin/super_admin_security_dashboard.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| `No new notifications` | Click Notifications bell | info | 2800ms |
| `Settings coming soon` | Click Settings icon | info | 2800ms |

### How to Test:
1. Login as Super Admin
2. Go to Security Dashboard
3. Click **Notifications** or **Settings** → **Toast appears at top**

---

## 11. **Super Admin - Logs Dashboard**
📍 File: `src/pages/superadmin/super_admin_logs_dashboard.jsx`

### Toast Messages:
| Message | Trigger | Type | Duration |
|---------|---------|------|----------|
| `No new notifications` | Click Notifications bell | info | 2800ms |
| `Settings coming soon` | Click Settings icon | info | 2800ms |

### How to Test:
1. Login as Super Admin
2. Go to Logs Dashboard
3. Click header action buttons

---

## Toast Component Types & Styling

### Reusable Toast Component
📍 File: `src/components/toast.jsx`

**Supported Types:**
- `success`: Green gradient (✓)
- `error`: Red gradient (✕)
- `info`: Blue gradient (ℹ)

**Props:**
```jsx
<Toast 
  message="Your message"
  type="success" | "error" | "info"
  duration={milliseconds}
  isVisible={boolean}
/>
```

---

## CSS Toast Classes

### `.toast`
- Used in most super admin dashboards
- **Position:** Top 80px, Center
- **Color:** Amber border
- **Transition:** 0.25s

### `.queue-toast`
- Used in staff queue dashboard
- **Position:** Top 80px, Center
- **Color:** Amber
- **Transform:** Slide from top

### `.service-toast`
- Used in staff service dashboard
- **Position:** Top 80px, Center
- **Color:** Amber (#dd901d)

### `.cdb-toast`
- Used in customer dashboard
- **Position:** Top 80px, Center
- **Color:** Green (#22c55e)
- **Animation:** Slide down

---

## Quick Testing Checklist

- [ ] **Create Account Toast**: Register new customer → Send OTP
- [ ] **Booking Toast**: Complete booking in customer shell
- [ ] **Staff Toast**: Perform actions in staff dashboard
- [ ] **Queue Toast**: Manage queue in queue dashboard
- [ ] **Super Admin Toast**: Click notifications/settings buttons
- [ ] **All toasts appear at TOP CENTER** (80px from top)
- [ ] **Toast auto-dismisses** after set duration
- [ ] **Toast has proper styling** with rounded corners and borders

---

## Testing Environment Setup

### Prerequisites:
1. Have valid test accounts for each role:
   - Customer account
   - Staff account
   - Super Admin account

2. Backend must be running
3. API endpoints must be responding

### Test Data:
```
Customer Test Account:
- Email: test@example.com
- Phone: +1234567890

Staff Test Account:
- Email: staff@beautybookpro.com

Super Admin Account:
- Email: superadmin@beautybookpro.com
```

---

## Troubleshooting Toast Issues

### Toast not appearing?
1. Check browser console for errors
2. Verify toast state is being set correctly
3. Check z-index (should be high enough)
4. Verify CSS is loaded

### Toast appearing in wrong position?
1. Check if previous `.bottom` styles are still applied
2. Verify `.top: 80px` and `left: 50%` in CSS
3. Check transform property: `translateX(-50%)`

### Toast disappearing too quickly?
1. Adjust `duration` prop in Toast component
2. Check `setTimeout` values in dismissal functions
3. Verify duration is passed correctly

---

## Recent Changes (May 2, 2026)

✅ All toasts repositioned from **bottom-right** to **top-center**
✅ Added reusable Toast component from `src/components/toast.jsx`
✅ Updated CSS classes: `.toast`, `.queue-toast`, `.service-toast`, `.cdb-toast`
✅ Animations updated for top-down slide effect
✅ Color schemes: green (success), red (error), blue (info)
