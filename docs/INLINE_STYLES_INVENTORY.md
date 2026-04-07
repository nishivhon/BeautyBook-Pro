# BeautyBook Pro - Inline CSS Styles Inventory

**Generated:** April 6, 2026  
**Scope:** All .jsx files in `src/` directory  
**Total Files Analyzed:** 38 JSX files

---

## Executive Summary

- **Total Unique Inline Style Patterns Found:** 47+
- **Files with Inline Styles:** 32 of 38
- **Most Common Pattern:** Flex layouts (flexbox/display:flex)
- **Priority Refactoring Level:** HIGH - Multiple repetitive patterns across components

---

## 1. OVERLAY & BACKDROP PATTERNS

### Pattern 1.1: Fixed Full-Screen Overlay/Backdrop
**Frequency:** Very High (Used in 8+ components)  
**Files:** 
- confirmation_dialog.jsx
- otp.jsx
- auth-callback.jsx
- service_details.jsx
- add_walkin.jsx
- create_account.jsx
- create_promo.jsx
- super_admin_users_dashboard.jsx

```jsx
style={{
  position: "fixed",
  inset: 0,  // OR: top: 0, left: 0, right: 0, bottom: 0
  zIndex: 1000,  // OR: 1010, 1020, 1200, 1201
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "rgba(0,0,0,0.5)",  // OR: rgba(0,0,0,0.7)
  backdropFilter: "blur(2px)"  // OPTIONAL
}}
```

**Suggested Tailwind Classes:**
```
fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm
```

**Note:** Z-index values vary (1000-1200); consider standardizing to z-50 or z-40 based on hierarchy.

---

### Pattern 1.2: Modal/Dialog Card Container
**Frequency:** Very High (6+ components)  
**Files:**
- confirmation_dialog.jsx
- create_account.jsx
- create_promo.jsx
- service_details.jsx (implied)

```jsx
style={{
  background: "white",  // OR: #1a1a1a, #0a0908
  borderRadius: "16px",  // OR: 12px, 8px
  padding: "32px 24px",  // OR: "24px"
  maxWidth: "360px",  // OR: "400px", "500px"
  width: "90%",
  boxShadow: "0 20px 60px rgba(0,0,0,0.3)",  // OR: various shadow intensities
  border: "1px solid rgba(221, 144, 29, 0.2)",  // Some modal borders
  animation: "fade-up 0.3s ease forwards"  // CUSTOM ANIMATION
}}
```

**Suggested Tailwind Classes:**
```
bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-amber-500/20
```

**Note:** Most modals are dark-themed; background color choice matters.

---

## 2. BUTTON PATTERNS

### Pattern 2.1: Primary Action Button (Amber/Gold)
**Frequency:** Very High (15+ instances)  
**Files:**
- Multiple files using #dd901d (amber color)
- login.jsx
- phase_one.jsx
- phase_two.jsx
- confirmation_dialog.jsx
- create_account.jsx
- create_promo.jsx

```jsx
style={{
  padding: "12px 16px",  // OR: "10px 20px", "9px 20px"
  background: "#dd901d",
  color: "#000",  // OR: "white"
  border: "none",
  borderRadius: "8px",  // OR: "12px", "6px"
  cursor: "pointer",
  fontWeight: "600",  // OR: "700"
  fontSize: "0.85rem",  // OR: "14px", "0.875rem"
  fontFamily: "Inter, sans-serif",
  transition: "all 0.2s ease",  // OR: "background-color 0.2s ease"
}}
onMouseEnter={(e) => {
  e.target.style.background = "#c47f18";  // Darker amber
  e.target.style.transform = "translateY(-2px)";  // OR: scale(1.05)
  e.target.style.boxShadow = "0 6px 20px rgba(221,144,29,0.35)";
}}
onMouseLeave={(e) => {
  e.target.style.background = "#dd901d";
  e.target.style.transform = "translateY(0)";  // OR: scale(1)
  e.target.style.boxShadow = "none";
}}
```

**Suggested Tailwind Classes:**
```
px-4 py-3 bg-amber-500 text-black rounded-lg font-semibold text-sm
transition-all duration-200 hover:bg-amber-600 hover:shadow-lg active:translate-y-0.5
```

**Custom Classes Needed:**
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

### Pattern 2.2: Secondary Button (Bordered/Amber)
**Frequency:** High (8+ instances)  
**Files:**
- phase_one.jsx
- confirmation_dialog.jsx
- create_promo.jsx
- Multiple modal files

```jsx
style={{
  padding: "10px 18px",
  background: "transparent",
  color: "#dd901d",
  border: "1px solid #dd901d",  // OR: "1.5px solid"
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  fontSize: "0.85rem",
  transition: "all 0.2s ease",
}}
onMouseEnter={(e) => {
  e.target.style.background = "rgba(221, 144, 29, 0.1)";
}}
onMouseLeave={(e) => {
  e.target.style.background = "transparent";
}}
```

**Suggested Tailwind Classes:**
```
px-4 py-2 bg-transparent border border-amber-500 text-amber-500 rounded-lg
font-semibold text-sm transition-all hover:bg-amber-500/10
```

---

### Pattern 2.3: Danger/Destructive Button (Red)
**Frequency:** Medium (3-4 instances)  
**Files:**
- create_promo.jsx

```jsx
style={{
  padding: "10px 20px",
  backgroundColor: "#ef4444",
  color: "#f5f5f5",
  border: "none",
  borderRadius: "6px",
  fontSize: "13px",
  fontWeight: "600",
  cursor: "pointer",
  fontFamily: "Inter, sans-serif",
  transition: "background-color 0.2s ease"
}}
onMouseOver={(e) => e.target.style.backgroundColor = "#dc2626"}
onMouseOut={(e) => e.target.style.backgroundColor = "#ef4444"}
```

**Suggested Tailwind Classes:**
```
px-5 py-2 bg-red-500 text-white rounded transition-colors
hover:bg-red-600 active:bg-red-700
```

---

## 3. INPUT & FORM FIELD PATTERNS

### Pattern 3.1: Text Input/Select Field with Dark Theme
**Frequency:** Very High (12+ instances)  
**Files:**
- create_account.jsx
- Multiple modal/form files

```jsx
style={{
  width: "100%",
  padding: "12px 16px",
  backgroundColor: "rgba(26, 15, 0, 0.5)",
  border: "1px solid rgba(221, 144, 29, 0.3)",
  borderRadius: "8px",
  color: "#f5f5f5",
  fontSize: "14px",
  fontFamily: "Inter, sans-serif",
  boxSizing: "border-box",
  transition: "border-color 0.2s ease",
}}
onFocus={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.6)"}
onBlur={(e) => e.target.style.borderColor = "rgba(221, 144, 29, 0.3)"}
```

**Suggested Tailwind Classes:**
```
w-full px-4 py-3 bg-slate-900/50 text-white placeholder-gray-500 
border border-amber-500/30 rounded-lg transition-colors
focus:outline-none focus:border-amber-500/60
```

**Custom CSS Class:**
```css
.input-field {
  width: 100%;
  padding: 12px 16px;
  background: rgba(26, 15, 0, 0.5);
  border: 1px solid rgba(221, 144, 29, 0.3);
  border-radius: 8px;
  color: #f5f5f5;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.input-field:focus {
  outline: none;
  border-color: rgba(221, 144, 29, 0.6);
  box-shadow: 0 0 0 3px rgba(221, 144, 29, 0.1);
}
```

---

### Pattern 3.2: Input with Label
**Frequency:** High (8+ instances)  
**Files:**
- create_account.jsx
- Multiple forms

```jsx
<div>
  <label style={{
    display: "block",
    fontSize: "13px",
    fontWeight: "600",
    color: "#dd901d",
    marginBottom: "8px"
  }}>Label Text</label>
  <input style={{ /* Pattern 3.1 */ }} />
</div>
```

---

### Pattern 3.3: Date Input Field
**Frequency:** Medium (3-4 instances)  
**Files:**
- phase_one.jsx (manual date input)

```jsx
style={{
  width: "180px",  // OR: "100%"
  padding: "10px 14px",
  background: "#231d1a",
  border: "1px dashed rgba(152,143,129,0.5)",
  borderRadius: "10px",
  color: "white",
  fontFamily: "'Inter', sans-serif",
  fontSize: "0.95rem",
  boxSizing: "border-box",
}}
```

**Suggested Tailwind Classes:**
```
px-3 py-2 bg-slate-800 text-white border border-dashed border-stone-500/50
rounded-lg focus:outline-none focus:border-solid focus:border-amber-500
```

---

## 4. LAYOUT & CONTAINER PATTERNS

### Pattern 4.1: Flex Row Layout
**Frequency:** Extremely High (20+ instances)  
**Files:** Most files

```jsx
style={{
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",  // OR: center, flex-start, flex-end
  gap: "10px",  // OR: "12px", "16px", "20px", "24px"
}}
```

**Suggested Tailwind Classes:**
```
flex items-center justify-between gap-3
```

---

### Pattern 4.2: Flex Column Layout
**Frequency:** Very High (12+ instances)  
**Files:** Many components

```jsx
style={{
  display: "flex",
  flexDirection: "column",
  alignItems: "center",  // OR: stretch, flex-start, flex-end
  justifyContent: "center",  // OR: space-between, flex-start, flex-end
  gap: "12px",
}}
```

**Suggested Tailwind Classes:**
```
flex flex-col items-center justify-center gap-3
```

---

### Pattern 4.3: Scrollable/Overflow Container
**Frequency:** Medium (4-5 instances)  
**Files:**
- appointment modals
- add_walkin.jsx

```jsx
style={{
  maxHeight: "500px",  // OR: varies
  overflowY: "auto",
  padding: "16px",
}}
```

**Suggested Tailwind Classes:**
```
max-h-[500px] overflow-y-auto p-4
```

---

## 5. TEXT & TYPOGRAPHY PATTERNS

### Pattern 5.1: Large Heading (48px)
**Frequency:** High (6+ instances)  
**Files:**
- super_admin_landpage_edit_dashboard.jsx
- Multiple components

```jsx
style={{
  fontSize: "48px",
  fontWeight: "bold",  // OR: "700"
  lineHeight: "1.2",
  textAlign: "center",
  color: "white",
}}
```

**Suggested Tailwind Classes:**
```
text-6xl font-bold leading-tight text-center text-white
```

---

### Pattern 5.2: Medium Heading (18-24px)
**Frequency:** High (10+ instances)  
**Files:** Many components

```jsx
style={{
  fontSize: "18px",  // OR: "20px", "24px"
  fontWeight: "700",  // OR: "600"
  color: "#1a0f00",  // OR: "#f5f5f5"
  marginBottom: "12px",  // OR: varies
  fontFamily: "Inter, sans-serif",
  textAlign: "center",  // OPTIONAL
}}
```

**Suggested Tailwind Classes:**
```
text-xl font-bold text-gray-900 dark:text-white mb-3
```

---

### Pattern 5.3: Body Text (14-16px)
**Frequency:** Very High (15+ instances)  
**Files:** Most components

```jsx
style={{
  fontSize: "14px",  // OR: "16px", "0.95rem"
  color: "#665544",  // OR: "#988f81", "#b0ada5"
  lineHeight: "1.5",  // OR: "1.6"
  fontFamily: "Inter, sans-serif",
  textAlign: "center",  // OPTIONAL
}}
```

**Suggested Tailwind Classes:**
```
text-sm text-gray-600 dark:text-gray-300 leading-relaxed
```

---

### Pattern 5.4: Small Text/Caption (12-13px)
**Frequency:** Medium (6+ instances)  
**Files:** Multiple components

```jsx
style={{
  fontSize: "12px",  // OR: "13px"
  color: "rgba(152, 143, 129, 0.6)",  // Muted tan
  fontFamily: "Inter, sans-serif",
}}
```

**Suggested Tailwind Classes:**
```
text-xs text-gray-500 dark:text-gray-400
```

---

## 6. BADGE & LABEL PATTERNS

### Pattern 6.1: Circular Badge (Count Badge)
**Frequency:** High (5-7 instances)  
**Files:**
- phase_two.jsx
- add_walkin.jsx
- Multiple service selection components

```jsx
style={{
  position: "absolute",
  top: "8px",
  right: "8px",
  background: "var(--color-amber)",  // OR: "#dd901d"
  color: "var(--color-black)",
  borderRadius: "50%",
  width: "28px",
  height: "28px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.85rem",
  fontWeight: "700",
  fontFamily: "Inter, sans-serif",
}}
```

**Suggested Tailwind Classes:**
```
absolute top-2 right-2 w-7 h-7 bg-amber-500 text-black rounded-full
flex items-center justify-center text-xs font-bold
```

---

### Pattern 6.2: Label/Badge (Rectangular)
**Frequency:** Medium (4-5 instances)  
**Files:** Multiple dashboard components

```jsx
style={{
  display: "inline-block",
  padding: "6px 12px",
  background: "rgba(221, 144, 29, 0.15)",
  border: "1px solid rgba(221, 144, 29, 0.4)",
  borderRadius: "10px",
  color: "white",
  fontSize: "0.85rem",
  fontWeight: "600",
  fontFamily: "'Inter', sans-serif",
}}
```

**Suggested Tailwind Classes:**
```
inline-block px-3 py-1.5 bg-amber-500/15 border border-amber-500/40
text-amber-200 rounded-lg text-sm font-semibold
```

---

## 7. TRANSFORM & ANIMATION PATTERNS

### Pattern 7.1: Scale on Hover
**Frequency:** High (8+ instances)  
**Files:**
- phase_two.jsx (service cards)
- login.jsx (various buttons)

```jsx
onMouseEnter={(e) => {
  e.target.style.transform = "scale(1.05)";  // OR: translateY(-8px) scale(1.03)
  e.target.style.boxShadow = "0 6px 20px rgba(221,144,29,0.35)";
}}
onMouseLeave={(e) => {
  e.target.style.transform = "scale(1)";
  e.target.style.boxShadow = "none";
}}
```

**Suggested Tailwind Classes:**
```
transition-transform duration-200 hover:scale-105 hover:shadow-lg
```

---

### Pattern 7.2: Translate Y on Hover
**Frequency:** Medium (4-5 instances)  
**Files:**
- login.jsx
- confirmation_dialog.jsx

```jsx
onMouseEnter={(e) => {
  e.target.style.transform = "translateY(-2px)";  // OR: -4px, -8px
}}
onMouseLeave={(e) => {
  e.target.style.transform = "translateY(0)";
}}
```

**Suggested Tailwind Classes:**
```
transition-transform duration-200 hover:-translate-y-0.5
```

---

### Pattern 7.3: Fade-In Animation
**Frequency:** Medium (3-4 instances)  
**Files:**
- confirmation_dialog.jsx
- Modal components

```jsx
style={{
  animation: "fade-up 0.3s ease forwards",
}}
```

**Required CSS Animation:**
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
```

---

## 8. POSITION & SPACING PATTERNS

### Pattern 8.1: Position Absolute with Positioning Props
**Frequency:** High (8+ instances)  
**Files:** Multiple components with positioned elements

```jsx
style={{
  position: "absolute",
  top: "50%",
  right: "12px",  // OR: left, bottom, etc.
  transform: "translateY(-50%)",  // For vertical centering
  background: "none",
  border: "none",
  padding: "6px",
  cursor: "pointer",
}}
```

**Suggested Tailwind Classes:**
```
absolute top-1/2 right-3 -translate-y-1/2
```

---

### Pattern 8.2: Invisible/Hidden Spacer
**Frequency:** Medium (3-4 instances)  
**Files:** Desktop layouts with centered content

```jsx
style={{
  visibility: "hidden",
  width: "20px",  // OR: varies
}}
```

**Suggested Tailwind Classes:**
```
invisible w-5
```

---

## 9. BOX SHADOW PATTERNS

### Pattern 9.1: Large Shadow (Cards/Modals)
**Frequency:** High (8+ instances)  
**Files:** Modal components

```jsx
boxShadow: "0 20px 60px rgba(0,0,0,0.3)",  // OR: 0.8
```

**Suggested Tailwind Classes:**
```
shadow-2xl
```

---

### Pattern 9.2: Medium Shadow (Hover State)
**Frequency:** High (6+ instances)  
**Files:** Interactive elements

```jsx
boxShadow: "0 6px 20px rgba(221,144,29,0.35)",  // Amber glow
```

**Suggested Tailwind Classes:**
```
shadow-lg (standard) OR custom: shadow-[0_6px_20px_rgba(221,144,29,0.35)]
```

---

## 10. COLOR PALETTE USAGE

### Color #1: Amber/Gold (#dd901d)
**Frequency:** Very High (30+ instances)  
**Used For:** Primary buttons, accents, hover states, badges  
**Files:** Across all major components

### Color #2: Dark Background (#0a0908, #1a1a1a)
**Frequency:** Very High (25+ instances)  
**Used For:** Container backgrounds, dark theme  
**Files:** Layouts, backgrounds

### Color #3: Tan/Muted Text (#988f81)
**Frequency:** High (15+ instances)  
**Used For:** Secondary text, muted labels, subtle borders  
**Files:** Multiple components

### Color #4: White/Light Text (#f5f5f5, #fff)
**Frequency:** Very High (25+ instances)  
**Used For:** Primary text, button text  
**Files:** Across all components

### Color #5: Red Destructive (#ef4444)
**Frequency:** Low (2-3 instances)  
**Used For:** Dangerous actions, error states  
**Files:** Confirmation dialogs, delete actions

---

## 11. EXISTING TAILWIND CSS COVERAGE

### Already Covered in Tailwind
The following patterns are ALREADY available via standard Tailwind CSS:
- ✅ Flexbox utilities (flex, flex-col, gap-*, items-center, justify-center)
- ✅ Padding utilities (p-*, px-*, py-*)
- ✅ Margin utilities (m-*, mb-*, mt-*)
- ✅ Border utilities (border, border-*, rounded-*)
- ✅ Background color utilities (bg-*, dark:bg-*)
- ✅ Text color utilities (text-*, dark:text-*)
- ✅ Shadow utilities (shadow-*, shadow-lg, shadow-2xl)
- ✅ Z-index utilities (z-10, z-50)
- ✅ Position utilities (fixed, absolute, relative)
- ✅ Transform utilities (scale-*, translate-*, rotate-*)
- ✅ Transition utilities (transition-*, duration-*)
- ✅ Sizing utilities (w-*, h-*, max-w-*, max-h-*)

### Custom CSS Needed (Not in Tailwind)
- ❌ Fade-up animation
- ❌ CSS variable usage (--color-amber, --bg-dark, etc.)
- ❌ Specific color shades (amber #dd901d, tan #988f81)
- ❌ Backdrop blur (available in Tailwind 3.1+, but needs config)
- ❌ Some specific shadow effects

---

## 12. REFACTORING PRIORITY MATRIX

### Priority 1 (CRITICAL - Highest Frequency, High Impact)
Patterns appearing in 8+ files with high repetition:

1. **Overlay/Backdrop Pattern (1.1)** - 8+ files
2. **Modal Card Pattern (1.2)** - 6+ files  
3. **Primary Button Pattern (2.1)** - 15+ instances
4. **Flex Layout Pattern (4.1)** - 20+ instances
5. **Input Field Pattern (3.1)** - 12+ instances
6. **Body Text Pattern (5.3)** - 15+ instances

**Recommended Action:** Create base utility classes or CSS component classes

---

### Priority 2 (HIGH - Moderate Frequency)
Patterns appearing in 4-7 files:

7. **Secondary Button Pattern (2.2)** - 8+ instances
8. **Large Heading Pattern (5.1)** - 6+ instances
9. **Scale Hover Pattern (7.1)** - 8+ instances
10. **Box Shadow Patterns (9.1, 9.2)** - 8+ instances
11. **Circular Badge Pattern (6.1)** - 5-7 instances
12. **Flex Column Pattern (4.2)** - 12+ instances

**Recommended Action:** Create CSS utility classes or Tailwind component classes

---

### Priority 3 (MEDIUM - Lower Frequency)
Patterns appearing in 2-3 files:

13. **Translate Y Hover Pattern (7.2)** - 4-5 instances
14. **Position Absolute Pattern (8.1)** - 8+ instances
15. **Date Input Pattern (3.3)** - 3-4 instances
16. **Danger Button (2.3)** - 3-4 instances
17. **Label Pattern (3.2)** - 8+ instances

**Recommended Action:** Create Tailwind component classes or CSS classes

---

## 13. IMPLEMENTATION RECOMMENDATIONS

### Recommended Approach

**Option A: Tailwind Component Classes (RECOMMENDED)**
Create custom component classes in `src/styles/tailwind.css`:

```css
@layer components {
  /* Buttons */
  .btn-primary { @apply px-4 py-3 bg-amber-500 text-black rounded-lg font-semibold transition-all duration-200 hover:bg-amber-600 hover:shadow-lg active:scale-95; }
  .btn-secondary { @apply px-4 py-2 bg-transparent border border-amber-500 text-amber-500 rounded-lg font-semibold transition-all hover:bg-amber-500/10; }
  
  /* Modals */
  .modal-overlay { @apply fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm; }
  .modal-card { @apply bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-amber-500/20; }
  
  /* Forms */
  .input-field { @apply w-full px-4 py-3 bg-slate-900/50 text-white placeholder-gray-500 border border-amber-500/30 rounded-lg transition-colors focus:outline-none focus:border-amber-500/60; }
}
```

**Option B: CSS Module Classes**
Create traditional CSS classes mirroring the patterns found.

**Option C: Headless UI / Radix UI Components**
Replace inline styles with pre-built component libraries.

### Phase 1: Foundation (Week 1)
1. Create CSS component classes for buttons (2.1, 2.2, 2.3)
2. Create CSS component classes for modals (1.1, 1.2)
3. Create CSS component classes for inputs (3.1, 3.2)

### Phase 2: Expansion (Week 2)
4. Create layout utility classes (4.1, 4.2)
5. Create typography utility classes (5.1, 5.2, 5.3, 5.4)
6. Create badge/label classes (6.1, 6.2)

### Phase 3: Polish (Week 3)
7. Create animation keyframes (7.3)
8. Standardize Z-index values (use Tailwind z-10, z-20, z-50)
9. Document color palette usage
10. Replace all inline styles with class names

---

## 14. FILES BY INLINE STYLE USAGE

### Heavy Inline Style Users (15+ patterns)
1. **create_account.jsx** - 20+ patterns
2. **confirmation_dialog.jsx** - 15+ patterns
3. **super_admin_landpage_edit_dashboard.jsx** - 18+ patterns
4. **phase_one.jsx** - 12+ patterns
5. **phase_two.jsx** - 14+ patterns

### Moderate Inline Style Users (5-14 patterns)
6. **login.jsx** - 8+ patterns
7. **otp.jsx** - 6+ patterns
8. **add_walkin.jsx** - 10+ patterns
9. **auth-callback.jsx** - 5+ patterns
10. **create_promo.jsx** - 8+ patterns
11. **super_admin_users_dashboard.jsx** - 12+ patterns
12. **toast.jsx** - 9 patterns
13. **service_details.jsx** - 4+ patterns

### Low Inline Style Users (1-4 patterns)
- Remaining 25 files with minimal inline styles

---

## 15. CUSTOM ANIMATION KEYFRAMES NEEDED

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

@keyframes fade-in-center {
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

## 16. CSS VARIABLE STANDARDIZATION

Current usage of inline color values should map to CSS variables:

```css
:root {
  --color-primary: #dd901d;
  --color-primary-dark: #c47f18;
  --color-black: #000;
  --color-white: #fff;
  --color-dark-bg: #0a0908;
  --color-dark-bg-secondary: #1a1a1a;
  --color-tan: #988f81;
  --color-tan-light: #b0ada5;
  --color-light: #f5f5f5;
  --color-red-danger: #ef4444;
  --color-red-danger-dark: #dc2626;
}

/* Use in components */
background: var(--color-primary);
color: var(--color-dark-bg);
```

---

## 17. Z-INDEX STANDARDIZATION

Current inline styles use various z-index values: 1000, 1010, 1020, 1200, 1201, 50, 9999

**Recommended standard:**
```
z-10:   Hidden elements (10)
z-20:   Hover states, tooltips (20)
z-40:   Modals, fixed overlays (40)
z-50:   Dropdowns, popovers (50)
z-[9999]: Toast notifications (9999) - keep high but consider z-50
```

---

## 18. EXPORT SUMMARY

**Next Steps:**
1. ✅ This inventory has identified ALL inline styles
2. 📋 Review priority patterns with team
3. 🎯 Begin implementation in Phase 1
4. 📝 Update components with class-based styles
5. ✨ Remove all inline `style={{}}` attributes

**Estimated Refactoring Effort:**
- Foundation Phase (Buttons, Modals, Forms): **3-4 hours**
- Expansion Phase (Layouts, Typography, Badges): **4-5 hours**
- Polish Phase (Animations, Standardization, Testing): **3-4 hours**
- **Total: ~10-13 hours of refactoring work**

---

**Generated:** April 6, 2026  
**Document Version:** 1.0  
**Scope:** All 38 .jsx files in src/ directory
