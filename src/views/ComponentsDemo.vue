<template>
  <div class="components-demo">
    <h1>Components Demo Page</h1>

    <InteractiveText />

    <section class="demo-section">
      <h2>Project Card</h2>
      <ProjectCard 
        projectName="Sample Project"
        year="2023"
      />
    </section>
    
    <p>Millions of Ukrainians have been driven from their homes by war. The intimate relationship with their homeland was abruptly broken. What does that relationship consist of? What defines a home(land)? With these fundamental questions, the exhibition Home(Land) not only zooms in on the war in Ukraine but also on un derlying themes such as: how important are traditions and heritage? What happens when war takes away this physical and tangible connection to a place and its people?</p>
    <p>Dasha Tsapenko together with a team of Ukrainian and Dutch curators brought together designers from Ukraine and The Netherlands to explore these questions, based on the belief that new perspectives can be found in design. The results of this knowledge exchange demonstrate various sustainable and ethical design practices. Traditional crafts and techniques, local materials and innovative knowledge on bio-design and sustainable production processes are (re)discovered and connected.</p>

    <section class="demo-section">
      <h2>Button Component</h2>
      <BaseButton>Click Me</BaseButton>
      <BaseButton
        variant="grey"
      >No Click Me</BaseButton>
    </section>

    <section class="demo-section">
      <h2>Image Gallery</h2>
      <ImageGallery 
        :name="'Demo Gallery'"
        :slug="'demo'"
        :location="'Demo Location'"
        :date="'2023'"
        :images="[
          { url: '', alt: 'Demo Image 1' },
          { url: '', alt: 'Demo Image 2' },
          { url: '', alt: 'Demo Image 3' }
        ]"
        :repeatCount="2"
      />
    </section>


  </div>
</template>

<script>
import InteractiveText from '../components/InteractiveText.vue'
import BaseButton from '../components/BaseButton.vue'
import ImageGallery from '../components/ImageGallery.vue'
import ProjectCard from '../components/ProjectCard.vue'
import MenuComponent from '../components/MenuComponent.vue'

export default {
  name: 'ComponentsDemo',
  components: {
    BaseButton,
    ImageGallery,
    ProjectCard,
    MenuComponent,
    InteractiveText
  }
}
</script>

<style scoped>
.components-demo {
  /* padding: 2rem; */
}

.demo-section {
  /* margin-bottom: 2rem; */
  /* padding: 1rem; */
  /* border: 1px solid #eee; */
  /* border-radius: 8px; */
}

h1 {
  margin-bottom: 0rem;
}

h2 {
  margin-bottom: 0rem;
}
</style> 