<template>
  <!-- Switch to simultaneous mode to prevent flash -->
  <transition
    name="page-transition"
    @enter="enter"
    @after-enter="afterEnter"
  >
    <slot></slot>
  </transition>
</template>

<script>
import { transitionTiming } from '../utils/transitionConfig'

export default {
  name: 'PageTransition',
  data() {
    return {
      transitionActive: false
    };
  },
  methods: {
    enter(el, done) {
      // Mark that transition is active
      this.transitionActive = true;
      
      // Force opacity to 0 immediately
      el.style.opacity = '0';
      el.style.visibility = 'visible'; // Ensure element is in the DOM but invisible
      
      // Use the most reliable approach with double RAF
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Force reflow to ensure opacity:0 is applied
          void el.offsetWidth;
          
          // Start transition in
          el.style.opacity = '1';
          
          // Transition completion
          setTimeout(() => {
            this.transitionActive = false;
            done();
          }, transitionTiming.pageEnterDelay);
        });
      });
    },
    afterEnter() {
      // Clean up after transition
      document.body.classList.remove('page-transitioning');
      
      // Ensure all page images are visible
      this.showPageImages();
    },
    showPageImages() {
      // Short timeout to ensure DOM has updated
      setTimeout(() => {
        // Handle any image-loaded elements
        document.querySelectorAll('.image-loaded').forEach(img => {
          img.style.opacity = '1';
        });
        
        // Handle profile page's special image-visible class
        document.querySelectorAll('.image-visible').forEach(img => {
          img.style.opacity = '1';
        });
      }, 50);
    }
  },
  beforeUnmount() {
    // Safety cleanup
    document.body.classList.remove('page-transitioning');
    this.transitionActive = false;
  }
}
</script>

<style>
/* The main transition for page content */
.page-transition-enter-active {
  transition: opacity var(--transition-duration, 500ms) var(--transition-easing, ease);
  visibility: visible;
}

.page-transition-enter-from {
  opacity: 0 !important; /* Force opacity 0 with !important */
  visibility: visible;
}

/* Ensure transitioning pages fade out properly */
body.page-transitioning main {
  opacity: 0;
  transition: opacity var(--transition-duration, 500ms) var(--transition-easing, ease);
}

/* Ensure the menu stays visible during transitions */
body.page-transitioning .menu {
  opacity: 1 !important;
}

/* Global styles for image transitions */
.image-loaded,
.image-visible {
  transition: opacity var(--transition-duration, 500ms) var(--transition-easing, ease);
}
</style> 