<script setup>
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import MainText from '../components/MainText.vue';
import InfoText from '../components/InfoText.vue';
import { renderRichText } from "@storyblok/vue";
import useStoryblok from '../utils/useStoryblok';
import { createImageSettings } from '../utils/imageSettings';
import { computed } from 'vue';

// Create image settings using our utility - high quality for main show, thumbnail for others
const mainShowImageSettings = createImageSettings('high');
const otherShowsImageSettings = createImageSettings('thumbnail');

// Use our Storyblok composable with 'show' type
const {
  story,
  stories: otherShows,
  isLoading,
  contentReady,
  errorMessage,
  formatImage,
  formatImages,
  navigateTo
} = useStoryblok({
  type: 'show',
  preload: true,
  watchRoute: true

});

const randomOtherShows = computed(() => {
  if (!otherShows.value || otherShows.value.length === 0) return [];
  return otherShows.value
    .slice() // клон
    .sort(() => 0.5 - Math.random()) // перемішати
    .slice(0, 4); // взяти перші 4
});


// Handle navigation to another show
const navigateToShow = (slug) => {
  navigateTo(slug);
};

// Format images with preset settings
const formatMainShowImages = (visuals) => {
  return formatImages(visuals, mainShowImageSettings);
};

const formatOtherShowsImages = (visuals) => {
  return formatImages(visuals, otherShowsImageSettings);
};
</script>

<template>
  <div class="show-page">
    <!-- Content area with loading state -->
    <div class="content-area">
      <!-- <LoadingIndicator :isLoading="isLoading" /> -->
      
      <!-- Error message display for complete failure -->
      <div v-if="errorMessage && !story && !isLoading" class="error-message">
        <p>{{ errorMessage }}</p>
        <p>Redirecting to shows page...</p>
        <BaseButton to="/shows">Go to Shows</BaseButton>
      </div>
      
      <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
        <!-- Show warning message if using fallback -->
        <div v-if="errorMessage" class="warning-message">
          <p>{{ errorMessage }}</p>
        </div>
        
        <ImageGallery
          v-if="story.content?.visuals && story.content.visuals.length > 0"
          :name="story.content?.title_tag || ''"
          :location="story.content?.location_tag || ''"
          :date="story.content?.date_tag || ''"
          :slug="story.slug"
          :images="formatMainShowImages(story.content.visuals)" 
          :repeatCount="1"
          :imageHeight="`${mainShowImageSettings.height}px`"
          :imageQuality="mainShowImageSettings.quality"
          :imageFormat="mainShowImageSettings.format"
          :resolutionRatio="mainShowImageSettings.resolutionRatio"
          :isActive="true"
        />
        
        <!-- Fallback message if no visuals -->
        <div v-else class="no-images-message">
          <p>No images available for this show</p>
        </div>
        
        <!-- Using MainText with paragraph (default) -->
        <MainText>
          {{ story.content?.main_text || 'No Description Available' }}
        </MainText>
        
        <InfoText :html="renderRichText(story.content?.info_text || '')" />
        
        <div class="button-container">
          <BaseButton to="/shows">Other Shows</BaseButton>
        </div>
        
        <div v-if="randomOtherShows.length > 0" class="other-shows-container">
          <div v-for="show in randomOtherShows" :key="show.id">
            <ImageGallery
              :name="show.content?.title_tag || 'Untitled Show'"
              :location="show.content?.location_tag || ''"
              :date="show.content?.date_tag || ''"
              :slug="show.slug"
              :images="formatOtherShowsImages(show.content.visuals)"
              :repeatCount="1"
              :imageHeight="otherShowsImageSettings.height + 'rem'"
              :imageWidth="'auto'"
              :imageQuality="otherShowsImageSettings.quality"
              :imageFormat="otherShowsImageSettings.format"
              :resolutionRatio="otherShowsImageSettings.resolutionRatio"
            />
          </div>
        </div>
        
        <div v-else class="no-shows-message">
          <p>No other shows available</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Content area that contains both loading and content */
.content-area {
  position: relative;
  min-height: 80vh;
}

/* Content visibility transition */
.content-container {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-visible {
  opacity: 1;
}

h1 {
  font-size: 2rem;
  margin: 20px 0;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.image-container img {
  width: 200px;
  height: 600px;
  object-fit: cover;
  border-radius: 5px;
}

.gallery-item img{
  height: 55vh;
}

.button-container {
  margin: 2rem;
}

.other-shows-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  width: 100%;
}

/* Error message styling */
.error-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: #f8f8f8;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.error-message p {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

/* Warning message styling */
.warning-message {
  text-align: center;
  padding: 1rem;
  margin: 1rem auto;
  max-width: 800px;
  background-color: #fff3cd;
  border-left: 4px solid #ffc107;
  border-radius: 4px;
}

.warning-message p {
  font-size: 1rem;
  margin: 0;
  color: #856404;
}

/* No images message */
.no-images-message, .no-shows-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}
</style>
