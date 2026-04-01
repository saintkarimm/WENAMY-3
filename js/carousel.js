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
  let lastTime = 0;
  let dragVelocity = 0;
  
  // Auto-scroll settings - continuous infinite scroll, no pause
  const isMobile = window.innerWidth <= 768;
  const baseScrollSpeed = isMobile ? 0.8 : 1.6;
  let scrollSpeed = baseScrollSpeed;
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
   * Uses time-based animation for smoothness regardless of frame rate
   */
  function startAutoScroll() {
    if (autoScrollID) cancelAnimationFrame(autoScrollID);
    lastTime = performance.now();
    
    function scroll(currentTime) {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      if (!isDragging) {
        // Time-based movement for consistent speed
        const moveAmount = scrollSpeed * (deltaTime / 16.67); // normalize to 60fps
        currentTranslate -= moveAmount;
        
        // Apply drag momentum decay
        if (Math.abs(dragVelocity) > 0.1) {
          currentTranslate += dragVelocity * (deltaTime / 16.67);
          dragVelocity *= 0.95; // decay
        } else {
          dragVelocity = 0;
          // Gradually return to base speed
          scrollSpeed = scrollSpeed * 0.98 + baseScrollSpeed * 0.02;
        }
        
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
    // Note: We intentionally don't use Page Visibility API to keep animation running
  }

  /**
   * Initialize touch/drag events for smooth swiping
   * Swiping adds momentum without disrupting the auto-scroll flow
   */
  function initTouchEvents() {
    let isDown = false;
    let startX;
    let scrollLeft;
    let velocityTracker = [];
    
    // Touch events
    track.addEventListener('touchstart', (e) => {
      isDown = true;
      isDragging = true;
      startX = e.touches[0].pageX;
      scrollLeft = currentTranslate;
      velocityTracker = [];
      dragVelocity = 0;
    }, { passive: true });
    
    track.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      const x = e.touches[0].pageX;
      const walk = (x - startX) * 1.5; // sensitivity multiplier
      currentTranslate = scrollLeft + walk;
      
      // Track velocity for momentum
      velocityTracker.push({ x: x, time: Date.now() });
      if (velocityTracker.length > 5) velocityTracker.shift();
      
      track.style.transform = `translateX(${currentTranslate}px)`;
    }, { passive: true });
    
    track.addEventListener('touchend', () => {
      isDown = false;
      isDragging = false;
      
      // Calculate swipe velocity for momentum
      if (velocityTracker.length >= 2) {
        const first = velocityTracker[0];
        const last = velocityTracker[velocityTracker.length - 1];
        const dt = last.time - first.time;
        if (dt > 0) {
          dragVelocity = (last.x - first.x) / dt * 15; // scale for effect
        }
      }
      velocityTracker = [];
    }, { passive: true });
    
    // Mouse events (for desktop dragging)
    track.addEventListener('mousedown', (e) => {
      isDown = true;
      isDragging = true;
      startX = e.pageX;
      scrollLeft = currentTranslate;
      velocityTracker = [];
      dragVelocity = 0;
      track.style.cursor = 'grabbing';
    });
    
    track.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX;
      const walk = (x - startX) * 1.5;
      currentTranslate = scrollLeft + walk;
      
      velocityTracker.push({ x: x, time: Date.now() });
      if (velocityTracker.length > 5) velocityTracker.shift();
      
      track.style.transform = `translateX(${currentTranslate}px)`;
    });
    
    track.addEventListener('mouseup', () => {
      isDown = false;
      isDragging = false;
      track.style.cursor = 'grab';
      
      if (velocityTracker.length >= 2) {
        const first = velocityTracker[0];
        const last = velocityTracker[velocityTracker.length - 1];
        const dt = last.time - first.time;
        if (dt > 0) {
          dragVelocity = (last.x - first.x) / dt * 15;
        }
      }
      velocityTracker = [];
    });
    
    track.addEventListener('mouseleave', () => {
      if (isDown) {
        isDown = false;
        isDragging = false;
        track.style.cursor = 'grab';
        velocityTracker = [];
      }
    });
    
    track.style.cursor = 'grab';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
