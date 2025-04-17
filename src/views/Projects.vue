<template>
  <div class="projects-grid">
    <ProjectCard
      class="project-card"
      v-for="(story, index) in stories"
      :key="story.id"
      :image="formatImage(story)"
      :projectName="story.content.title_tag"
      :year="story.content.year_tag"
      :slug="story.slug"
      @click="navigateToProject"
      :style="{ 
        // transitionDelay: shouldAnimate ? `${index * 5}s` : '0s',
        // opacity: isLoading ? '0' : '1'
      }"
    />
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import ProjectCard from '../components/ProjectCard.vue';
import { useStoryblokApi } from '@storyblok/vue';
import { formatImage } from '../utils/storyblok';
import navigationManager from '../utils/navigationManager';

export default {
  name: 'Projects',
  components: {
    ProjectCard
  },
  setup() {
    const router = useRouter();
    const storyblokApi = useStoryblokApi();
    const stories = ref([]);
    const isLoading = ref(true);
    const shouldAnimate = ref(!localStorage.getItem('hasSeenAnimation'));
    
    const navigateToProject = (slug) => {
      // Use navigation manager for consistent transitions
      navigationManager.navigateTo(router, `/projects/${slug}`);
    };

    onMounted(async () => {
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'projects/',
          version: 'published'
        });
        stories.value = response.data.stories;
        console.log('Projects loaded:', stories.value);
        
        // Add a small delay to ensure smooth animation
        setTimeout(() => {
          isLoading.value = false;
        }, 100);
        
      } catch (error) {
        console.error('Error fetching stories:', error);
        isLoading.value = false;
      }
    });

    return {
      stories,
      formatImage,
      navigateToProject,
      isLoading,
      shouldAnimate
    };
  }
}
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);  /* Creates 2 equal columns */
  width: 100%;
  min-height: 100%;
  padding: 0 3rem 3rem 3rem;
}

.project-card {
  transition: opacity 0.5s ease-out;
}

/* Responsive layout for mobile devices */
@media screen and (max-width: 640px) {
  .projects-grid {

    grid-template-columns: 1fr;
  }
}

</style> 