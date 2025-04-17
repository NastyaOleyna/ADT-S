<template>
  <nav class="menu transition-exempt">
    <BaseButton 
      v-for="item in menuItems" 
      :key="item.path"
      :variant="getButtonVariant(item.path)"
      :disabled="!item.path"
      :keepClickable="isActive(item.path) && item.path !== currentPath"
      @click="navigateTo(item.path, $event)"
      class="menu-button"
    >
      {{ item.name }}
    </BaseButton>
  </nav>
</template>

<script>
import { useRouter, useRoute } from 'vue-router'
import { ref, watch, computed } from 'vue'
import BaseButton from './BaseButton.vue'
import navigationManager from '../utils/navigationManager'

export default {
  name: 'MenuComponent',
  components: {
    BaseButton
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const currentPath = ref(route.path)
    const clickedPath = ref(null) // Track which button was last clicked
    
    // Watch for route changes
    watch(
      () => route.path,
      (newPath) => {
        currentPath.value = newPath
      }
    )
    
    const menuItems = [
      { name: 'Atelier Dasha Tsapenko', path: '/' },
      { name: 'Projects', path: '/projects' },
      { name: 'Objects', path: '/objects' },
      { name: 'Shows', path: '/shows' },
      { name: 'Press', path: '/press' },
      { name: 'Profile', path: '/profile' },
    ]

    // Get button variant considering both the current route and the clicked button
    const getButtonVariant = (path) => {
      // If this is the button that was just clicked, make it active immediately
      if (clickedPath.value === path) {
        return 'active'
      }
      // Otherwise, use the normal active state logic
      return navigationManager.isActive(route, path) ? 'active' : 'black'
    }

    const navigateTo = (path, event) => {
      // Don't navigate if we're already on this page
      if (currentPath.value === path) return;
      
      // Set this path as the clicked path immediately
      clickedPath.value = path;
      
      // Use navigation manager for consistent transitions
      navigationManager.navigateTo(router, path);
    }

    return {
      menuItems,
      navigateTo,
      currentPath,
      isActive: (path) => navigationManager.isActive(route, path),
      getButtonVariant
    }
  }
}
</script>

<style scoped>
.menu {
  padding: 3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 3rem;
  z-index: 100;
  position: relative;
}

.components-button {
  position: absolute;
  right: 0;
  top: 0;
  margin: 3rem;
}

/* Menu button styles - using CSS variables */
.menu-button {
  transition: background-color var(--transition-duration, 500ms) var(--transition-easing, ease), 
              color var(--transition-duration, 500ms) var(--transition-easing, ease);
}

</style>    