<template>
<div 
  class="project-card" 
  :class="{ 'use-img-tag': useImgTag }"
>
  <!-- When using img tag approach -->
  <img 
    v-if="useImgTag"
    v-lazy-load="{ url: image, index: 0, resetQueue: true }"
    :data-index="0"
    class="project-card-image"
    alt="Project thumbnail"
    @click="navigateToProject"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  />
  
  <!-- When using background image approach -->
  <div 
    v-else
    v-lazy-load="{ url: image, index: 0, resetQueue: true }"
    :data-index="0"
    class="project-card-background"
    @click="navigateToProject"
    @mouseenter="isHovering = true"
    @mouseleave="isHovering = false"
  ></div>
  
  <!-- Tags are always shown -->
  <div class="project-tags">
    <BaseButton :to="`/projects/${slug}`" :class="{ 'button-hover': isHovering }">{{ projectName }}</BaseButton>
    <BaseButton v-if="year && year.trim().length > 0" variant="grey">{{ year }}</BaseButton>
  </div>
</div>
</template>

<script>
import BaseButton from './BaseButton.vue';
import lazyLoad from '../directives/lazyLoad';
import { useRouter } from 'vue-router';
import navigationManager from '../utils/navigationManager';
import { ref } from 'vue';

export default {
  name: 'ProjectCard',
  
  components: {
    BaseButton
  },

  directives: {
    lazyLoad
  },

  props: {
    projectName: {
      type: String,
      default: 'Sample Project',
      required: true
    },
    year: {
      type: String,
      default: '',
      required: false
    },
    image: {
      type: String,
      default: '',
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    useImgTag: {
      type: Boolean,
      default: true
    }
  },
  
  emits: ['click'],
  
  setup(props, { emit }) {
    const router = useRouter();
    const isHovering = ref(false);
    
    // Method to navigate with proper transition
    const navigateToProject = (event) => {
      // Only navigate if the click was directly on the card (not on a button)
      if (event.target.closest('.base-button') === null) {
        // Start navigation with transition
        navigationManager.navigateTo(router, `/projects/${props.slug}`);
        // Also emit click event for compatibility with existing code
        emit('click', props.slug);
      }
    };
    
    return {
      navigateToProject,
      isHovering
    };
  },
  
  data() {
    return {
      isLoaded: false,
      hasError: false,
      backgroundImage: '',
      shouldAnimate: false
    };
  },
  
  computed: {
    cardStyle() {
      return {
        // backgroundColor: '#f0f0f0',
        backgroundImage: this.useImgTag ? 'none' : this.backgroundImage
      };
    }
  },
  
  methods: {
    setBackgroundImage(url) {
      this.backgroundImage = `url(${url})`;
      this.isLoaded = true;
    },
    
    setErrorState() {
      this.hasError = true;
    }
  },
  
  mounted() {
    // Check if this is the first visit
    this.shouldAnimate = !localStorage.getItem('hasSeenAnimation');
    
    // Log the image URL for debugging
    console.log(`ProjectCard mounted - Image URL: ${this.image}, Slug: ${this.slug}`);
    
    // Set animation as seen
    if (this.shouldAnimate) {
      localStorage.setItem('hasSeenAnimation', 'true');
    }
    
    // Manually preload the image to ensure it works
    if (!this.useImgTag) {
      const img = new Image();
      img.onload = () => {
        this.setBackgroundImage(this.image);
      };
      img.onerror = () => {
        console.error(`Failed to load image: ${this.image}`);
        this.setErrorState();
      };
      img.src = this.image;
    }
  }
}
</script>

<style scoped>
.project-card {
  position: relative;
  display: flex;
  align-items: flex-end;
  /* min-height: 45vh; */
  aspect-ratio: 16/10;
  height: 100%;
  overflow: hidden;
  background-color: transparent; /* Start with transparent background */
}

.project-card:hover .button-black {
    background-color: var(--color-pink-primary);
    color: black;
}

.project-card-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  cursor: pointer;
  transition: opacity 1s ease-out;
  opacity: 1;
}

.project-card-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  z-index: 0;
  cursor: pointer;
  opacity: 1;
  /* transition: opacity 0s ease-out; */
}

/* Loading states */
.project-card-image.image-loading,
.project-card-background.image-loading {
  opacity: 0;
}

.project-card-image.image-loaded,
.project-card-background.image-loaded {
  opacity: v-bind("shouldAnimate ? 0 : 1");
}

.project-card-image.image-error,
.project-card-background.image-error {
  opacity: 0;
}

.project-tags {
  position: relative;
  pointer-events: none !important;
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  margin: 3rem;
  z-index: 1;
  gap: 3rem;
}

/* Style for the button hover effect */
.button-hover {
  /* opacity: 0.75 !important; */
}


@media screen and (max-width: 640px) {
  .project-card {
    min-height: 30vh;
  }
}

</style> 

