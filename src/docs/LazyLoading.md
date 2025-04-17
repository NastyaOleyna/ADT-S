# Lazy Loading Images in ADT-VUE-CMS

This document explains how to use the lazy loading functionality across your website to improve performance by only loading images when they are about to enter the viewport.

## Global Directive

The `v-lazy-load` directive is registered globally and can be used on any image element:

```vue
<img v-lazy-load="imageUrl" alt="Lazy loaded image">
```

Or with more options:

```vue
<img 
  v-lazy-load="{
    url: imageUrl,
    threshold: 0.1,
    rootMargin: '50px'
  }" 
  alt="Lazy loaded image"
>
```

## Reusable Components

### LazyImage Component

For a complete solution with loading and error states:

```vue
<LazyImage
  src="https://example.com/image.jpg"
  alt="My lazy loaded image"
  height="300px"
  width="500px"
  object-fit="cover"
/>
```

You can also customize the loading and error states using slots:

```vue
<LazyImage src="https://example.com/image.jpg">
  <template #placeholder>
    <div class="custom-loader">Loading...</div>
  </template>
  <template #error>
    <div class="custom-error">Failed to load image</div>
  </template>
</LazyImage>
```

### LazyBackground Component

For background images:

```vue
<LazyBackground
  src="https://example.com/background.jpg"
  height="300px"
  background-size="cover"
  background-position="center"
>
  <div class="content">Content over the background</div>
</LazyBackground>
```

## Options

The lazy loading directive accepts the following options:

- `url`: (required) The URL of the image to load
- `threshold`: (optional, default: 0.1) The visibility threshold (0-1) that triggers loading
- `rootMargin`: (optional, default: '50px') Margin around the root observer
- `background`: (optional, default: false) Whether to set as background image
- `index`: (optional) Used for queue-based loading in galleries
- `resetQueue`: (optional) Whether to reset the loading queue

## Performance Tips

1. Use appropriate image sizes for different devices
2. Set a reasonable `rootMargin` to preload images before they enter the viewport
3. Use the `threshold` option to control when images start loading
4. For galleries, consider using a smaller `threshold` to load images as they get closer to the viewport

## Browser Support

The lazy loading implementation uses the Intersection Observer API, which is supported in all modern browsers. For older browsers, it falls back to a queue-based approach. 