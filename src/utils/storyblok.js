import { ref } from 'vue';
import { useStoryblokApi } from '@storyblok/vue';

// Create a singleton cache that persists across component instances
const projectCache = ref({});
const storyCache = ref({});

// Default configuration
const defaultConfig = {
  maxRetries: 3,
  retryDelay: 1000, // Base delay in ms (will be multiplied by retry count for exponential backoff)
  cacheEnabled: true
};

/**
 * Loads a story from Storyblok with retry logic and caching
 * @param {string} path - The path to the story (e.g., 'projects/my-project')
 * @param {Object} options - Options for the request
 * @param {number} options.maxRetries - Maximum number of retry attempts
 * @param {number} options.retryDelay - Base delay between retries in ms
 * @param {boolean} options.cacheEnabled - Whether to use cache
 * @param {Object} options.params - Additional parameters to pass to the Storyblok API
 * @returns {Promise<Object>} - The story data and status
 */
export const loadStory = async (path, options = {}) => {
  const config = { ...defaultConfig, ...options };
  const { maxRetries, retryDelay, cacheEnabled } = config;
  const params = options.params || { version: 'published' };
  
  const storyblokApi = useStoryblokApi();
  
  // Check cache first if enabled
  if (cacheEnabled && storyCache.value[path]) {
    console.log(`Loading story from cache: ${path}`);
    return {
      data: storyCache.value[path],
      status: 'success',
      fromCache: true
    };
  }
  
  // Try to load with retries
  let retryCount = 0;
  let error = null;
  
  while (retryCount < maxRetries) {
    try {
      const response = await storyblokApi.get(`cdn/stories/${path}`, params);
      
      // Cache the result if caching is enabled
      if (cacheEnabled) {
        storyCache.value[path] = response.data.story;
      }
      
      return {
        data: response.data.story,
        status: 'success',
        fromCache: false
      };
    } catch (err) {
      retryCount++;
      error = err;
      console.error(`Failed to load story (attempt ${retryCount}/${maxRetries}): ${path}`, err);
      
      if (retryCount < maxRetries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, retryDelay * retryCount));
      }
    }
  }
  
  // All retries failed
  return {
    data: null,
    status: 'error',
    error,
    fromCache: false
  };
};

/**
 * Loads multiple stories from Storyblok with caching
 * @param {Object} options - Options for the request
 * @param {string} options.startsWith - Filter stories that start with this path
 * @param {Object} options.params - Additional parameters to pass to the Storyblok API
 * @returns {Promise<Object>} - The stories data and status
 */
export const loadStories = async (options = {}) => {
  const storyblokApi = useStoryblokApi();
  const params = {
    version: 'published',
    ...options.params
  };
  
  if (options.startsWith) {
    params.starts_with = options.startsWith;
  }
  
  try {
    const response = await storyblokApi.get('cdn/stories', params);
    
    // Cache individual stories
    if (defaultConfig.cacheEnabled) {
      response.data.stories.forEach(story => {
        const path = story.full_slug;
        storyCache.value[path] = story;
        
        // Also cache in the project cache if it's a project
        if (path.startsWith('projects/')) {
          const slug = path.split('/').pop();
          projectCache.value[slug] = story;
        }
      });
    }
    
    return {
      data: response.data.stories,
      status: 'success'
    };
  } catch (error) {
    console.error('Failed to load stories:', error);
    return {
      data: [],
      status: 'error',
      error
    };
  }
};

/**
 * Preloads all projects into cache
 * @returns {Promise<Object>} - Status of the preload operation
 */
export const preloadProjects = async () => {
  const result = await loadStories({
    startsWith: 'projects/'
  });
  
  if (result.status === 'success') {
    console.log('Preloaded projects to cache:', 
      result.data.map(project => project.slug.split('/').pop()));
  }
  
  return result;
};

/**
 * Formats images from Storyblok for display with advanced options
 * @param {Array} visuals - Array of visual objects from Storyblok
 * @param {Object} options - Image transformation options
 * @param {number} options.width - Desired width of images (0 for auto)
 * @param {number} options.height - Desired height of images (0 for auto)
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.format - Image format (webp, jpg, etc.)
 * @returns {Array} - Formatted image objects
 */
export const formatImages = (visuals, options = {}) => {
  if (!visuals || !Array.isArray(visuals) || visuals.length === 0) {
    console.warn('No visuals found or invalid visuals format');
    return [];
  }
  
  // Use options directly without modifications
  const {
    width = 0,
    height = 230,
    quality = 70,
    format = 'webp'
  } = options;
  
  // Build transformation string
  let transform = `/m/${width}x${height}`;
  
  // Add filters if any are specified
  const filters = [];
  if (quality) filters.push(`quality(${quality})`);
  if (format) filters.push(`format(${format})`);
  
  if (filters.length > 0) {
    transform += `/filters:${filters.join(':')}`;
  }
  
  return visuals.map(visual => ({
    url: createImageUrl(visual.filename, options),
    alt: visual.alt || 'Image'
  }));
};

/**
 * Formats a single image from a project for display with advanced options
 * @param {Object} project - Project object from Storyblok
 * @param {Object} options - Image transformation options
 * @param {number} options.width - Desired width of image (0 for auto)
 * @param {number} options.height - Desired height of image (0 for auto)
 * @param {number} options.quality - Image quality (1-100)
 * @param {string} options.format - Image format (webp, jpg, etc.)
 * @returns {string} - URL of the formatted image
 */
export const formatImage = (project, options = {}) => {
  if (!project || !project.content) {
    console.warn('Invalid project or missing content:', project);
    return getFallbackImageUrl(options);
  }
  
  // Default options
  const {
    width = 0,  // Default width for thumbnails
    height = 690, // Default height for thumbnails
    quality = 75,
    format = null
  } = options;
  
  if (project.content.visuals && Array.isArray(project.content.visuals) && project.content.visuals.length > 0) {
    const filename = project.content.visuals[0].filename;
    console.log(`Found image filename: ${filename} for project: ${project.name || project.slug}`);
    
    // Build transformation string
    let transform = `/m/${width}x${height}`;
    
    // Add filters if any are specified
    const filters = [];
    if (quality) filters.push(`quality(${quality})`);
    if (format) filters.push(`format(${format})`);
    
    if (filters.length > 0) {
      transform += `/filters:${filters.join(':')}`;
    }
    
    // Check if the filename already contains Storyblok domain
    // If it does, we need to append the transform to the existing URL
    // If not, we assume it's just the filename part and return as is
    let finalUrl;
    if (filename.includes('storyblok.com')) {
      // For URLs that already have transformations, we need to remove them first
      const baseUrl = filename.split('/m/')[0];
      finalUrl = `${baseUrl}${transform}`;
    } else {
      finalUrl = `${filename}${transform}`;
    }
    
    console.log(`Generated image URL: ${finalUrl}`);
    
    // Force a unique URL to prevent caching issues
    finalUrl = finalUrl + (finalUrl.includes('?') ? '&' : '?') + 'v=' + Date.now();
    
    return finalUrl;
  } else {
    console.warn(`No visuals found for project: ${project.name || project.slug}`);
    return getFallbackImageUrl(options);
  }
};

/**
 * Gets a fallback image URL with the specified dimensions
 * @param {Object} options - Image options
 * @returns {string} - Fallback image URL
 */
const getFallbackImageUrl = (options = {}) => {
  // Return empty string instead of placeholder image
  return '';
};

/**
 * Creates a Storyblok image transformation URL with specific options
 * @param {string} filename - Original Storyblok image filename
 * @param {Object} options - Image transformation options
 * @returns {string} - Transformed image URL
 */
export const createImageUrl = (filename, options = {}) => {
  if (!filename) {
    console.warn('No filename provided for image transformation');
    return '';
  }
  
  // Default options
  const {
    width = 0,
    height = 230,
    quality = 70,
    format = null,
    crop = null,
    fit = null
  } = options;
  
  // Use height directly without applying resolution ratio again
  const finalWidth = width > 0 ? Math.round(width) : 0;
  const finalHeight = height > 0 ? Math.round(height) : 0;
  
  // Build transformation string
  let transform = `/m/${finalWidth}x${finalHeight}`;
  
  // Add filters if any are specified
  const filters = [];
  if (quality) filters.push(`quality(${quality})`);
  if (format) filters.push(`format(${format})`);
  if (crop) filters.push(`crop(${crop})`);
  if (fit) filters.push(`fit(${fit})`);
  
  if (filters.length > 0) {
    transform += `/filters:${filters.join(':')}`;
  }
  
  // Check if the filename already contains Storyblok domain
  if (filename.includes('storyblok.com')) {
    const baseUrl = filename.split('/m/')[0];
    return `${baseUrl}${transform}`;
  }
  
  return `${filename}${transform}`;
};

/**
 * Clears the cache
 * @param {string} type - Type of cache to clear ('all', 'projects', 'stories')
 */
export const clearCache = (type = 'all') => {
  if (type === 'all' || type === 'projects') {
    projectCache.value = {};
  }
  
  if (type === 'all' || type === 'stories') {
    storyCache.value = {};
  }
  
  console.log(`Cache cleared: ${type}`);
};

/**
 * Gets a fallback project when the requested one is not available
 * @returns {Object|null} - A fallback project or null if none available
 */
export const getFallbackProject = () => {
  const projectSlugs = Object.keys(projectCache.value);
  if (projectSlugs.length > 0) {
    return {
      slug: projectSlugs[0],
      data: projectCache.value[projectSlugs[0]]
    };
  }
  return null;
};

/**
 * Calculates optimal image dimensions based on device pixel ratio and screen size
 * @param {Object} options - Base image options
 * @param {number} options.width - Base width in pixels
 * @param {number} options.height - Base height in pixels
 * @param {number} options.quality - Base quality (1-100)
 * @param {number} options.resolutionRatio - Manual resolution ratio override
 * @returns {Object} - Optimized image options
 */
export const getOptimalImageDimensions = (options = {}) => {
  const {
    width = 0,
    height = 230,
    quality = 70
  } = options;
  
  // Return dimensions without modification
  return {
    width,
    height,
    quality,
    appliedRatio: 1
  };
};

// Export the cache for advanced usage
export const cache = {
  projects: projectCache,
  stories: storyCache
}; 