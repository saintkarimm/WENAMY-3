# WENAMY Ghana Ltd - Project Map

## Project Overview
**Project Name:** WENAMY Ghana Ltd Website  
**Type:** Real Estate / Estate Development Company Website  
**Location:** Tema Community 25, Ghana  
**Tagline:** "Just Exceptional"  
**Current Status:** Active Development - Hero Section Redesign Phase  

---

## Current State (As of March 24, 2026)

### Active Development Focus
The project is currently undergoing a **hero section redesign** with a dual-hero system that allows switching between two different designs:

1. **Original Hero** - Apple-style minimalist design with split-level navbar
2. **New Hero** - Luxury dark-themed design from `wenamytest/` folder

### Hero Switcher System
- **File:** `js/hero-switcher.js`
- **Configuration:** `HERO_CONFIG.CURRENT_HERO` can be set to `'original'` or `'new'`
- **Current Setting:** `'new'` (luxury hero is active)
- **Each hero includes its own navbar design**

---

## File Structure

### Root HTML Pages (All use NEW navbar as of latest update)
| File | Purpose | Navbar Status |
|------|---------|---------------|
| `index.html` | Homepage with hero switcher | Uses hero-switcher.js (new navbar) |
| `about.html` | About Us page | ✅ Updated to new navbar |
| `blog.html` | Blog/News page | ✅ Updated to new navbar |
| `contact.html` | Contact page | ✅ Updated to new navbar |
| `projects.html` | Projects listing | ✅ Updated to new navbar |
| `offplan.html` | Off-plan investments | ✅ Updated to new navbar |
| `project-detail.html` | Dynamic project details | ✅ Updated to new navbar |

### CSS Files
| File | Purpose | Status |
|------|---------|--------|
| `css/hero-new.css` | New hero + wenamytest navbar styles | **ACTIVE - Used by all pages** |
| `css/nav.css` | Old split-level navbar styles | Deprecated (kept for reference) |
| `css/base.css` | Base styles | Active |
| `css/animations.css` | Animation utilities | Active |
| `css/footer.css` | Footer styles | Active |
| `css/page-clean.css` | Clean page layouts | Active |
| `css/projects-listing.css` | Project grid styles | Active |
| `css/responsive.css` | Responsive breakpoints | Active |

### JavaScript Files
| File | Purpose | Status |
|------|---------|--------|
| `js/hero-switcher.js` | Hero section switching logic | **ACTIVE** |
| `js/main.js` | Main site functionality | Active |
| `js/animations.js` | Scroll animations | Active |
| `js/utils.js` | Utility functions | Active |
| `js/nav.js` | Old navbar functionality | Deprecated |
| `js/projects-data.js` | Project data for dynamic pages | Active |
| `js/carousel.js` | Carousel functionality | Active |

### Component Files
| File | Purpose |
|------|---------|
| `components/hero-original.html` | Backup of original hero HTML |
| `components/hero-new.html` | Backup of new hero HTML |
| `components/navbar-new.html` | Reusable new navbar component |

### Source/Reference Folder
| Folder | Purpose |
|--------|---------|
| `wenamytest/` | Contains the original new hero design reference files |
| `wenamytest/index.html` | Original luxury hero with original navbar |
| `wenamytest/style.css` | Original styles for reference |

---

## Navbar Evolution

### Old Navbar (Split-Level Design) - DEPRECATED
- Two-tier structure (branding bar + navigation bar)
- White background with black text
- Glassmorphism effect
- Contact info and social icons in top bar
- Dropdown menu for Off-Plan section

### Current Navbar (Wenamytest Style) - ACTIVE
- Single transparent navbar
- Dark gradient background (from hero-new-wrapper)
- Three-section layout:
  - **Left:** Home, Projects, Off-Plan, About Us
  - **Center:** Logo with custom SVG icon
  - **Right:** Blog, Contact, "Get in Touch" CTA
- Mobile: Hamburger menu with full-screen overlay
- Used on ALL pages (about, blog, contact, projects, offplan, project-detail)

---

## Key Features Implemented

### 1. Hero Section Switcher
- Dynamic injection of hero sections
- Each hero maintains its own navbar
- Easy switching via JavaScript config
- No page reload required

### 2. Mobile Navigation
- Hamburger menu toggle on all pages
- Full-screen overlay menu
- Smooth open/close animations
- Auto-close when clicking links

### 3. Dynamic Project Pages
- `project-detail.html` loads project data from URL hash
- `projects-data.js` contains all project information
- Image galleries with thumbnail navigation
- Responsive layout

### 4. Responsive Design
- Mobile-first approach
- Breakpoints for tablet and desktop
- Flexible grid systems
- Touch-friendly navigation

---

## Navigation Structure

### Main Navigation Links (All Pages)
```
Home → index.html
Projects → projects.html
Off-Plan → offplan.html
About Us → about.html
Blog → blog.html
Contact → contact.html
Get in Touch → contact.html (CTA button)
```

### Active Page Highlighting
Each page has its corresponding nav link marked with `class="active"` for visual indication.

---

## Recent Changes (March 2026)

### Completed Tasks
1. ✅ Implemented hero section switcher system
2. ✅ Integrated new wenamytest navbar on homepage
3. ✅ Updated ALL subpages to use new navbar:
   - about.html
   - blog.html
   - contact.html
   - projects.html
   - offplan.html
   - project-detail.html
4. ✅ Added mobile hamburger menu to all pages
5. ✅ Removed old nav.js dependency
6. ✅ Created reusable navbar component

### Technical Decisions
- **CSS Strategy:** Using `hero-new.css` for all navbar styles to maintain consistency
- **JavaScript:** Inline mobile menu script on each page (no external dependency)
- **Hero Switcher:** Each hero section is self-contained with its own navbar
- **Mobile Menu:** SVG-based hamburger icon matching wenamytest design exactly

---

## Development Guidelines

### When Adding New Pages
1. Copy navbar HTML from `components/navbar-new.html`
2. Link `css/hero-new.css` (not nav.css)
3. Add inline mobile menu script before closing `</body>`
4. Mark appropriate nav link as `active`

### When Modifying Navbar
1. Update `components/navbar-new.html` for reference
2. Update all HTML pages with new navbar code
3. Update `js/hero-switcher.js` if homepage navbar changes
4. Update `css/hero-new.css` for style changes

### Hero Switcher Usage
```javascript
// In js/hero-switcher.js
const HERO_CONFIG = {
  CURRENT_HERO: 'new', // Change to 'original' for old hero
  SHOW_SWITCHER_UI: true // Set false for production
};
```

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
- **Repo Name:** WENAMY-3
- **Branch:** main
- **Location:** Local Git repository

---

## Next Steps / TODO

### Potential Future Enhancements
1. [ ] Add smooth page transitions
2. [ ] Implement dark/light mode toggle
3. [ ] Add search functionality
4. [ ] Integrate contact forms with backend
5. [ ] Add property filtering on projects page
6. [ ] Implement lazy loading for images
7. [ ] Add SEO meta tags to all pages
8. [ ] Create sitemap.xml

### Known Considerations
- Hero switcher UI visible in development (`SHOW_SWITCHER_UI: true`)
- Some pages may need additional styling adjustments for new navbar
- Mobile menu closes on link click (intended behavior)

---

## Contact & Business Info
- **Company:** Wenamy Ghana Ltd
- **Phone:** 0243 817 969
- **Email:** info@wenamy.com
- **Address:** Tema Community 25, Ghana
- **Social:** Facebook, LinkedIn, Twitter, Instagram (placeholder links)

---

## For AI Assistants

When working on this project:
1. **Always check this PROJECT-MAP.md first** for current state
2. **Use `hero-new.css`** for navbar-related styling
3. **Reference `components/navbar-new.html`** for navbar HTML structure
4. **Test both hero versions** if modifying hero-switcher.js
5. **Update ALL pages** if changing shared components
6. **Mobile-first approach** for any new CSS

---

*Last Updated: March 24, 2026*
*Project Status: Active Development*
