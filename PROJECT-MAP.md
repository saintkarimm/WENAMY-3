# WENAMY Ghana Ltd - Project Map

## Project Overview
**Project Name:** WENAMY Ghana Ltd Website  
**Type:** Luxury Real Estate / Estate Development Company Website  
**Location:** Tema Community 25, Ghana  
**Tagline:** "Just Exceptional"  
**Current Status:** Production-Ready Static Site (Firebase/Auth Removed)

---

## Current State (As of March 25, 2026)

### Architecture Overview
This is a **static HTML/CSS/JS website** with no backend dependencies. Previously had Firebase Authentication and user accounts, but these have been removed for simplification.

### Key Characteristics
- **Pure static site** - No server-side processing required
- **Clean URLs** - Vercel configured to serve `/projects` instead of `/projects.html`
- **Responsive design** - Mobile-first approach
- **No user accounts** - Sign In page shows forms only (non-functional)
- **Visual-only interactions** - Heart icons on properties toggle visually but don't save

---

## File Structure

### Root HTML Pages
| File | Purpose | Notes |
|------|---------|-------|
| `index.html` | Homepage with hero section | Clean navbar, no basket |
| `about.html` | About Us page | Company info, team, values |
| `blog.html` | Blog/News page | Articles and updates |
| `contact.html` | Contact page | Contact form, map, details |
| `projects.html` | Projects listing | Property grid with heart icons |
| `offplan.html` | Off-plan investments | Investment opportunities |
| `project-detail.html` | Dynamic project details | Loads from URL hash |
| `account.html` | Sign In/Sign Up page | Forms only, no backend |

### CSS Files
| File | Purpose |
|------|---------|
| `css/hero-new.css` | Hero section + navbar styles |
| `css/base.css` | Base styles and typography |
| `css/animations.css` | Animation utilities |
| `css/footer.css` | Footer styles |
| `css/account.css` | Account page auth forms |
| `css/dashboard-new.css` | Dashboard/account page layout |
| `css/projects-listing.css` | Project grid styles |
| `css/responsive.css` | Responsive breakpoints |

### JavaScript Files
| File | Purpose |
|------|---------|
| `js/main.js` | Main site functionality |
| `js/navbar.js` | Navbar initialization (simplified) |
| `js/animations.js` | Scroll animations |
| `js/utils.js` | Utility functions |
| `js/projects-data.js` | Project data for dynamic pages |
| `js/carousel.js` | Carousel functionality |

---

## Navbar Structure

### Current Implementation
- **Single transparent navbar** on all pages
- **Links:** Home, Projects, Off-Plan, About, Blog, Contact
- **CTA:** Sign In button (links to account.html)
- **No basket icon** - Removed during simplification
- **No user display** - Removed during simplification
- **Mobile:** Hamburger menu with full-screen overlay

### Navbar Files
- HTML: Inline in each page (consistent across all pages)
- CSS: `css/hero-new.css`
- JS: `js/navbar.js` (minimal, shows Sign In button only)

---

## Account Page (account.html)

### Current State
- **Split-screen design** - Image on left, forms on right
- **Login form** - Email + password fields
- **Signup form** - Name, email, phone, password fields
- **Form toggle** - Click "Sign up"/"Sign in" to switch forms
- **Password visibility toggle** - Eye icon shows/hides password
- **Social login buttons** - Visual only (Instagram, Google, Facebook)
- **NO BACKEND** - Forms don't actually submit or authenticate

### Important Notes for AI
- This is a **visual-only** auth page
- No Firebase, no database, no real authentication
- Forms are present but non-functional
- Kept for future re-implementation of user accounts

---

## Projects Page (projects.html)

### Features
- **Property grid** - Responsive card layout
- **Heart icons** - Visual toggle only (no saving)
- **Deep linking** - Click property → project-detail.html#property-id
- **Dynamic loading** - Project data from `js/projects-data.js`

### Heart Icons
- Click to toggle filled/unfilled state
- Purely visual - no backend storage
- CSS-only interaction

---

## URL Structure (Clean URLs)

Vercel is configured to serve clean URLs without `.html` extensions:

| Old URL | New URL |
|---------|---------|
| `/projects.html` | `/projects` |
| `/about.html` | `/about` |
| `/contact.html` | `/contact` |
| `/blog.html` | `/blog` |
| `/offplan.html` | `/offplan` |
| `/account.html` | `/account` |

Configuration in `vercel.json`:
```json
{
  "cleanUrls": true,
  "trailingSlash": false
}
```

---

## What Was Removed

### Firebase/Authentication System (Previously Implemented, Now Removed)
- ❌ Firebase Authentication
- ❌ Firestore Database
- ❌ User accounts and profiles
- ❌ Saved properties (basket) functionality
- ❌ Real-time data synchronization
- ❌ User dashboard
- ❌ Basket page (basket.html deleted)

### Files Deleted
- `js/firebase.js`
- `js/auth.js`
- `js/auth-state.js`
- `js/user.js`
- `js/basket-module.js`
- `js/account-module.js`
- `js/properties-module.js`
- `js/rate-limiter.js`
- `js/network-resilience.js`
- `basket.html`
- `firestore.rules`

---

## Development Guidelines

### When Adding New Pages
1. Copy navbar HTML from existing page (consistent structure)
2. Include `js/navbar.js` for navbar initialization
3. Link required CSS files
4. Add mobile menu toggle script

### When Modifying Navbar
1. Update ALL pages (index, about, blog, contact, projects, offplan, account)
2. Update `js/navbar.js` if logic changes
3. Update `css/hero-new.css` for style changes

### Current Tech Stack
- **Hosting:** Vercel
- **Frontend:** Vanilla HTML/CSS/JS
- **No framework** - Pure static site
- **No backend** - No API calls, no database
- **Forms:** Visual only (contact form may use Formspree if configured)

---

## Assets

### Images
- `images/icons/logo.png` - Company logo
- `images/hero/` - Hero background images
- `images/properties/` - Property photos

### Fonts
- **Outfit:** Headings (300, 400, 500, 600, 700, 800)
- **Inter:** Body text (400, 500)

---

## Git Repository
- **Repo:** https://github.com/saintkarimm/WENAMY-3
- **Branch:** main
- **Auto-deploy:** Vercel (enabled via GitHub integration)

---

## For AI Assistants

### Before Making Changes
1. **Check this PROJECT-MAP.md** for current architecture
2. **Understand:** This is a static site with NO backend
3. **Test locally:** Use `python -m http.server 8080` or similar

### Common Tasks

**Adding a new page:**
- Copy structure from existing page
- Include navbar HTML
- Link `js/navbar.js`
- Add mobile menu script

**Modifying navbar:**
- Must update ALL 7 HTML files
- Keep structure consistent

**Account page changes:**
- Remember: Forms are visual-only
- No real authentication happening
- Toggle functionality is JS-only

**Projects page:**
- Heart icons are visual-only (CSS toggle)
- Project data is in `js/projects-data.js`

### What NOT to Do
- ❌ Don't add backend functionality without explicit request
- ❌ Don't re-implement Firebase/auth without explicit request
- ❌ Don't add basket/saved properties without explicit request
- ❌ Don't create new HTML files unless requested

### Current Limitations (By Design)
- Sign In forms don't actually work (visual only)
- Heart icons don't save properties
- No user accounts or personalization
- No dynamic content from database

---

## Contact & Business Info
- **Company:** Wenamy Ghana Ltd
- **Phone:** 0243 817 969
- **Email:** info@wenamy.com
- **Address:** Tema Community 25, Ghana

---

*Last Updated: March 25, 2026*  
*Project Status: Production-Ready Static Site*
