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
| `basket.html` | Saved Properties page | Displays saved/bookmarked properties |

### CSS Files
| File | Purpose |
|------|---------|
| `css/hero-new.css` | Hero section + navbar styles (glassmorphism, adaptive colors) |
| `css/base.css` | Base styles and typography |
| `css/animations.css` | Animation utilities |
| `css/footer.css` | Footer styles |
| `css/account.css` | Account page auth forms |
| `css/dashboard-new.css` | Dashboard/account page layout |
| `css/projects-luxury.css` | Projects listing page styles |
| `css/project-detail-luxury.css` | Project detail page styles |
| `css/pages-luxury.css` | General page styles (about, contact, blog, offplan) |
| `css/basket.css` | Basket/saved properties page |
| `css/chatbot.css` | Chatbot widget styles |
| `css/loading-states.css` | Loading animations and skeletons |
| `css/responsive.css` | Responsive breakpoints |
| `css/variables.css` | CSS custom properties |
| `css/reset.css` | CSS reset/normalize |
| `css/grid.css` | Grid system utilities |
| `css/sections.css` | Section component styles |
| `css/carousel.css` | Carousel/slider styles |
| `css/features.css` | Feature section styles |

### JavaScript Files
| File | Purpose |
|------|---------|
| `js/main.js` | Main site functionality |
| `js/navbar.js` | Navbar initialization and mobile menu |
| `js/animations.js` | Scroll animations and reveal effects |
| `js/utils.js` | Utility functions |
| `js/projects-data.js` | Project data for dynamic pages |
| `js/carousel.js` | Carousel/slider functionality |
| `js/basket.js` | Basket/saved properties functionality |
| `js/chatbot.js` | Chatbot widget functionality |
| `js/loading-states.js` | Loading state management |

---

## Navbar Structure

### Current Implementation
- **Premium Liquid Glass Design** - Ultra-transparent glassmorphism effect (2% white, 3px blur)
- **Adaptive Color System** - Text color changes based on section background (dark/light)
- **Links:** Home, Projects, Off-Plan, About, Blog, Contact
- **CTA:** Sign In button (links to account.html)
- **No basket icon** - Removed during simplification
- **No user display** - Removed during simplification
- **Mobile:** Hamburger menu with full-screen overlay, rounded pill navbar

### Navbar Features
- **Glassmorphism Effect:** Semi-transparent background with backdrop blur
- **Sticky Positioning:** Fixed at top with smooth scroll behavior
- **Intersection Observer:** Detects dark/light sections and toggles text color
- **Cache Busting:** CSS version parameters (`?v=5`) for updates

### Navbar Files
- HTML: Inline in each page (consistent across all pages)
- CSS: `css/hero-new.css` (glass effect, transparency, adaptive colors)
- JS: `js/navbar.js` (minimal) + inline adaptive color script per page

### Adaptive Color Behavior
| Page | Dark Sections | Light Sections |
|------|--------------|----------------|
| index.html | hero-new-wrapper, property-carousel | featured-property, bento-grid, services-luxury |
| projects.html | projects-hero | projects-section, projects-filter |
| offplan.html | page-luxury-hero | offplan-luxury-section, offplan-benefits-section |
| about.html | page-luxury-hero | about-intro-section, about-values-section, etc. |
| contact.html | page-luxury-hero | contact-luxury-section, contact-map-section |
| blog.html | page-luxury-hero | blog-luxury-section, page-cta-section |
| project-detail.html | project-detail-hero | project-features-section, project-cta-section |
| basket.html | — | All light (always dark text) |
| account.html | — | All light (always dark text) |

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

## Basket Page (basket.html)

### Current State
- **Displays saved properties** - Grid of bookmarked properties
- **Visual-only storage** - Uses localStorage, no backend
- **Property cards** - Image, title, location, price, view details
- **Remove functionality** - Can remove individual items or clear all
- **Empty state** - Shows message when no saved properties

### Features
- Load saved properties from localStorage
- Display property cards with key info
- Remove individual properties
- Clear all saved properties
- Navigate to property detail page

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
- ❌ Basket functionality (visual only, no backend storage)

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
- Must update ALL 9 HTML files (index, about, blog, contact, projects, offplan, project-detail, account, basket)
- Keep structure consistent
- Each page has inline adaptive color script - update selectors if section classes change
- CSS changes go in `css/hero-new.css`

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

---

---

## Off-Plan Properties (offplan.html)

### Overview
The offplan.html page displays investment properties with category filtering and detailed modal carousels. Each property has:
- Property card in the main grid
- Full-screen modal with image carousel
- Lightbox for full-size image viewing
- URL parameter support for direct linking

### Categories
| Category | data-category | Description |
|----------|---------------|-------------|
| All | `all` | Shows all properties |
| Duplexes | `duplexes` | Two-story residential buildings |
| Vacation Homes | `vacation` / `vacation-homes` | Holiday/retreat properties |
| Environmentalists | `environmentalists` | Eco-friendly/sustainable designs |

### Property List (16 Total)

| # | Property Name | Category | Bedrooms | Washrooms | Price | Location | Images |
|---|---------------|----------|----------|-----------|-------|----------|--------|
| OFFPLAN1 | 3 Bedroom Townhouse | Townhouses | 3 | 3 | $285,000 | Tema Community 25 | 5 |
| OFFPLAN2 | 4 Bedroom Vacation Home | Vacation Homes | 4 | 5 | $350,000 | Kokrobite | 5 |
| OFFPLAN3 | 3 Bedroom Aburi Views | Vacation Homes | 3 | 3 | $275,000 | Aburi | 5 |
| OFFPLAN4 | 3 Bedroom Duplex | Duplexes | 3 | 4 | $250,000 | East Legon Hills | 5 |
| OFFPLAN5 | 4 Bedroom Duplex | Duplexes | 4 | 5 | $320,000 | East Legon Hills | 5 |
| OFFPLAN6 | 3 Bedroom Vacation Home | Vacation Homes | 3 | 4 | $295,000 | Aburi | 5 |
| OFFPLAN7 | 3 Bedroom Beach House | Vacation Homes | 3 | 3 | $410,000 | Kokrobite Beach | 5 |
| OFFPLAN8 | 3 Bedroom Vacation Home | Vacation Homes | 3 | 4 | $365,000 | Aburi | 7 |
| OFFPLAN9 | 3 Bedroom Vacation Home | Vacation Homes | 3 | 4 | $335,000 | Aburi | 11 |
| OFFPLAN10 | 3 Bedroom Duplex | Duplexes | 3 | 4 | $250,000 | East Legon Hills | 20 |
| OFFPLAN11 | 5 Bedroom Family Home | Environmentalists | 5 | 6 | $365,000 | East Legon Hills | 11 |
| OFFPLAN12 | 4 Bedroom Duplex | Duplexes | 4 | 5 | $215,000 | Community 25 | 6 |
| OFFPLAN13 | 4 Bedroom Duplex with Underground Garage | Duplexes | 4 | 5 | $310,000 | Peduasi | 11 |
| OFFPLAN14 | 4 Bedroom Duplex | Environmentalists | 4 | 5 | $380,000 | East Legon Hills | 12 |
| OFFPLAN15 | 5 Bedroom Home | Environmentalists | 5 | 6 | $530,000 | Peduasi | 14 |
| OFFPLAN16 | 3 Bedroom Home | Vacation Homes | 3 | 4 | $310,000 | Peduasi | 13 |

### URL Parameters for Direct Linking
Append `?project={id}` to offplan.html to auto-open a specific property modal:

| Parameter | Property | Category Filter Applied |
|-----------|----------|------------------------|
| `?project=vacation2` | OFFPLAN2 | Vacation Homes |
| `?project=aburi3` | OFFPLAN3 | Vacation Homes |
| `?project=duplex4` | OFFPLAN4 | Duplexes |
| `?project=duplex5` | OFFPLAN5 | Duplexes |
| `?project=vacation6` | OFFPLAN6 | Vacation Homes |
| `?project=beach7` | OFFPLAN7 | Vacation Homes |
| `?project=aburiviews8` | OFFPLAN8 | Vacation Homes |
| `?project=aburimountain9` | OFFPLAN9 | Vacation Homes |
| `?project=duplex10` | OFFPLAN10 | Duplexes |
| `?project=environmental11` | OFFPLAN11 | Environmentalists |
| `?project=duplex12` | OFFPLAN12 | Duplexes |
| `?project=duplex13` | OFFPLAN13 | Duplexes |
| `?project=environmental14` | OFFPLAN14 | Environmentalists |
| `?project=environmental15` | OFFPLAN15 | Environmentalists |

Example: `https://wenamy.com/offplan?project=duplex10`

### Image Storage
- **Location:** `images/offplan/OFFPLAN{1-16}/`
- **Naming:** `1st.jpeg`, `2nd.jpeg`, `3rd.jpeg`, etc.
- **Formats:** JPEG (primary), PNG (legacy projects)
- **1st image:** Used for property card thumbnail
- **All images:** Used in modal carousel

---

## Custom AI Skills (.qoder/skills/)

This project includes custom AI skills that enable automated content management. These skills are located in `.qoder/skills/` and can be used by any AI assistant working on this project.

### Available Skills

#### 1. offplan-project Skill
**Location:** `.qoder/skills/offplan-project/SKILL.md`

**Purpose:** Adds new off-plan property projects to the offplan.html page with image carousel modal functionality.

**Usage:**
```
/offplan-project
Folder: C:\Users\...\WENAMY 3\images\offplan\OFFPLAN17
Name: Property Name
Description: Property description...
Location: Location Name
Price: $XXX,XXX
Category: Duplexes|Vacation Homes|Environmentalists
```

**What It Does:**
1. Verifies images exist in the folder (1st.jpeg, 2nd.jpeg, etc.)
2. Adds property card to offplan-luxury-grid
3. Creates modal with full image carousel
4. Adds JavaScript functions for modal/carousel functionality
5. Integrates with lightbox and escape key handler
6. Updates URL parameter routing if needed

**Requirements:**
- Folder with images named `1st.jpeg`, `2nd.jpeg`, etc.
- At least 1st.jpeg is required
- Property details (name, description, location, price, category)

---

#### 2. project-image Skill
**Location:** `.qoder/skills/project-image/SKILL.md`

**Purpose:** Updates project images in projects.html and projects-data.js based on a project folder containing images.

**Usage:**
```
/project-image C:\Users\...\WENAMY 3\images\properties\PROJECT X
```

**What It Does:**
1. Extracts project name from folder path
2. Maps project name to project ID in projects-data.js
3. Verifies images 1st.png through 5th.png exist
4. Updates projects.html card image (uses 1st.png)
5. Updates projects-data.js gallery images (uses 2nd-5th.png)

**Image Naming Convention:**
- `1st.png` - Primary image for projects listing
- `2nd.png` - First gallery image in project detail
- `3rd.png` - Second gallery image
- `4th.png` - Third gallery image
- `5th.png` - Fourth gallery image

**Requirements:**
- Folder with images named `1st.png` through `5th.png`
- Project must exist in projects-data.js

---

### How to Use These Skills

**For AI Assistants:**
1. Read the skill file: `.qoder/skills/{skill-name}/SKILL.md`
2. Follow the workflow documented in the skill
3. Use the exact command format specified
4. Verify all requirements are met before executing

**For Human Users:**
1. Type the command (e.g., `/offplan-project` or `/project-image`)
2. Provide the required information as prompted
3. The AI will follow the skill's workflow automatically

---

## Image Assets Structure

### Properties (`images/properties/`)
| Folder | Contents | Usage |
|--------|----------|-------|
| `PROJECT 1/` | 1st.png - 5th.png | 3 Bedroom Bungalow |
| `PROJECT 2/` | 1st.png - 5th.png | 6 Bedroom Villa |
| `PROJECT 3/` | 1st.png - 5th.png | 4 Bedroom Townhouse |
| `PROJECT 4/` | 1st.png - 5th.png | Luxury Apartment |
| `PROJECT 5-12/` | 1st.png - 5th.png | Various properties |

### Off-Plan (`images/offplan/`)
| Folder | Contents | Property Count |
|--------|----------|----------------|
| `OFFPLAN1-7/` | 1st.png - 5th.png | 7 properties |
| `OFFPLAN8/` | 1st.jpeg - 7th.jpeg | 1 property |
| `OFFPLAN9/` | 1st.jpeg - 11th.jpeg | 1 property |
| `OFFPLAN10/` | 1st.jpeg - 20th.jpeg | 1 property |
| `OFFPLAN11/` | 1st.jpeg - 11th.jpeg | 1 property |
| `OFFPLAN12/` | 1st.jpeg - 6th.jpeg | 1 property |
| `OFFPLAN13/` | 1st.jpeg - 11th.jpeg | 1 property |
| `OFFPLAN14/` | 1st.jpeg - 12th.jpeg | 1 property |
| `OFFPLAN15/` | 1st.jpeg - 14th.jpeg | 1 property |
| `OFFPLAN16/` | 1st.jpeg - 13th.jpeg | 1 property |

### Icons (`images/icons/`)
- `logo.png` - Company logo
- `basket.png` - Saved properties icon
- `Services Icons/` - Service category icons

### Hero (`images/hero/`)
- `modernarc-img.jpg`
- `sky-img.jpg`
- `viva-img.jpg`

---

*Last Updated: March 31, 2026*  
*Project Status: Production-Ready Static Site with 16 Off-Plan Properties and Custom AI Skills*
