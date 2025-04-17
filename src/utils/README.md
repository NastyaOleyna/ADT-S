# Storyblok Utilities

This directory contains utility functions for working with Storyblok in the ADT-VUE-CMS project.

## Files

- `storyblok.js` - Core utility functions for working with Storyblok API
- `useStoryblok.js` - Vue composable for easy integration in components

## Usage

### Basic Usage with Composable

The easiest way to use these utilities is with the `useStoryblok` composable:

```js
import useStoryblok from '../utils/useStoryblok';

// In your component's setup function
const {
  story,           // The current story data
  stories,         // Other stories of the same type
  isLoading,       // Loading state
  contentReady,    // Content ready state
  errorMessage,    // Error message if any
  formatImage,     // Utility to format a single image
  formatImages,    // Utility to format multiple images
  navigateTo       // Function to navigate to another story
} = useStoryblok({
  type: 'project',  // Type of content ('project', 'show', etc.)
  preload: true,    // Whether to preload all items of this type
  watchRoute: true  // Whether to watch route changes
});
```

### Configuration Options

The `useStoryblok` composable accepts the following options:

- `type` (string): Type of content to load ('project', 'show', etc.)
- `preload` (boolean): Whether to preload all items of this type
- `watchRoute` (boolean): Whether to watch route changes
- `routeParam` (string): Route parameter to watch (default: 'slug')
- `onError` (function): Callback for custom error handling

### Advanced Usage with Direct API

For more control, you can use the utility functions directly:

```js
import { loadStory, loadStories, formatImage } from '../utils/storyblok';

// Load a single story
const result = await loadStory('projects/my-project', {
  maxRetries: 3,
  retryDelay: 1000,
  cacheEnabled: true
});

if (result.status === 'success') {
  // Use result.data
} else {
  // Handle error
}

// Load multiple stories
const storiesResult = await loadStories({
  startsWith: 'projects/'
});

// Format an image
const imageUrl = formatImage(project);
```

### Cache Management

The utilities include a caching system that persists across component instances:

```js
import { clearCache, cache } from '../utils/storyblok';

// Clear all cache
clearCache();

// Clear specific cache type
clearCache('projects');

// Access cache directly
console.log(cache.projects.value);
```

## Template Example

Here's an example of how to use the composable in a template:

```vue
<template>
  <div>
    <LoadingIndicator :isLoading="isLoading" />
    
    <!-- Error handling -->
    <div v-if="errorMessage && !story && !isLoading" class="error-message">
      <p>{{ errorMessage }}</p>
    </div>
    
    <!-- Content -->
    <div v-if="story && contentReady" class="content">
      <!-- Warning if using fallback -->
      <div v-if="errorMessage" class="warning-message">
        <p>{{ errorMessage }}</p>
      </div>
      
      <!-- Story content -->
      <h1>{{ story.content?.title || 'Untitled' }}</h1>
      
      <!-- Images -->
      <div v-if="story.content?.visuals && story.content.visuals.length > 0">
        <img 
          v-for="image in formatImages(story.content.visuals)" 
          :key="image.url" 
          :src="image.url" 
          :alt="image.alt"
        />
      </div>
      
      <!-- Other stories -->
      <div v-if="stories && stories.length > 0" class="other-stories">
        <div 
          v-for="item in stories" 
          :key="item.id"
          @click="navigateTo(item.slug.split('/').pop())"
        >
          {{ item.content?.title }}
        </div>
      </div>
    </div>
  </div>
</template>
```

## Error Handling

The utilities include robust error handling with:

1. Retry logic with exponential backoff
2. Caching to reduce API calls
3. Fallback content when a story can't be loaded
4. User-friendly error messages
5. Automatic redirection when appropriate

## Performance Considerations

- All successfully loaded stories are cached
- Preloading is used to reduce loading times
- The cache persists across component instances 