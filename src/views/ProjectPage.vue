<script>
// Import necessary components and utilities
import { useRoute, useRouter } from 'vue-router';
import BaseButton from '../components/BaseButton.vue';
import ImageGallery from '../components/ImageGallery.vue';
import ProjectCard from '../components/ProjectCard.vue';
import LoadingIndicator from '../components/LoadingIndicator.vue';
import MainText from '../components/MainText.vue';
import InfoText from '../components/InfoText.vue';
import useStoryblok from '../utils/useStoryblok';

export default {
  name: 'ProjectPage',
  components: {
    BaseButton,
    ImageGallery,
    ProjectCard,
    LoadingIndicator,
    MainText,
    InfoText
  },
  setup() {
    const route = useRoute();
    const router = useRouter();

    // Use our Storyblok composable
    const {
      story,
      stories,
      isLoading,
      contentReady,
      errorMessage,
      formatImage,
      formatImages,
      navigateTo
    } = useStoryblok({
      type: 'project',
      preload: true,
      watchRoute: true,
      onError: (error, slug) => {
        console.error(`Custom error handler for project ${slug}:`, error);
      }
    });

    // Handle navigation to another project
    const navigateToProject = (slug) => {
      navigateTo(slug);
    };

    return {
      story,
      stories,
      isLoading,
      contentReady,
      errorMessage,
      formatImage,
      formatImages,
      navigateToProject
    };
  }
};
</script>

<template>
  <div class="project-page">
    <!-- Content area with loading state -->
    <div class="content-area">
      <!-- <LoadingIndicator :isLoading="isLoading" /> -->
      
      <!-- Error message display for complete failure -->
      <div v-if="errorMessage && !story && !isLoading" class="error-message">
        <p>{{ errorMessage }}</p>
        <p>Redirecting to projects page...</p>
        <BaseButton to="/projects">Go to Projects</BaseButton>
      </div>
      
      <!-- Only show content when it's ready and not in loading state -->
      <div v-if="story && contentReady" class="content-container" :class="{ 'content-visible': !isLoading }">
        <!-- Show warning message if using fallback -->
        <div v-if="errorMessage" class="warning-message">
          <p>{{ errorMessage }}</p>
        </div>
        
        <!-- Project tags moved to the top of the page -->
        <div class="project-tags">
          <BaseButton 
            v-if="story.content?.title_tag && story.content.title_tag.trim().length > 0" 
            :to="`/projects/${story.slug.split('/').pop()}`" 
            variant="active">{{ story.content.title_tag }}</BaseButton>
          <BaseButton 
            v-if="story.content?.location_tag && story.content.location_tag.trim().length > 0" 
            variant="grey">{{ story.content.location_tag }}</BaseButton>
          <BaseButton 
            v-if="(story.content?.date_tag || story.content?.year_tag) && (story.content?.date_tag || story.content?.year_tag).trim().length > 0" 
            variant="grey">{{ story.content?.date_tag || story.content?.year_tag }}</BaseButton>
        </div>
        
        <!-- Using MainText with text prop -->
        <!-- <MainText :text="story.content?.main_text || 'No Description Available'" /> -->
        
        <!-- Alternative: Using MainText with slot content -->
        <MainText>
          {{ story.content?.main_text || 'No Description Available' }}
        </MainText>
        
        <!-- Only show gallery if visuals exist, removed tag props -->
        <ImageGallery 
          v-if="story.content?.visuals && story.content.visuals.length > 0"
          :slug="story.slug" 
          :images="formatImages(story.content.visuals, { width: 0, height: 690, quality: 85 })" 
          :repeatCount="1"
          :imageHeight="'690rem'"
          :imageQuality="85"
          :isActive="true"
        />
        
        <!-- Fallback message if no visuals -->
        <div v-else class="no-images-message">
          <p>No images available for this project</p>
        </div>
        
        <InfoText :text="story.content?.info_text || ''" />
        
        <div class="button-container">
          <BaseButton to="/projects">Other projects</BaseButton>
        </div>
        
        <div v-if="stories && stories.length > 0" class="image-grid">
          <ProjectCard
            v-for="project in stories"
            :key="project.id"
            :image="formatImage(project)"
            :projectName="project.content?.title_tag || 'Untitled Project'"
            :year="project.content?.year_tag || ''"
            :slug="project.slug"
            :useImgTag="true"
            @click="navigateToProject(project.slug.split('/').pop())"
          />
        </div>
        
        <div v-else class="no-projects-message">
          <p>No other projects available</p>
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

/* Project tags styling */
.project-tags {
  display: flex;
  gap: 3rem;
  margin-left: 3rem;
  flex-wrap: wrap;
  align-items: center;
}

.button-container {
  margin: 5vh 0 0 3rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  padding: 3rem;
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
.no-images-message, .no-projects-message {
  text-align: center;
  padding: 2rem;
  margin: 2rem auto;
  background-color: #f8f8f8;
  border-radius: 8px;
}

/* Responsive adjustments for mobile */
@media screen and (max-width: 640px) {
  .image-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  padding: 3rem;
  /* aspect-ratio: 1/1 !important; */
}

.project-card{
  /* height: 10vh !important; */
  /* aspect-ratio: 1/1 !important; */
}

.project-card {
    min-height: 100% !important;
  }
}
</style>
