# BeautyBook Pro - Inline Styles Quick Reference & File Index

## Quick Pattern Reference Map

### 📍 Pattern 1.1: Fixed Full-Screen Overlay/Backdrop
**Locations:**
- [src/components/modal/customer/confirmation_dialog.jsx](src/components/modal/customer/confirmation_dialog.jsx#L27)
- [src/components/modal/customer/otp.jsx](src/components/modal/customer/otp.jsx#L48) - `.otp-overlay`
- [src/pages/auth-callback.jsx](src/pages/auth-callback.jsx#L54) - Inline backdrop
- [src/components/modal/customer/service_details.jsx](src/components/modal/customer/service_details.jsx) - Referenced as `.service-details-overlay`
- [src/components/modal/admin/add_walkin.jsx](src/components/modal/admin/add_walkin.jsx) - Modal overlay
- [src/components/modal/superadmin/create_account.jsx](src/components/modal/superadmin/create_account.jsx#L5) - Fixed overlay with rgba
- [src/components/modal/admin/create_promo.jsx](src/components/modal/admin/create_promo.jsx#L18) - Confirmation dialog backdrop
- [src/pages/superadmin/super_admin_users_dashboard.jsx](src/pages/superadmin/super_admin_users_dashboard.jsx) - Multiple modal outlines

**Key Properties:** position: fixed, inset: 0 OR (top/left/right/bottom: 0), z-index: 1000-1200, display: flex, backgroundColor: rgba(0,0,0,0.5), backdropFilter: blur()

**Suggested Tailwind Class:**
```
.modal-overlay {
  @apply fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm;
}
```

---

### 📍 Pattern 1.2: Modal/Dialog Card Container
**Locations:**
- [src/components/modal/customer/confirmation_dialog.jsx#L31](src/components/modal/customer/confirmation_dialog.jsx#L31) - White theme dialog
- [src/components/modal/superadmin/create_account.jsx#L17](src/components/modal/superadmin/create_account.jsx#L17) - Dark theme modal
- [src/components/modal/admin/create_promo.jsx#L32](src/components/modal/admin/create_promo.jsx#L32) - Dark theme confirmation
- [src/components/modal/customer/service_details.jsx](src/components/modal/customer/service_details.jsx) - Modal container (class-based)
- [src/components/modal/customer/otp.jsx](src/components/modal/customer/otp.jsx#L55) - OTP modal card

**Key Properties:** background, borderRadius: 16px/12px, padding: 32px 24px, maxWidth: varied, boxShadow: 0 20px 60px rgba(...), border: 1px solid rgba(221,144,29,0.2)

**Suggested Tailwind Classes:**
```
.modal-card {
  @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl;
  @apply border border-amber-500/20;
  @apply p-8 max-w-sm w-11/12;
}
```

---

### 📍 Pattern 2.1: Primary Action Button (Amber/Gold)
**Locations:**
- [src/pages/login.jsx](src/pages/login.jsx) - Multiple primary buttons
- [src/pages/register.jsx](src/pages/register.jsx) - Action buttons
- [src/components/modal/customer/phase_one.jsx#L205](src/components/modal/customer/phase_one.jsx#L205) - Continue button
- [src/components/modal/customer/confirmation_dialog.jsx#L57](src/components/modal/customer/confirmation_dialog.jsx#L57) - Keep Booking button
- [src/components/modal/admin/create_promo.jsx](src/components/modal/admin/create_promo.jsx) - Action buttons
- [src/components/modal/superadmin/create_account.jsx](src/components/modal/superadmin/create_account.jsx) - Submit button
- [src/pages/auth-callback.jsx#L96](src/pages/auth-callback.jsx#L96) - Return button

**Key Properties:** padding: 12px 16px OR 10px 20px, background: #dd901d, color: #000 OR white, borderRadius: 8px, fontWeight: 600-700, transition: all 0.2s, hover: { bg: #c47f18, transform: translateY(-2px) OR scale(1.05), shadow }

**Candidate Classes in tailwind.css:**
```css
.btn-primary {
  padding: 9px 20px;
  background: var(--color-amber);
  color: var(--color-black);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 0.875rem;
}

.btn-primary:hover {
  background: var(--color-amber-dark);
  transform: scale(1.05);
}
```

---

### 📍 Pattern 2.2: Secondary Button (Bordered/Amber)
**Locations:**
- [src/components/modal/customer/phase_one.jsx#L226](src/components/modal/customer/phase_one.jsx#L226) - Change button
- [src/components/modal/customer/confirmation_dialog.jsx#L79](src/components/modal/customer/confirmation_dialog.jsx#L79) - Cancel button
- [src/components/modal/admin/create_promo.jsx](src/components/modal/admin/create_promo.jsx) - Secondary buttons
- [src/components/modal/superadmin/create_account.jsx](src/components/modal/superadmin/create_account.jsx) - Secondary actions

**Key Properties:** padding: 10px 18px, background: transparent, color: #dd901d, border: 1px/1.5px solid #dd901d, borderRadius: 8px, hover: { background: rgba(221,144,29,0.1) }

**Suggested Tailwind Class:**
```css
.btn-secondary {
  @apply px-4 py-2 bg-transparent border border-amber-500 text-amber-500 rounded-lg;
  @apply font-semibold text-sm transition-all hover:bg-amber-500/10;
}
```

---

### 📍 Pattern 2.3: Danger/Destructive Button (Red)
**Locations:**
- [src/components/modal/admin/create_promo.jsx#L65](src/components/modal/admin/create_promo.jsx#L65) - Discard button (red)
- [src/pages/superadmin/super_admin_landpage_edit_dashboard.jsx](src/pages/superadmin/super_admin_landpage_edit_dashboard.jsx) - Delete/discard actions

**Key Properties:** padding: 10px 20px, backgroundColor: #ef4444, color: #f5f5f5, border: none, borderRadius: 6px, hover: { backgroundColor: #dc2626 }

**Suggested Tailwind Class:**
```css
.btn-danger {
  @apply px-5 py-2 bg-red-500 text-white rounded transition-colors;
  @apply hover:bg-red-600 active:bg-red-700;
}
```

---

### 📍 Pattern 3.1: Text Input/Select Field with Dark Theme
**Locations:**
- [src/components/modal/superadmin/create_account.jsx#L47](src/components/modal/superadmin/create_account.jsx#L47) - Full Name input
- [src/components/modal/superadmin/create_account.jsx#L68](src/components/modal/superadmin/create_account.jsx#L68) - Email input
- [src/components/modal/superadmin/create_account.jsx#L89](src/components/modal/superadmin/create_account.jsx#L89) - Role select
- [src/components/modal/superadmin/create_account.jsx#L113](src/components/modal/superadmin/create_account.jsx#L113) - Password input
- [src/components/modal/superadmin/create_account.jsx#L155](src/components/modal/superadmin/create_account.jsx#L155) - Confirm password input
- [src/components/modal/customer/phase_one.jsx#L173](src/components/modal/customer/phase_one.jsx#L173) - Date input

**Key Properties:** width: 100%, padding: 12px 16px, backgroundColor: rgba(26,15,0,0.5) OR #231d1a, border: 1px solid rgba(221,144,29,0.3), borderRadius: 8px/10px, color: #f5f5f5, transition: border-color 0.2s, focus: { borderColor: rgba(221,144,29,0.6) }

**Suggested Tailwind Class:**
```css
.input-field {
  @apply w-full px-4 py-3 bg-slate-900/50 text-white placeholder-gray-500;
  @apply border border-amber-500/30 rounded-lg transition-colors;
  @apply focus:outline-none focus:border-amber-500/60;
}

.input-field:focus {
  box-shadow: 0 0 0 3px rgba(221, 144, 29, 0.1);
}
```

---

### 📍 Pattern 4.1: Flex Row Layout
**Frequency:** 20+ instances across all files
**Locations:** Nearly every component uses flexbox for horizontal layouts

**Key Properties:** display: flex, alignItems: center, justifyContent: space-between/center/flex-start/flex-end, gap: 10px-24px

**Already Covered:** Tailwind provides `flex items-center justify-between gap-3` etc.

---

### 📍 Pattern 4.2: Flex Column Layout
**Frequency:** 12+ instances
**Locations:** Form containers, modal bodies, component sections

**Key Properties:** display: flex, flexDirection: column, gap: 12px-20px, alignItems: center/stretch

**Already Covered:** Tailwind provides `flex flex-col items-center gap-3` etc.

---

### 📍 Pattern 5.1: Large Heading (48px)
**Locations:**
- [src/pages/superadmin/super_admin_landpage_edit_dashboard.jsx#L345](src/pages/superadmin/super_admin_landpage_edit_dashboard.jsx#L345) - EditableText large
- [src/components/modal/customer/phase_one.jsx](src/components/modal/customer/phase_one.jsx) - Section headings
- [src/pages/auth-callback.jsx#L75](src/pages/auth-callback.jsx#L75) - Verification heading

**Key Properties:** fontSize: 48px, fontWeight: bold/700, lineHeight: 1.2, textAlign: center, color: white

**Suggested Tailwind Class:**
```
text-6xl font-bold leading-tight text-center text-white
```

---

### 📍 Pattern 5.2: Medium Heading (18-24px)
**Locations:**
- [src/components/modal/superadmin/create_account.jsx#L24](src/components/modal/superadmin/create_account.jsx#L24) - Modal title
- [src/components/modal/admin/create_promo.jsx#L44](src/components/modal/admin/create_promo.jsx#L44) - Confirmation title
- [src/pages/auth-callback.jsx#L63](src/pages/auth-callback.jsx#L63) - Heading styles

**Key Properties:** fontSize: 18-24px, fontWeight: 600-700, marginBottom: 12-24px, color: #1a0f00 OR #f5f5f5

**Suggested Tailwind Class:**
```
text-xl font-bold dark:text-white mb-3
```

---

### 📍 Pattern 5.3: Body Text (14-16px)
**Frequency:** 15+ instances
**Locations:** All text content areas, descriptions

**Key Properties:** fontSize: 14-16px, color: #665544 OR #988f81 OR #b0ada5, lineHeight: 1.5-1.6, fontFamily: Inter

**Suggested Tailwind Class:**
```
text-sm leading-relaxed text-gray-600 dark:text-gray-300
```

---

### 📍 Pattern 5.4: Small Text/Caption (12-13px)
**Locations:**
- [src/pages/auth-callback.jsx#L98](src/pages/auth-callback.jsx#L98) - Footer text

**Key Properties:** fontSize: 12-13px, color: rgba(152,143,129,0.6) OR #999

**Suggested Tailwind Class:**
```
text-xs text-gray-500 dark:text-gray-400
```

---

### 📍 Pattern 6.1: Circular Badge (Count Badge)
**Locations:**
- [src/components/modal/customer/phase_two.jsx#L135](src/components/modal/customer/phase_two.jsx#L135) - Hair service count
- [src/components/modal/customer/phase_two.jsx#L159](src/components/modal/customer/phase_two.jsx#L159) - Nail service count
- [src/components/modal/customer/phase_two.jsx#L183](src/components/modal/customer/phase_two.jsx#L183) - Skincare service count
- [src/components/modal/admin/add_walkin.jsx](src/components/modal/admin/add_walkin.jsx) - Service count badges

**Key Properties:** position: absolute, top: 8px, right: 8px, background: #dd901d, color: black, borderRadius: 50%, width/height: 28px, display: flex, alignItems/justifyContent: center, fontSize: 0.85rem, fontWeight: 700

**Suggested Tailwind Class:**
```css
.badge-count {
  @apply absolute top-2 right-2 w-7 h-7 bg-amber-500 text-black;
  @apply rounded-full flex items-center justify-center text-xs font-bold;
}
```

---

### 📍 Pattern 7.1: Scale on Hover
**Locations:**
- [src/components/modal/customer/phase_two.jsx#L100](src/components/modal/customer/phase_two.jsx#L100) - Service card hover
- [src/components/modal/admin/add_walkin.jsx](src/components/modal/admin/add_walkin.jsx) - Category card hover
- [src/pages/login.jsx](src/pages/login.jsx) - Button hover effects

**Key Properties:** onMouseEnter: { transform: scale(1.03-1.1), boxShadow }, onMouseLeave: { transform: scale(1), boxShadow: none }

**Suggested Tailwind Class:**
```
transition-transform duration-200 hover:scale-105 hover:shadow-lg
```

---

### 📍 Pattern 7.2: Translate Y on Hover
**Locations:**
- [src/pages/login.jsx](src/pages/login.jsx) - Button hover
- [src/components/modal/customer/confirmation_dialog.jsx#L67](src/components/modal/customer/confirmation_dialog.jsx#L67) - Button elevation

**Key Properties:** onMouseEnter: { transform: translateY(-2px to -8px) }, onMouseLeave: { transform: translateY(0) }

**Suggested Tailwind Class:**
```
transition-transform duration-200 hover:-translate-y-0.5
```

---

### 📍 Pattern 7.3: Fade-In Animation
**Locations:**
- [src/components/modal/customer/confirmation_dialog.jsx#L35](src/components/modal/customer/confirmation_dialog.jsx#L35) - animation: fade-up 0.3s ease forwards
- [src/components/toast.jsx#L20](src/components/toast.jsx#L20) - animation: fadeInCenter 0.5s ease forwards

**Key Properties:** animation: fade-up OR fadeInCenter, 0.3-0.5s, ease direction

**Requires Custom Keyframes:**
```css
@keyframes fade-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInCenter {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
```

---

### 📍 Pattern 8.1: Position Absolute with Positioning Props
**Locations:**
- [src/components/modal/superadmin/create_account.jsx#L149](src/components/modal/superadmin/create_account.jsx#L149) - Eye icon position
- [src/components/modal/customer/phase_two.jsx#L131](src/components/modal/customer/phase_two.jsx#L131) - Badge positioning
- Multiple components with positioned overlays

**Key Properties:** position: absolute, top/right/bottom/left: (value)px, transform: translateY(-50%) OR similar

**Suggested Tailwind Class:**
```
absolute top-1/2 right-3 -translate-y-1/2
```

---

### 📍 Pattern 8.2: Invisible/Hidden Spacer
**Locations:**
- [src/components/modal/customer/service_details.jsx#L17](src/components/modal/customer/service_details.jsx#L17) - Spacer for header centering
- [src/components/modal/customer/phase_one.jsx#L85](src/components/modal/customer/phase_one.jsx#L85) - Progress header spacer
- [src/components/modal/customer/phase_two.jsx#L45](src/components/modal/customer/phase_two.jsx#L45) - Title centering spacer

**Key Properties:** visibility: hidden, width: (varies) OR opacity: 0

**Suggested Tailwind Class:**
```
invisible w-5
```

---

## File-by-File Breakdown

### High Priority Refactoring Files

#### 1. create_account.jsx
**Total Inline Styles:** 20+  
**Primary Patterns:** Input fields (20 instances), Modal overlay, Modal card, Typography (headings/labels), Buttons (primary), Position absolute, Transitions  
**Files Path:** [src/components/modal/superadmin/create_account.jsx](src/components/modal/superadmin/create_account.jsx)  
**Estimated Refactoring Time:** 45 minutes

---

#### 2. confirmation_dialog.jsx
**Total Inline Styles:** 15+  
**Primary Patterns:** Modal overlay, Modal card, Buttons (primary & secondary), Typography, Flex layouts, Shadows, Hover states, Animations  
**Files Path:** [src/components/modal/customer/confirmation_dialog.jsx](src/components/modal/customer/confirmation_dialog.jsx)  
**Estimated Refactoring Time:** 30 minutes

---

#### 3. super_admin_landpage_edit_dashboard.jsx
**Total Inline Styles:** 18+  
**Primary Patterns:** EditableText styles, Typography, Position absolute, Transform effects, Flex layouts, Color styling, Input fields  
**Files Path:** [src/pages/superadmin/super_admin_landpage_edit_dashboard.jsx](src/pages/superadmin/super_admin_landpage_edit_dashboard.jsx)  
**Estimated Refactoring Time:** 50 minutes

---

#### 4. phase_one.jsx
**Total Inline Styles:** 12+  
**Primary Patterns:** Input fields, Buttons (primary & secondary), Hover effects (scale), Position absolute, Flex layouts, Typography, Badge positioning  
**Files Path:** [src/components/modal/customer/appointment/phase_one.jsx](src/components/modal/customer/appointment/phase_one.jsx)  
**Estimated Refactoring Time:** 35 minutes

---

#### 5. phase_two.jsx
**Total Inline Styles:** 14+  
**Primary Patterns:** Service cards with hover (scale), Badge positions, Button styles, Transition effects, Position absolute, Flex layouts  
**Files Path:** [src/components/modal/customer/appointment/phase_two.jsx](src/components/modal/customer/appointment/phase_two.jsx)  
**Estimated Refactoring Time:** 40 minutes

---

## Color Substitution Reference

When refactoring, replace these inline color values:

| Inline Value | Variable Name | Use Case(s) |
|---|---|---|
| `#dd901d` | `--color-amber` | Primary buttons, badges, accents, hovers |
| `#c47f18` | `--color-amber-dark` | Button hover state darkening |
| `#0a0908` | `--color-dark-bg` | Primary dark background |
| `#1a1a1a` | `--color-dark-bg-secondary` | Alternative dark background |
| `#f5f5f5` | `--color-light` | Primary light/white text |
| `#988f81` | `--color-tan` | Secondary text, muted labels |
| `#b0ada5` | `--color-tan-light` | Even more muted secondary text |
| `#ef4444` | `--color-red-danger` | Destructive actions |
| `#dc2626` | `--color-red-danger-dark` | Destructive hover state |
| `rgba(221,144,29,0.1)` | `rgba(var(--color-amber-rgb), 0.1)` | Amber backgrounds with opacity |

---

## Button Style Mapping

### Primary Button (.btn-primary)
- **Size Variants:** Regular (12px 16px), Large (14px 24px)
- **Color Options:** Amber (#dd901d), Dark variant (#c47f18)
- **Hover Effects:** Scale(1.05), Shadow glow, translateY(-2px)
- **Uses In Files:** login.jsx, phase_one.jsx, confirmation_dialog.jsx, create_account.jsx, multiple modals

### Secondary Button (.btn-secondary)
- **Border Color:** Amber (#dd901d)
- **Background:** Transparent/Amber with 0.1 opacity on hover
- **Uses In Files:** phase_one.jsx, confirmation_dialog.jsx, create_promo.jsx

### Danger Button (.btn-danger)
- **Background Color:** Red (#ef4444)
- **Hover State:** Darker red (#dc2626)
- **Uses In Files:** create_promo.jsx, potentially delete actions

---

## Implementation Checklist

- [ ] Add custom CSS classes to tailwind.css for all 18 patterns
- [ ] Create custom keyframe animations (fade-up, fadeInCenter)
- [ ] Update z-index standardization documentation
- [ ] Refactor create_account.jsx (20+ patterns)
- [ ] Refactor confirmation_dialog.jsx (15+ patterns)
- [ ] Refactor super_admin_landpage_edit_dashboard.jsx (18+ patterns)
- [ ] Refactor phase_one.jsx (12+ patterns)
- [ ] Refactor phase_two.jsx (14+ patterns)
- [ ] Refactor login.jsx (8+ patterns)
- [ ] Refactor remaining moderate-use files (totaling 25+ patterns)
- [ ] Test all hover/interactive states
- [ ] Verify mobile responsiveness
- [ ] Remove all inline style={{}} attributes
- [ ] Update component documentation
- [ ] Add Storybook stories if available

---

**Document Generated:** April 6, 2026  
**Last Updated:** April 6, 2026  
**Version:** 1.0 - Quick Reference Edition
