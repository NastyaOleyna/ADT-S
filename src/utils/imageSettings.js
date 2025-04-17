import { reactive } from 'vue';
import { getOptimalImageDimensions } from './storyblok';

/**
 * Default image settings for different contexts
 */
export const defaultSettings = {
  // High quality settings for main content and featured images
  high: {
    width: 0, // Auto width
    height: 800, // Fixed height for high quality images
    quality: 80,
    format: 'webp',
    resolutionRatio: 1.5
  },
  
  // Lower quality settings for thumbnails and gallery previews
  thumbnail: {
    width: 0,
    height: 260,
    quality: 75, // Slightly increased quality for better thumbnails
    format: 'webp',
    resolutionRatio: 1.5
  }
};

/**
 * Creates reactive image settings with the specified preset
 * @param {string} preset - Preset name ('high' or 'thumbnail')
 * @param {Object} customSettings - Custom settings to override the preset
 * @returns {Object} - Reactive image settings object
 */
export const createImageSettings = (preset = 'thumbnail', customSettings = {}) => {
  const baseSettings = defaultSettings[preset] || defaultSettings.thumbnail;
  
  // If we're on mobile, only adjust quality
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    if (preset === 'high') {
      baseSettings.quality = Math.min(baseSettings.quality, 85);
    } else {
      baseSettings.quality = Math.min(baseSettings.quality, 70);
    }
  }
  
  // Merge settings without applying resolution ratio
  return reactive({
    ...baseSettings,
    ...customSettings
  });
};

/**
 * Optimizes image settings based on the current device
 * @param {Object} settings - Base image settings
 * @returns {Object} - Optimized settings for the current device
 */
export const optimizeForDevice = (settings) => {
  // Get optimal dimensions based on device
  const optimized = getOptimalImageDimensions({
    width: settings.width,
    height: settings.height,
    quality: settings.quality,
    resolutionRatio: settings.resolutionRatio
  });
  
  // Apply optimized values while maintaining minimum quality thresholds
  return {
    ...settings,
    width: optimized.width,
    height: optimized.height,
    quality: Math.max(optimized.quality, settings.preset === 'high' ? 85 : 70) // Ensure minimum quality
  };
};

/**
 * Converts rem-based height to pixels for API requests
 * @param {string|number} height - Height value (can be string with 'rem' or number)
 * @param {number} baseFontSize - Base font size in pixels (default: 16)
 * @returns {number} - Height in pixels
 */
export const remToPixels = (height, baseFontSize = 16) => {
  if (typeof height === 'string') {
    // Extract numeric value from string (e.g., '260rem' -> 260)
    const value = parseFloat(height);
    if (!isNaN(value)) {
      if (height.includes('rem')) {
        return value * baseFontSize;
      }
      if (height.includes('vh')) {
        // Approximate vh to pixels based on viewport height
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return (value / 100) * viewportHeight;
      }
      if (height.includes('px')) {
        return value;
      }
      return value;
    }
  }
  return height || 0;
}; 