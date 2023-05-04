<template>
<div class="HomeCardList">
    <div class="card-deck">
    <HomePageCard v-for="(card, i) in cards"  :key="i" :item="card" 
    :title="card.title"
    :text="card.text"></HomePageCard>
</div>
</div>
</template>

<script>
import HomePageCard from './HomePageCard.vue';
export default{
 
        props: {
            cards: Array  
        },
         methods: {
          onIntersection(entries) {
      entries.forEach((entry) => {
        const card = entry.target;
        if (entry.isIntersecting) {
          card.style.opacity = 1;
        } else {
          card.style.opacity = 0.2;
        }
      });
    }
         
         },
         mounted() {
          this.observer = new IntersectionObserver(this.onIntersection, { rootMargin: "-15% 0px 0px -15%", threshold: 0.7 });
    const cards = document.querySelectorAll('.homecard');
    cards.forEach((card) => {
      this.observer.observe(card);
    });
  },
  beforeUnmount() {
        this.observer.disconnect();
      
  },
  components: {
    HomePageCard
  }

    
}
</script>

<style>

</style>