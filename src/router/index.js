import { createRouter, createWebHistory } from 'vue-router'

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
      path: '/shows',
      name: 'Shows',
      component: () => import('../views/Shows.vue')
    },
    {
      path: '/project',
      name: 'Project',
      component: () => import('../views/Project.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router 