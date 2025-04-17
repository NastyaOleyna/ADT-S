import type { DirectiveBinding } from 'vue'

// Define interface for HTMLElement with cleanup function
interface HTMLElementWithCleanup extends HTMLElement {
  _cleanup?: () => void;
  _observer?: IntersectionObserver;
}

// Options for the lazy loading directive
interface LazyLoadOptions {
  url: string;
  index?: number;
  resetQueue?: boolean;
  threshold?: number; // Visibility threshold (0-1)
  rootMargin?: string; // Margin around the root
  background?: boolean; // Whether to set as background image
}

// Global loading queue to track image loading status
const loadingQueue = {
  currentIndex: 0,
  observers: new Set<Function>(),
  // Add a reset method to clear the queue when navigating
  reset: function() {
    this.currentIndex = 0
    this.observers.clear()
  }
}

// Reset queue when the page loads/reloads
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => loadingQueue.reset())
}

// Check if Intersection Observer is supported
const hasIntersectionObserver = typeof window !== 'undefined' && 'IntersectionObserver' in window

export default {
  beforeMount(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Reset the queue if this is the first image in a new gallery
    // This ensures images load properly when navigating between pages
    if (binding.value && 
        typeof binding.value === 'object' && 
        binding.value.index === 0 && 
        binding.value.resetQueue) {
      loadingQueue.reset()
    }
  },
  
  mounted(el: HTMLElementWithCleanup, binding: DirectiveBinding) {
    // Parse binding value
    let options: LazyLoadOptions;
    
    if (typeof binding.value === 'string') {
      // Legacy string format
      options = {
        url: binding.value,
        index: parseInt(el.dataset.index || '0'),
        resetQueue: el.dataset.index === '0'
      }
    } else {
      // Object format
      options = binding.value as LazyLoadOptions
    }
    
    // Add loading class
    el.classList.add('image-loading')
    
    // Function to load the image
    function loadImage() {
      // Create new image object
      const img = new Image()
      img.src = options.url
      
      img.onload = () => {
        if (options.background || el.tagName !== 'IMG') {
          el.style.backgroundImage = `url(${options.url})`
        } else {
          const imageElement = el as HTMLImageElement
          imageElement.src = options.url
        }
        el.classList.remove('image-loading')
        el.classList.add('image-loaded')
        
        // Increment the current index and notify observers if using queue
        if (typeof options.index === 'number') {
          loadingQueue.currentIndex++
          loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
        }
      }
      
      img.onerror = () => {
        console.error(`Failed to load image: ${options.url}`)
        
        el.classList.remove('image-loading')
        el.classList.add('image-loaded', 'image-error')
        
        // Move to next image even if this one failed
        if (typeof options.index === 'number') {
          loadingQueue.currentIndex++
          loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
        }
      }
    }
    
    // Define checkAndLoad function for queue-based approach
    const checkAndLoad = (currentIndex: number) => {
      if (options.index === currentIndex) {
        loadImage()
      }
    }
    
    // Cleanup function
    const cleanup = () => {
      // Remove observer if it exists
      if (el._observer) {
        el._observer.disconnect()
        el._observer = undefined
      }
      
      // Remove from queue if using index-based loading
      if (typeof options.index === 'number') {
        loadingQueue.observers.delete(checkAndLoad)
      }
    }
    
    // Store cleanup function
    el._cleanup = cleanup
    
    // If using Intersection Observer
    if (hasIntersectionObserver && typeof options.index !== 'number') {
      // Create observer with options
      const observerOptions = {
        root: null,
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0
      }
      
      el._observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadImage()
          // Disconnect observer after loading
          if (el._observer) {
            el._observer.disconnect()
            el._observer = undefined
          }
        }
      }, observerOptions)
      
      // Start observing
      el._observer.observe(el)
    } else {
      // Use queue-based approach for backward compatibility
      // Register as an observer
      loadingQueue.observers.add(checkAndLoad)
      
      // Check immediately if this image should load
      checkAndLoad(loadingQueue.currentIndex)
    }
  },
  
  unmounted(el: HTMLElementWithCleanup) {
    // Clean up when directive is unmounted
    if (el._cleanup) {
      el._cleanup()
    }
  }
} 