/* Property Carousel Functionality - Continuous Loop */

(function() {
  'use strict';

  const track = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('carouselPrev');
  const nextBtn = document.getElementById('carouselNext');
  const indicators = document.querySelectorAll('.carousel-indicator');

  let currentIndex = 0;
  let isDragging = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  let autoScrollID;
  
  // Auto-scroll settings - continuous infinite scroll, no pause
  const isMobile = window.innerWidth <= 768;
  const scrollSpeed = isMobile ? 0.8 : 1.6; // slower on mobile (0.8), faster on desktop (1.6)
  const slideWidth = () => slides[0] ? slides[0].offsetWidth : 0;
  const totalWidth = () => slideWidth() * slides.length;

  /**
   * Initialize carousel
   */
  function init() {
    if (!track || slides.length === 0) return;

    // Clone slides for infinite loop effect
    cloneSlides();
    
    updateCarousel();
    updateIndicators();
    startAutoScroll();
    initEventListeners();
    initTouchEvents();
  }

  /**
   * Clone slides for seamless infinite scrolling
   */
  function cloneSlides() {
    // Clone all slides and append to end
    slides.forEach((slide) => {
      const clone = slide.cloneNode(true);
      clone.classList.add('clone');
      track.appendChild(clone);
    });
  }

  /**
   * Start continuous infinite auto-scroll (right to left, never stops)
   */
  function startAutoScroll() {
    if (autoScrollID) cancelAnimationFrame(autoScrollID);
    
    function scroll() {
      if (!isDragging) {
        currentTranslate -= scrollSpeed;
        
        // Seamless infinite loop - reset when we've scrolled past all original slides
        const originalWidth = slideWidth() * slides.length;
        if (Math.abs(currentTranslate) >= originalWidth) {
          currentTranslate = 0;
        }
        
        track.style.transform = `translateX(${currentTranslate}px)`;
      }
      
      autoScrollID = requestAnimationFrame(scroll);
    }
    
    autoScrollID = requestAnimationFrame(scroll);
  }

  /**
   * Update carousel position immediately
   */
  function updateCarousel() {
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  /**
   * Go to specific slide
   */
  function goToSlide(index) {
    const originalCount = slides.length;
    currentIndex = ((index % originalCount) + originalCount) % originalCount;
    currentTranslate = -currentIndex * slideWidth();
    prevTranslate = currentTranslate;
    updateCarousel();
    updateIndicators();
  }

  /**
   * Go to next slide
   */
  function nextSlide() {
    goToSlide(currentIndex + 1);
  }

  /**
   * Go to previous slide
   */
  function prevSlide() {
    goToSlide(currentIndex - 1);
  }

  /**
   * Update indicator states based on current index
   */
  function updateIndicators() {
    const originalCount = slides.length;
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  /**
   * Update indicator based on scroll position
   */
  function updateIndicatorFromPosition() {
    const originalCount = slides.length;
    const sWidth = slideWidth();
    const position = Math.abs(currentTranslate);
    const newIndex = Math.round(position / sWidth) % originalCount;
    
    if (newIndex !== currentIndex) {
      currentIndex = newIndex;
      updateIndicators();
    }
  }

  /**
   * Initialize event listeners
   */
  function initEventListeners() {
    // No navigation controls - decorative carousel only

    // No pause on hover - continuous infinite scroll

    // Handle resize
    window.addEventListener('resize', () => {
      // Recalculate position
      currentTranslate = -currentIndex * slideWidth();
      prevTranslate = currentTranslate;
      updateCarousel();
    }, { passive: true });

    // Continue scrolling even when tab is hidden (decorative carousel)
  }

  /**
   * No touch/drag events - purely decorative carousel
   */
  function initTouchEvents() {
    // No interaction - decorative only
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
