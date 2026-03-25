/**
 * HERO SECTION
 * ============
 * Luxury hero with wenamytest-style navbar
 */

// Hero section HTML content
const HERO_SECTION = `<div class="hero-new-wrapper">
  <nav class="navbar">
    <div class="nav-left">
      <a href="index.html" class="nav-link active">Home</a>
      <a href="projects.html" class="nav-link">Projects</a>
      <a href="offplan.html" class="nav-link">Off-Plan</a>
      <a href="about.html" class="nav-link">About Us</a>
    </div>
    
    <div class="nav-center">
      <div class="logo">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-icon">
          <rect x="4" y="4" width="10" height="16" rx="3" stroke="white" stroke-width="2"/>
          <rect x="8" y="8" width="12" height="12" rx="3" stroke="white" stroke-width="2"/>
        </svg>
        Wenamy
      </div>
    </div>
    
    <div class="nav-right">
      <a href="blog.html" class="nav-link">Blog</a>
      <a href="contact.html" class="nav-link">Contact</a>
      <a href="contact.html" class="btn btn-primary">Get in Touch</a>
    </div>
    
    <button class="mobile-menu-toggle" aria-label="Toggle menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      </svg>
    </button>
  </nav>

  <div class="mobile-nav-overlay">
    <button class="mobile-menu-close" aria-label="Close menu">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
    <a href="index.html" class="nav-link">Home</a>
    <a href="projects.html" class="nav-link">Projects</a>
    <a href="offplan.html" class="nav-link">Off-Plan</a>
    <a href="contact.html" class="nav-link">Contact</a>
    <a href="tel:0243817969" class="nav-link">0243817969</a>
    <a href="contact.html" class="btn btn-primary">Get in Touch</a>
  </div>

  <section class="hero-new-section" id="hero">
    <div class="hero-new-container">
      <div class="hero-new-content">
        <h1 class="hero-new-headline">Spaces<br>That Define<br>Luxury.</h1>
        
        <div class="hero-new-floating-top">
          <div class="hero-new-circles">
            <div class="hero-new-circle hero-new-circle-1"></div>
            <div class="hero-new-circle hero-new-circle-2"></div>
            <div class="hero-new-circle hero-new-circle-3"></div>
          </div>
          <p class="hero-new-floating-text">FIND A HOME THAT<br>IS JUST EXCEPTIONAL</p>
        </div>

        <div class="hero-new-floating-bottom">
          <div class="hero-new-spark">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L12 22M2 12L22 12M5 5L19 19M5 19L19 5" stroke="white" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </div>

          <div class="hero-new-cta-group">
            <a href="#properties" class="hero-new-btn hero-new-btn-dark">
              View Projects 
              <span class="hero-new-arrow">→</span>
            </a>
            <a href="offplan.html" class="hero-new-btn hero-new-btn-outline">
              Off-Plan Projects 
              <span class="hero-new-arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <div class="hero-new-bg-wrapper">
        <img src="images/luxury_building.jpg" alt="Luxury Real Estate" class="hero-new-bg-image">
      </div>
    </div>
  </section>
</div>`;

/**
 * Load the hero section
 */
function loadHeroSection() {
  const heroContainer = document.getElementById('dynamic-hero');
  
  if (!heroContainer) {
    console.error('Hero container not found! Make sure to add <div id="dynamic-hero"></div> in your HTML.');
    return;
  }

  heroContainer.innerHTML = HERO_SECTION;
  console.log('✓ Loaded hero section');
  
  initMobileMenu();
  triggerAnimations();
}

/**
 * Initialize mobile menu toggle
 */
function initMobileMenu() {
  const mobileToggle = document.querySelector('.mobile-menu-toggle');
  const mobileClose = document.querySelector('.mobile-menu-close');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  if (mobileToggle && mobileOverlay) {
    mobileToggle.addEventListener('click', () => {
      mobileOverlay.classList.add('active');
    });
  }

  if (mobileClose && mobileOverlay) {
    mobileClose.addEventListener('click', () => {
      mobileOverlay.classList.remove('active');
    });
  }

  if (mobileOverlay) {
    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileOverlay.classList.remove('active');
      });
    });
  }
}

/**
 * Trigger animations for the hero section
 */
function triggerAnimations() {
  const heroElements = document.querySelectorAll('.hero-new-headline, .hero-new-floating-top, .hero-new-floating-bottom');
  
  heroElements.forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
      el.style.transition = 'all 0.8s ease-out';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, index * 200);
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadHeroSection);
} else {
  loadHeroSection();
}
