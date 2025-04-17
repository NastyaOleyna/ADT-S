/**
 * Navigation Manager Utility
 * A centralized utility for handling navigation with consistent transitions
 * throughout the application, regardless of where navigation is triggered.
 */

import { transitionTiming } from './transitionConfig';

export class NavigationManager {
  constructor() {
    this.isNavigating = false;
  }

  /**
   * Navigate to a path with proper transition
   * @param {Object} router - Vue Router instance
   * @param {string} path - Target path to navigate to
   * @param {Object} options - Additional options
   * @returns {Promise} Promise that resolves when navigation is complete
   */
  navigateTo(router, path, options = {}) {
    // Don't navigate if we're already navigating or trying to navigate to current page
    if (this.isNavigating || router.currentRoute.value.path === path) {
      return Promise.resolve(false);
    }

    // Mark that we're navigating
    this.isNavigating = true;

    // Start transition by adding the transitioning class
    document.body.classList.add('page-transitioning');

    // Force browser to process the class before proceeding
    void document.body.offsetWidth;
    
    // Smoothly scroll to top during the fade-out transition
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Return a promise that resolves when navigation is complete
    return new Promise((resolve) => {
      // Wait for the fade-out animation to complete before changing the page
      setTimeout(() => {
        // Make sure we're at the top before navigation (in case smooth scroll hasn't finished)
        window.scrollTo(0, 0);
        
        // Execute navigation
        router.push(path)
          .then(() => {
            // Navigation successful
            setTimeout(() => {
              this.isNavigating = false;
              resolve(true);
            }, 100);
          })
          .catch(err => {
            console.error('Navigation error:', err);
            // Reset navigation state on error
            this.isNavigating = false;
            document.body.classList.remove('page-transitioning');
            resolve(false);
          });
      }, transitionTiming.beforeNavigationDelay);
    });
  }

  /**
   * Check if the current route is active
   * @param {Object} route - Vue Router route
   * @param {string} path - Path to check
   * @returns {boolean} Whether the path is active
   */
  isActive(route, path) {
    if (!path) return false;
    
    // Exact match for home page
    if (path === '/' && route.path === '/') {
      return true;
    }
    
    // For other pages, check if the current path starts with the menu item path
    // This ensures that /shows/some-show will keep the Shows menu item active
    return path !== '/' && route.path.startsWith(path);
  }
}

// Create and export a singleton instance
export const navigationManager = new NavigationManager();

export default navigationManager; 