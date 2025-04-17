<template>
  <div class="objects-container">
    <FilterComponent @filter-changed="handleFilter" />
    <div class="objects-grid">
      <ObjectCard
        class="object-card"
        v-for="story in filteredStories"
        :key="story.id"
        :image="story.content?.visuals?.[0] ? formatImage(story.content.visuals[0]) : ''"
        :objectName="story.content?.title_tag || ''"
        :price="story.content?.price_tag || ''"
        :slug="story.slug"
      />
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue';
import ObjectCard from '../components/ObjectCard.vue';
import FilterComponent from '../components/FilterComponent.vue';
import { useStoryblokApi } from '@storyblok/vue';

export default {
  name: 'Objects',
  components: {
    ObjectCard,
    FilterComponent
  },
  setup() {
    const storyblokApi = useStoryblokApi();
    const stories = ref([]);
    const currentFilter = ref('all');

    const filteredStories = computed(() => {
      switch (currentFilter.value) {
        case 'inStock':
          return stories.value.filter(story => story.content?.in_stock);
        case 'chronological':
          return [...stories.value].sort((a, b) => 
            new Date(b.created_at) - new Date(a.created_at)
          );
        case 'alphabetical':
          return [...stories.value].sort((a, b) => 
            (a.content?.title_tag || '').localeCompare(b.content?.title_tag || '')
          );
        default:
          return stories.value;
      }
    });

    const handleFilter = (filter) => {
      currentFilter.value = filter;
    };

    const formatImage = (visual) => {
      console.log('Visual data:', visual); // для отладки
      if (!visual || !visual.filename) {
        return '';
      }
      const formattedUrl = `${visual.filename}/m/800x600`;
      console.log('Formatted URL:', formattedUrl); // для отладки
      return formattedUrl;
    };

    onMounted(async () => {
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'objects/',
          version: 'published' // добавим это для получения опубликованного контента
        });
        
        // Добавим проверку перед присвоением
        if (response.data && response.data.stories) {
          stories.value = response.data.stories;
          console.log('Loaded stories:', stories); // для отладки
        }
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    });

    return {
      stories,
      filteredStories,
      formatImage,
      handleFilter
    };
  }
}
</script>

<style scoped>
.objects-container {
  width: 100%;
}

.objects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px; /* добавим отступы между карточками */
  width: 100%;
  padding: 20px; /* добавим отступы от краев */
}

.object-card {
  height: 50vh;
  width: 100%;
  overflow: hidden; /* предотвратим выход контента за пределы карточки */
}

.object-card:hover {
  /* filter:grayscale(0%); */
  /* height: 50%; */
}

/* Responsive layout for mobile devices */
@media (max-width: 768px) {
  .objects-grid {
    grid-template-columns: 1fr;
    padding: 10px;
  }
}
</style> 