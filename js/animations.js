/* Animation and Scroll Effects */

(function() {
  'use strict';

  // Check for reduced motion preference
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /**
   * Initialize scroll-triggered animations
   */
  function initScrollAnimations() {
    if (reducedMotion) {
      // Show all elements immediately if reduced motion is preferred
      document.querySelectorAll('.scroll-animate, .scroll-animate-scale, .stagger-children').forEach((el) => {
        el.classList.add('is-visible');
      });
      return;
    }

    const animatedElements = document.querySelectorAll('.scroll-animate, .scroll-animate-scale, .stagger-children');
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add delay for stagger effect on parent elements
            if (entry.target.classList.contains('stagger-children')) {
              entry.target.classList.add('is-visible');
            } else {
              entry.target.classList.add('is-visible');
            }
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    animatedElements.forEach((el) => observer.observe(el));
  }

  /**
   * Initialize hero text reveal animation
   */
  function initHeroAnimation() {
    if (reducedMotion) {
      document.querySelectorAll('.hero-text-reveal').forEach((el) => {
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const heroElements = document.querySelectorAll('.hero-text-reveal');
    
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('animated');
      }, 200 + (index * 200));
    });
  }

  /**
   * Initialize parallax effect for hero image
   */
  function initParallax() {
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) {
      return; // Skip on touch devices or reduced motion
    }

    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const rate = scrolled * 0.3;
          heroImage.style.transform = `translateY(${rate}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  /**
   * Initialize navigation scroll effect
   */
  function initNavScroll() {
    const nav = document.getElementById('nav');
    if (!nav) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Add/remove scrolled class
      if (currentScroll > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /**
   * Initialize smooth scroll for anchor links
   */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navHeight = document.getElementById('nav')?.offsetHeight || 44;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
          
          window.scrollTo({
            top: targetPosition,
            behavior: reducedMotion ? 'auto' : 'smooth'
          });
        }
      });
    });
  }

  /**
   * Initialize card hover effects
   */
  function initCardEffects() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.bento-card');
    
    cards.forEach((card) => {
      card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.zIndex = '';
      });
    });
  }

  // Initialize all animations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initHeroAnimation();
    initScrollAnimations();
    initParallax();
    initNavScroll();
    initSmoothScroll();
    initCardEffects();
  }

  // Re-initialize on resize (debounced)
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initScrollAnimations();
    }, 250);
  }, { passive: true });
})();
