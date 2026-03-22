# 🎨 Blue & White Theme - Quick Reference Guide

## Color Codes Quick Copy

```
PRIMARY BLUE:           #1E40AF
PRIMARY DARK:           #1A3A8A
PRIMARY LIGHT:          #3B82F6
BLUE GRADIENT:          linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)

LIGHT BG:              #EFF6FF
PAGE BG:               #F8FAFC
BORDER:                #E2E8F0

TEXT DARK:             #1E293B
TEXT SECONDARY:        #64748B

SUCCESS:               #10B981
ERROR:                 #EF4444
WARNING:               #F59E0B
```

---

## Common Patterns

### 1. Blue Gradient Button
```jsx
<button style={{
  background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  padding: '0.9rem',
  fontWeight: '700',
  cursor: 'pointer',
  transition: 'all 0.3s ease'
}}>
  Click Me
</button>
```

### 2. Input with Blue Focus
```jsx
<input style={{
  width: '100%',
  padding: '0.8rem',
  border: '2px solid #E2E8F0',
  borderRadius: '10px',
  fontSize: '0.95rem',
  transition: 'all 0.3s ease',
  boxSizing: 'border-box'
}}
onFocus={(e) => {
  e.target.style.borderColor = '#3B82F6';
  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
}}
onBlur={(e) => {
  e.target.style.borderColor = '#E2E8F0';
  e.target.style.boxShadow = 'none';
}}
/>
```

### 3. Hover Lift Animation
```jsx
<div
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = 'translateY(-8px)';
    e.currentTarget.style.boxShadow = '0 20px 40px rgba(30, 64, 175, 0.15)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(30, 64, 175, 0.1)';
  }}
  style={{
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
>
  Hover Me!
</div>
```

### 4. Blue Header
```jsx
<div style={{
  background: 'linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%)',
  color: 'white',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 12px 24px rgba(30, 64, 175, 0.15)'
}}>
  <h2 style={{ margin: 0, fontWeight: '700' }}>Header Title</h2>
</div>
```

### 5. Light Blue Alert
```jsx
<div style={{
  background: 'linear-gradient(135deg, #D1FAE5 0%, #ECFDF5 100%)',
  border: '1px solid #A7F3D0',
  color: '#065F46',
  padding: '1rem',
  borderRadius: '10px',
  fontWeight: '500'
}}>
  ✅ Success Message
</div>
```

### 6. Table Styling
```jsx
<table style={{ width: '100%', borderCollapse: 'collapse' }}>
  <thead>
    <tr style={{ borderBottom: '2px solid #E2E8F0', background: '#EFF6FF' }}>
      <th style={{ padding: '1rem', textAlign: 'left', fontWeight: '600', color: '#1E40AF' }}>
        Column
      </th>
    </tr>
  </thead>
  <tbody>
    <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
      <td style={{ padding: '1rem', color: '#1E293B' }}>Data</td>
    </tr>
  </tbody>
</table>
```

### 7. Tab Navigation
```jsx
{['tab1', 'tab2', 'tab3'].map(t => (
  <button
    key={t}
    onClick={() => setTab(t)}
    style={{
      padding: '1rem 1.5rem',
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      color: tab === t ? '#1E40AF' : '#64748B',
      borderBottom: tab === t ? '3px solid #1E40AF' : 'none',
      fontWeight: '600',
      transition: 'all 0.3s ease'
    }}
  >
    {t}
  </button>
))}
```

---

## Shadow Values

```
Small:   0 4px 12px rgba(30, 64, 175, 0.1)
Medium:  0 12px 24px rgba(30, 64, 175, 0.12)
Large:   0 20px 40px rgba(30, 64, 175, 0.15)
Hover:   0 12px 24px rgba(30, 64, 175, 0.3)
```

---

## Border Radius Guide

```
Small:    6px    - Small buttons, tags
Medium:   8px    - Form inputs, cards
Large:    10px   - Major buttons, containers
XL:       12px   - Full cards, panels
```

---

## Spacing Scale

```
0.25rem  = 4px   - Very tight
0.5rem   = 8px   - Tight
0.75rem  = 12px  - Small padding
1rem     = 16px  - Standard padding
1.5rem   = 24px  - Medium spacing
2rem     = 32px  - Large spacing
```

---

## Typography

```
Headings:     Bold (700), Blue (#1E40AF), font-size 1.5rem-2rem
Labels:       Bold (600), Blue (#1E40AF), font-size 0.95rem
Body Text:    Regular (400), Dark (#1E293B), font-size 0.95rem
Small Text:   Regular (400), Gray (#64748B), font-size 0.85rem
Buttons:      Bold (600-700), White text, font-size 1rem
```

---

## Transitions

```
Fast:     0.2s ease    - Quick interactions
Standard: 0.3s ease    - Most animations
Slow:     0.5s ease    - Page transitions
```

---

## Pages Using This Theme

| Page | Route | Primary Color |
|------|-------|---------------|
| Vendors | `/` | Blue |
| AdminLogin | `/admin/login` | Blue |
| VendorLogin | `/vendor/login` | Blue |
| AdminDashboard | `/admin/dashboard` | Blue |
| VendorDashboard | `/vendor/dashboard` | Blue |
| VendorMenu | `/menu/:vendorId` | Blue |

---

## CSS Class Alternatives

If you want to add global CSS classes in `global.css`:

```css
.btn-primary {
  background: linear-gradient(135deg, #1E40AF 0%, #1A3A8A 50%, #3B82F6 100%);
  color: white;
  border: none;
  padding: 0.9rem 1.5rem;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(30, 64, 175, 0.3);
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(30, 64, 175, 0.1);
  padding: 2rem;
}

.input-blue {
  border: 2px solid #E2E8F0;
  border-radius: 10px;
  padding: 0.8rem;
  transition: all 0.3s ease;
}

.input-blue:focus {
  border-color: #3B82F6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.bg-light-blue {
  background: #EFF6FF;
  color: #1E40AF;
}
```

---

## Accessibility Checklist

- ✅ Text contrast: 4.5:1 or higher
- ✅ Focus visible: Blue glow effect on inputs
- ✅ Button size: Min 44x44px clickable area
- ✅ Labels: Associated with form inputs
- ✅ Icons: Combined with text labels
- ✅ Disabled state: Clear visual distinction
- ✅ Error messages: Clear and visible

---

## Browser Compatibility

✓ Chrome/Edge (Latest)
✓ Firefox (Latest)
✓ Safari (Latest)
✓ Mobile Safari (iOS 12+)
✓ Chrome Mobile (Latest)

All modern CSS features used:
- CSS Gradients ✓
- CSS Transforms ✓
- CSS Transitions ✓
- CSS Shadows ✓
- Flexbox ✓
- CSS Grid ✓

---

## Performance Tips

1. Use CSS variables for colors (future scalability)
2. Use `transform: translateY()` for animations (GPU accelerated)
3. Avoid `box-shadow` on :hover of many elements
4. Use `transition` not animation for simple interactions
5. Debounce onMouseEnter/onMouseLeave events if many elements

---

## Customization

To change the primary color globally:
```javascript
// Change #1E40AF to any blue shade
// Update all gradient colors accordingly
// Update shadow rgba values to match new color
```

To change accent colors:
```javascript
// Success: #10B981
// Error: #EF4444
// Warning: #F59E0B
```

---

**Theme Version**: 1.0
**Last Updated**: 2026-03-19
**Status**: ✅ Production Ready
