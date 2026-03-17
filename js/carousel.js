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
  let isPaused = false;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID;
  let autoScrollID;
  
  // Auto-scroll settings
  const scrollSpeed = 1.2; // pixels per frame
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
   * Start continuous auto-scroll (right to left)
   */
  function startAutoScroll() {
    if (autoScrollID) cancelAnimationFrame(autoScrollID);
    
    function scroll() {
      if (!isPaused && !isDragging) {
        currentTranslate -= scrollSpeed;
        
        // Check if we need to reset position for infinite loop
        const originalWidth = slideWidth() * slides.length;
        if (Math.abs(currentTranslate) >= originalWidth) {
          currentTranslate = 0;
        }
        
        track.style.transform = `translateX(${currentTranslate}px)`;
        
        // Update indicators based on position
        updateIndicatorFromPosition();
      }
      
      autoScrollID = requestAnimationFrame(scroll);
    }
    
    autoScrollID = requestAnimationFrame(scroll);
  }

  /**
   * Stop auto-scroll
   */
  function stopAutoScroll() {
    isPaused = true;
  }

  /**
   * Resume auto-scroll
   */
  function resumeAutoScroll() {
    isPaused = false;
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
    // Previous button
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        stopAutoScroll();
        prevSlide();
        // Resume after 3 seconds
        setTimeout(resumeAutoScroll, 3000);
      });
    }

    // Next button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        stopAutoScroll();
        nextSlide();
        // Resume after 3 seconds
        setTimeout(resumeAutoScroll, 3000);
      });
    }

    // Indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        stopAutoScroll();
        goToSlide(index);
        // Resume after 3 seconds
        setTimeout(resumeAutoScroll, 3000);
      });
    });

    // Pause on hover
    const container = document.querySelector('.carousel-container');
    if (container) {
      container.addEventListener('mouseenter', stopAutoScroll);
      container.addEventListener('mouseleave', resumeAutoScroll);
    }

    // Handle resize
    window.addEventListener('resize', () => {
      // Recalculate position
      currentTranslate = -currentIndex * slideWidth();
      prevTranslate = currentTranslate;
      updateCarousel();
    }, { passive: true });

    // Pause when tab is hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoScroll();
      } else {
        resumeAutoScroll();
      }
    });
  }

  /**
   * Initialize touch events for swipe
   */
  function initTouchEvents() {
    if (!track) return;

    track.addEventListener('touchstart', touchStart, { passive: true });
    track.addEventListener('touchend', touchEnd, { passive: true });
    track.addEventListener('touchmove', touchMove, { passive: true });

    // Mouse events for desktop drag
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('mouseleave', () => {
      if (isDragging) touchEnd();
    });
    track.addEventListener('mousemove', touchMove);
  }

  function touchStart(e) {
    isDragging = true;
    startPos = getPositionX(e);
    stopAutoScroll();
    track.style.cursor = 'grabbing';
  }

  function touchEnd() {
    isDragging = false;
    track.style.cursor = 'grab';

    const movedBy = currentTranslate - prevTranslate;
    const sWidth = slideWidth();

    // Snap to nearest slide
    if (movedBy < -50) {
      currentIndex = Math.ceil(Math.abs(currentTranslate) / sWidth);
    } else if (movedBy > 50) {
      currentIndex = Math.floor(Math.abs(currentTranslate) / sWidth);
    }
    
    // Ensure index is within bounds
    const originalCount = slides.length;
    currentIndex = ((currentIndex % originalCount) + originalCount) % originalCount;
    
    currentTranslate = -currentIndex * sWidth;
    prevTranslate = currentTranslate;
    
    track.style.transition = 'transform 0.3s ease-out';
    updateCarousel();
    updateIndicators();
    
    // Remove transition after animation completes
    setTimeout(() => {
      track.style.transition = '';
    }, 300);

    // Resume auto-scroll after 3 seconds
    setTimeout(resumeAutoScroll, 3000);
  }

  function touchMove(e) {
    if (isDragging) {
      const currentPosition = getPositionX(e);
      const diff = currentPosition - startPos;
      currentTranslate = prevTranslate + diff;
      track.style.transform = `translateX(${currentTranslate}px)`;
    }
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
