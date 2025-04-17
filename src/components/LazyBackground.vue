<template>
  <div 
    v-lazy-load="{
      url: src,
      threshold: threshold,
      rootMargin: rootMargin,
      background: true
    }"
    :class="['lazy-background', { 'image-loaded': loaded }, customClass]"
    :style="backgroundStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'LazyBackground',
  props: {
    src: {
      type: String,
      required: true
    },
    width: {
      type: [String, Number],
      default: '100%'
    },
    height: {
      type: [String, Number],
      default: '100%'
    },
    backgroundSize: {
      type: String,
      default: 'cover'
    },
    backgroundPosition: {
      type: String,
      default: 'center'
    },
    threshold: {
      type: Number,
      default: 0.1
    },
    rootMargin: {
      type: String,
      default: '50px'
    },
    customClass: {
      type: String,
      default: ''
    }
  },
  
  data() {
    return {
      loaded: false
    }
  },
  
  computed: {
    backgroundStyle() {
      return {
        width: typeof this.width === 'number' ? `${this.width}px` : this.width,
        height: typeof this.height === 'number' ? `${this.height}px` : this.height,
        backgroundSize: this.backgroundSize,
        backgroundPosition: this.backgroundPosition
      }
    }
  },
  
  mounted() {
    // Listen for the image loaded class to be added
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && 
            mutation.attributeName === 'class' &&
            this.$el.classList.contains('image-loaded')) {
          this.loaded = true
          observer.disconnect()
        }
      })
    })
    
    observer.observe(this.$el, { attributes: true })
  }
}
</script>

<style>
.lazy-background {
  position: relative;
  background-repeat: no-repeat;
  transition: opacity 0.3s ease;
}

.lazy-background:not(.image-loaded) {
  opacity: 0;
}

.lazy-background.image-loaded {
  opacity: 1;
}
</style> 