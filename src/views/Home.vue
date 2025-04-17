<template>
  <div class="home" :class="{ 'image-loaded': isLoaded }">

  </div>
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      isLoaded: false
    }
  },
  mounted() {
    // Create a new image object to preload
    const img = new Image();
    img.src = '/main/assets/DSC00121@0.5x2.webp';
    img.onload = () => {
      this.isLoaded = true;
    };
  }
}
</script>



<style scoped>


.home {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background-image: url('/main/assets/DSC00121@0.5x.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 1s ease-out;
}

.image-loaded {
  opacity: 1;
}

.content {
  text-align: center;
  color: white;
  padding: 2rem;
  /* background-color: rgba(0, 0, 0, 0.5); */
  border-radius: 8px;
}

h1 {
  font-size: 3rem;
  margin: 0;
}

/* .iframe-demo {
  height: 100%;
  width: 100%;
  border: none;
} */

/* h1 {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
} */

@media screen and (orientation: portrait) {
  .home {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 100vh; /* Use viewport height for width */
    height: 100vw; /* Use viewport width for height */
    transform: translate(-50%, -50%) rotate(-90deg) scale(1.1);
    transform-origin: center center;
    background-size: cover;
  }
}
</style> 