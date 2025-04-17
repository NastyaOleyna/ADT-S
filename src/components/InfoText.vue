<template>
  <div class="info-text-container" v-if="hasContent">
    <div class="info-text" v-if="$slots.default" :style="columnStyle">
      <slot></slot>
    </div>
    <div class="info-text" v-else-if="html" v-html="html" :style="columnStyle"></div>
    <div class="info-text" v-else-if="text" :style="columnStyle">{{ text }}</div>
  </div>
</template>

<script>
export default {
  name: 'InfoText',
  props: {
    text: {
      type: String,
      default: ''
    },
    html: {
      type: String,
      default: ''
    },
    columnCount: {
      type: Number,
      default: 2
    }
  },
  computed: {
    columnStyle() {
      return {
        columnCount: this.columnCount
      };
    },
    hasContent() {
      return (this.text && this.text.trim().length > 0) || 
             (this.html && this.html.trim().length > 0) ||
             this.$slots.default;
    }
  }
};
</script>

<style>
.info-text-container {
  display: flex;
  justify-content: center;
  width: 100%;
  box-sizing: border-box;
}

.info-text {
  column-count: 2;
  column-gap: 40px;
  max-width: 1000px;
  width: 100%;
  padding: 5vh 2rem;
  text-align: left;
  margin: 0 auto;
  box-sizing: border-box;
}

.info-text p {
  margin-bottom: 1rem;
}

.info-text .empty-text {
  color: #888;
  font-style: italic;
  text-align: center;
}

@media (max-width: 768px) {
  .info-text {
    column-count: 1;
    max-width: 100%;
    padding: 5vh 1.5rem;
    margin: 0 auto;
  }
}
</style>
