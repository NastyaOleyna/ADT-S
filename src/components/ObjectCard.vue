<template>
    <div 
      class="object-card" 
      v-lazy-load="image"
    >
          <div class="object-tags">
            <BaseButton :to="`/objects/${slug}`">{{ objectName }}</BaseButton>
            <BaseButton variant="grey">{{ price }}</BaseButton>
          </div>
    </div>
    </template>
    
    <script>
    import BaseButton from './BaseButton.vue';
    import lazyLoad from '../directives/lazyLoad';
    
    export default {
      name: 'objectCard',
      
      components: {
        BaseButton
      },
    
      directives: {
        lazyLoad
      },
    
      props: {
        objectName: {
          type: String,
          default: 'Sample Object',
          required: true
        },
        price: {
          type: String,
          default: '',
          required: true
        },
        image: {
          type: String,
          default: 'https://picsum.photos/800/600',
          required: true
        },
        slug: {
          type: String,
          required: true
        }
      }
    }
    </script>
    <style scoped>
    .object-card {
      position: relative;
      background-size: cover;
      background-position: center;
      display: flex;
      align-items: flex-end;
      min-height: 100px;
      height: 100%;
      cursor: pointer;
      transition: opacity 0.8s ease-out;
    }
    
    .object-card.image-loading {
      opacity: 0;
      background-color: #f0f0f0;
    }
    
    .object-card.image-loaded {
      opacity: 1;
    }
    
    .object-tags {
      position: absolute;
      bottom: 0;
      display: flex;
      align-items: flex-end;
      flex-wrap: wrap;
      gap: 1rem;
      padding: 3rem;
    }
    
    .object-tags:hover {
      color: #fff;
    }
    </style> 