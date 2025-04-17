import './style.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { StoryblokVue, apiPlugin } from '@storyblok/vue';
import DynamicComponent from './components/DynamicComponent.vue';
import lazyLoad from './directives/lazyLoad';
import LazyImage from './components/LazyImage.vue';
import LazyBackground from './components/LazyBackground.vue';

const app = createApp(App);

// Ensure the token exists
const accessToken = import.meta.env.VITE_STORYBLOK_PREVIEW_TOKEN;
if (!accessToken) {
  throw new Error('Storyblok access token is missing');
}

// Initialize Storyblok
app.use(StoryblokVue, {
  accessToken,
  use: [apiPlugin]
});

app.component('StoryblokComponent', DynamicComponent);
app.component('LazyImage', LazyImage);
app.component('LazyBackground', LazyBackground);

app.directive('lazy-load', lazyLoad);

app.use(router);

app.mount('#app');
