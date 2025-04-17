/**
 * Page Transition Configuration
 * Central place to adjust all transition timing values
 */

// Base duration for all transitions - balanced for smoothness
const BASE_DURATION = 1500;

// Multipliers for different transition phases
const MULTIPLIERS = {
  fadeOut: 0.6,      // How long the fade-out animation takes
  fadeIn: 1.2,       // How long the fade-in animation takes
  waitBeforeNav: 0.8, // How long to wait before navigation
  waitAfterNav: 0.2   // Delay after navigation
};

export const transitionTiming = {
  // How long to wait before navigating after click (ms)
  beforeNavigationDelay: BASE_DURATION * MULTIPLIERS.waitBeforeNav,
  
  // Initial delay before starting fade in (ms)
  fadeInDelay: 0, // No delay for fade in
  
  // How long the fade effect takes (ms) - used in CSS
  fadeAnimationDuration: BASE_DURATION * MULTIPLIERS.fadeOut,
  
  // Page transition delay (ms) - same for all pages
  pageEnterDelay: BASE_DURATION * MULTIPLIERS.fadeIn,
  
  // Delay before removing the transitioning class (ms)
  removeTransitionClassDelay: 300,
  
  // Safety timeout for router afterEach hook (ms)
  routerAfterEachDelay: BASE_DURATION * MULTIPLIERS.waitAfterNav
};

// CSS timing values (for use in components and stylesheets)
export const transitionCSS = {
  // Main transition duration as a CSS value
  duration: `${transitionTiming.fadeAnimationDuration}ms`,
  
  // Easing function for transitions - more natural easing
  easing: 'ease-in-out'
};

// Helper to generate complete CSS transition value
export const getTransitionCSS = (properties = ['opacity']) => {
  return properties.map(prop => 
    `${prop} ${transitionCSS.duration} ${transitionCSS.easing}`
  ).join(', ');
};

export default {
  timing: transitionTiming,
  css: transitionCSS,
  getTransition: getTransitionCSS,
  // Export base values for direct access if needed
  base: {
    duration: BASE_DURATION,
    multipliers: MULTIPLIERS
  }
}; 