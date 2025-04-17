<script setup>
import { useStoryblokApi } from '@storyblok/vue';
import { ref, onMounted, computed } from 'vue';
import ImageGallery from '../components/ImageGallery.vue';
import { useRouter } from 'vue-router';
import { formatImages as storyblokFormatImages } from '../utils/storyblok';
import { createImageSettings } from '../utils/imageSettings';

const storyblokApi = useStoryblokApi();
const stories = ref([]);
const router = useRouter();

// Create image settings using our utility with the thumbnail preset for gallery
const imageSettings = createImageSettings('thumbnail');

// Computed property to get the actual height in pixels for the container
const containerHeight = computed(() => {
  return `${imageSettings.height}rem`;
});

onMounted(async () => {
  try {
    const response = await storyblokApi.get('cdn/stories', {
      starts_with: 'shows/',
    });
    stories.value = response.data.stories; 
  } catch (error) {
    console.error('Error fetching stories:', error);
  }
});

// Use the utility function from storyblok.js with our settings
const formatImages = (visuals, customOptions = {}) => {
  // Merge default settings with any custom options
  const options = {
    ...imageSettings,
    ...customOptions
  };
  
  return storyblokFormatImages(visuals, options);
};

</script>

<template>
  <div class="shows">
    <div v-for="story in stories" :key="story.uuid">
      <ImageGallery 
        :images="formatImages(story.content.visuals)"
        :name="story.content?.title_tag"
        :location="story.content?.location_tag"
        :date="story.content?.date_tag"
        :slug="story.slug"
        :repeatCount="5"
        :imageHeight="containerHeight"
        :imageWidth="'auto'"
        :imageQuality="imageSettings.quality"
        :imageFormat="imageSettings.format"
        :resolutionRatio="imageSettings.resolutionRatio"
      />
    </div>
  </div>
</template>

<style scoped>
.shows {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
