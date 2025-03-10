import type { DirectiveBinding } from 'vue'

// Define interface for HTMLElement with cleanup function
interface HTMLElementWithCleanup extends HTMLElement {
  _cleanup?: () => void;
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
    // Extract the image URL and index from binding
    const imageUrl = typeof binding.value === 'string' 
      ? binding.value 
      : binding.value.url
    
    const index = typeof binding.value === 'string' 
      ? parseInt(el.dataset.index || '0') 
      : binding.value.index
    
    // For backward compatibility, if we're using the string format,
    // reset the queue for the first element to ensure it loads
    if (typeof binding.value === 'string' && index === 0) {
      loadingQueue.reset()
    }
    
    // Add loading class
    el.classList.add('image-loading')
    
    function loadImage() {
      // Create new image object
      const img = new Image()
      img.src = imageUrl
      
      // Set a timeout to handle cases where images might not load
      const loadTimeout = setTimeout(() => {
        // If image hasn't loaded after timeout, force progress to next image
        if (el.classList.contains('image-loading')) {
          console.warn(`Image loading timeout for index ${index}: ${imageUrl}`)
          el.classList.remove('image-loading')
          el.classList.add('image-loaded', 'image-error')
          
          // Move to next image to prevent blocking the queue
          loadingQueue.currentIndex++
          loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
        }
      }, 5000) // 5 second timeout
      
      img.onload = () => {
        clearTimeout(loadTimeout)
        
        if (el.tagName === 'IMG') {
          const imageElement = el as HTMLImageElement
          imageElement.src = imageUrl
        } else {
          el.style.backgroundImage = `url(${imageUrl})`
        }
        el.classList.remove('image-loading')
        el.classList.add('image-loaded')
        
        // Increment the current index and notify observers
        loadingQueue.currentIndex++
        loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
      }
      
      img.onerror = () => {
        clearTimeout(loadTimeout)
        console.error(`Failed to load image at index ${index}: ${imageUrl}`)
        
        el.classList.remove('image-loading')
        el.classList.add('image-loaded', 'image-error')
        
        // Move to next image even if this one failed
        loadingQueue.currentIndex++
        loadingQueue.observers.forEach(callback => callback(loadingQueue.currentIndex))
      }
    }
    
    // Check if it's this image's turn to load
    const checkAndLoad = (currentIndex: number) => {
      if (index === currentIndex) {
        loadImage()
      }
    }
    
    // Register as an observer
    loadingQueue.observers.add(checkAndLoad)
    
    // Check immediately if this image should load
    checkAndLoad(loadingQueue.currentIndex)
    
    // Cleanup when element is unmounted
    el._cleanup = () => {
      loadingQueue.observers.delete(checkAndLoad)
    }
  },
  
  unmounted(el: HTMLElementWithCleanup) {
    // Clean up observer when directive is unmounted
    if (el._cleanup) {
      el._cleanup()
    }
  }
} 