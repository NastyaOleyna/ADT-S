<template>
  <div class="lazy-image-container" :style="containerStyle">
    <img
      v-lazy-load="{
        url: src,
        threshold: threshold,
        rootMargin: rootMargin,
        background: false
      }"
      :alt="alt"
      :class="['lazy-image', imageClass]"
      :style="imageStyle"
    />
    <div v-if="loading" class="lazy-image-placeholder">
      <slot name="placeholder">
        <div class="lazy-image-loading"></div>
      </slot>
    </div>
    <div v-if="error" class="lazy-image-error">
      <slot name="error">
        <div class="lazy-image-error-icon">!</div>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LazyImage',
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Image'
    },
    width: {
      type: [String, Number],
      default: 'auto'
    },
    height: {
      type: [String, Number],
      default: 'auto'
    },
    objectFit: {
      type: String,
      default: 'cover'
    },
    threshold: {
      type: Number,
      default: 0.1
    },
    rootMargin: {
      type: String,
      default: '50px'
    },
    imageClass: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      loading: true,
      error: false
    }
  },
  
  computed: {
    containerStyle() {
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height
      }
    },
    
    imageStyle() {
      return {
        objectFit: this.objectFit
      }
    }
  },
  
  mounted() {
    // Listen for image loading events
    const img = this.$el.querySelector('img')
    if (img) {
      img.addEventListener('load', this.handleLoad)
      img.addEventListener('error', this.handleError)
    }
  },
  
  beforeUnmount() {
    // Clean up event listeners
    const img = this.$el.querySelector('img')
    if (img) {
      img.removeEventListener('load', this.handleLoad)
      img.removeEventListener('error', this.handleError)
    }
  },
  
  methods: {
    handleLoad() {
      this.loading = false
    },
    
    handleError() {
      this.loading = false
      this.error = true
    }
  }
}
</script>

<style>
.lazy-image-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
  width: 100%;
  min-height: 50px;
}

.lazy-image {
  width: 100%;
  height: 100%;
  transition: opacity 0.3s ease;
}

.lazy-image.image-loading {
  opacity: 0;
}

.lazy-image.image-loaded {
  opacity: 1;
}

.lazy-image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
}

.lazy-image-loading {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top-color: #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.lazy-image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f8f8f8;
}

.lazy-image-error-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: #ff5252;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .lazy-image-container {
    min-height: 30px;
  }
}
</style> 