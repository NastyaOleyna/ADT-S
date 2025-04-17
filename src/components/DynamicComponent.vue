<script setup>
defineProps(['blok']);
</script>

<template>
  <component :is="$resolveComponent(blok.component)" v-bind="blok" />
</template>
