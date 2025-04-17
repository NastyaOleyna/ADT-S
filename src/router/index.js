import { createRouter, createWebHistory } from 'vue-router';
import { transitionTiming } from '../utils/transitionConfig';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/Components',
      name: 'Components',
      component: () => import('../views/ComponentsDemo.vue')
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/projects',
      name: 'Projects',
      component: () => import('../views/Projects.vue')
    },
    {
      path: '/projects/:slug',
      name: 'ProjectDetail',
      component: () => import('../views/ProjectPage.vue')
    },
    {
      path: '/objects',
      name: 'Objects',
      component: () => import('../views/Objects.vue')
    },
    {
      path: '/shows',
      name: 'Shows',
      component: () => import('../views/Shows.vue')
    },
    {  
        path: '/shows/:slug',
        name: 'ShowDetail',
        component: () => import('../views/ShowPage.vue'),
        props: true
    },
    {
      path: '/showpage',
      name: 'ShowPage',
      component: () => import('../views/ShowPage.vue')
    },
    {
      path: '/press',
      name: 'Press',
      component: () => import('../views/Press.vue')
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Profile.vue')
    },
    // {
    //   path: '/objects',
    //   name: 'Objects',
    //   component: () => import('../views/Objects.vue')
    // },
    // {
    //   path: '/press',
    //   name: 'Press',
    //   component: () => import('../views/Press.vue')
    // },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
});

// Apply transition for all navigation events
router.beforeEach((to, from, next) => {
  // Only apply transition if we're actually changing routes
  if (to.path !== from.path) {
    // First add the transition class to hide content
    document.body.classList.add('page-transitioning');
    
    // Force browser to process the class before continuing
    void document.body.offsetWidth;
    
    // Proceed with navigation after ensuring the transition class is applied
    next();
  } else {
    next();
  }
});

// Global after-navigation hook - safety net only
router.afterEach(() => {
  // Make sure we're at the top of the page after navigation
  window.scrollTo(0, 0);
  
  // Reset the scroll behavior to smooth after navigation
  document.documentElement.style.scrollBehavior = 'smooth';
  
  // We'll let the PageTransition component handle removing the class
  // This is just a safety timeout for any edge cases
  setTimeout(() => {
    document.body.classList.remove('page-transitioning');
    
    // Make sure all images are properly visible
    document.querySelectorAll('.image-loaded').forEach(img => {
      img.style.opacity = '1';
    });
  }, 3000); // Extra long safety timeout
});

export default router;
