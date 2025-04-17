<template>
  <div class="press-container">
    <!-- Добавляем фоновое изображение -->
    <div 
      v-if="activeImage" 
      class="background-image"
      :style="{ backgroundImage: `url(${activeImage})` }"
    ></div>

    <div v-for="(yearGroup, year) in groupedPress" :key="year" class="year-group">
      <BaseButton 
        class="year-button" 
        :disabled="true"
        variant="grey"
      >
        {{ year === 'No Year' ? '' : year }}
      </BaseButton>
      
      <div class="press-items">
        <div v-for="press in yearGroup" :key="press.id" class="press-item">
          <BaseButton 
            class="media-outlet"
            @click="openPressUrl(press.content.URL.url)"
            @mouseenter="showImage(press.content.Media)"
            @mouseleave="hideImage"
            variant="black"
          >
            {{ press.content.media_outlet }}
          </BaseButton>
          
          <BaseButton 
            class="press-title" 
            variant="grey"
          >
            {{ press.content.press_title }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useStoryblokApi } from '@storyblok/vue'
import BaseButton from '../components/BaseButton.vue'

export default {
  name: 'Press',
  components: {
    BaseButton
  },
  setup() {
    const storyblokApi = useStoryblokApi()
    const pressItems = ref([])
    const activeImage = ref(null)

    const groupedPress = computed(() => {
      const groups = {}
      pressItems.value.forEach(item => {
        const year = item.content.year || 'No Year'
        if (!groups[year]) {
          groups[year] = []
        }
        groups[year].push(item)
      })
      // Сортируем года по убыванию
      return Object.fromEntries(
        Object.entries(groups).sort((a, b) => b[0] - a[0])
      )
    })

    const openPressUrl = (url) => {
      if (url) {
        window.open(url, '_blank')
      }
    }

    // Добавляем функции для управления изображением
    const showImage = (media) => {
      console.log('Show image called with media:', media)
      if (media?.filename) {
        activeImage.value = media.filename
        console.log('Setting active image to:', activeImage.value)
      }
    }

    const hideImage = () => {
      console.log('Hide image called')
      activeImage.value = null
    }

    onMounted(async () => {
      try {
        const response = await storyblokApi.get('cdn/stories', {
          starts_with: 'press/',
          version: 'draft',
          resolve_links: 'url'
        })
        
        if (response?.data?.stories) {
          pressItems.value = response.data.stories
          // Добавляем подробный лог первого элемента
          console.log('First press item full content:', pressItems.value[0]?.content)
        }
      } catch (error) {
        console.error('Error fetching press items:', error)
      }
    })

    return {
      groupedPress,
      openPressUrl,
      activeImage,
      showImage,
      hideImage
    }
  }
}
</script>

<style scoped>
.press-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  position: relative; /* Для позиционирования фонового изображения */
}

/* Добавляем стили для фонового изображения */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  opacity: 0.8; /* увеличиваем с 0.15 до 0.3 */
  pointer-events: none; /* Чтобы изображение не мешало кликам */
  transition: opacity 0.3s ease;
  z-index: -1; /* Размещаем позади контента */
}

/* Добавляем плавное появление/исчезновение */
.background-image-enter-active,
.background-image-leave-active {
  transition: opacity 0.3s ease;
}

.background-image-enter-from,
.background-image-leave-to {
  opacity: 0;
}

.year-group {
  margin-bottom: 30px;
  display: grid;
  grid-template-columns: 120px 1fr; /* Добавляем grid с фиксированной шириной для года */
  gap: 20px; /* Отступ между годом и контентом */
}

.year-button {
  background-color: #f0f0f0 !important;
  border-radius: 50px !important;
  padding: 8px 20px !important;
  font-size: 16px !important;
  width: fit-content; /* Ширина по содержимому */
  align-self: flex-start; /* Прижимаем к верху */
}

.press-items {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.press-item {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
  align-items: center;
}

.media-outlet {
  position: relative;
  z-index: 1; /* Чтобы кнопка была над фоновым изображением */
  background-color: #000 !important;
  color: white !important;
  border-radius: 50px !important;
  padding: 8px 20px !important;
  font-size: 16px !important;
  min-width: fit-content !important;
}

.press-title {
  flex: 1;
  text-align: left;
  white-space: normal;
  height: auto;
  background-color: transparent !important;
  color: black !important;
  border-radius: 50px !important;
  padding: 8px 20px !important;
  font-size: 16px !important;
  border: none !important;
  justify-content: flex-start !important;
  cursor: default !important;
}

/* Добавим hover эффекты */
.media-outlet:hover {
  opacity: 0.8;
}

@media (max-width: 768px) {
  .press-container {
    padding: 10px;
  }
  
  .year-group {
    grid-template-columns: 1fr; /* На мобильных устройствах переходим в одну колонку */
    gap: 10px;
  }

  .press-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .media-outlet,
  .press-title {
    width: 100%;
  }
}
</style>
