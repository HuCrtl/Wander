<template>
  <div class="pictures-container">
    <div class="cards">
      <div class="card" v-for="item in cardList" :key="item.id">
        <img v-if="item.image" :src="item.image" :alt="item.text" />
        <span v-else>{{ item.text }}</span>
      </div>
    </div>
    <div class="picture-bottom-space"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'

interface CardItem {
  id: number
  text: string
  image: string | null
}

export default defineComponent({
  name: 'PicturesComponent',
  props: {
    cardList: {
      type: Array as PropType<CardItem[]>,
      required: true,
    },
  },
})
</script>

<style scoped>
@keyframes slide-fade-in {
  from {
    opacity: 0;
    box-shadow: none;
    transform: scale(.8) translateY(15vh);
  }
}

.pictures-container {
  width: 100%;
}

.cards {
  display: grid;
  gap: 1rem;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 120px), 1fr));
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.card {
  animation: slide-fade-in both;
  animation-timeline: view();
  animation-range: contain 0% contain 50%;
  border-radius: 10px;
  box-shadow: 0px 8px 20px #00000022;
  font-size: clamp(18px, 5vw, 32px);
  letter-spacing: 2px;
  color: #fff;
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background-image: linear-gradient(to bottom right,
      #91defe,
      #99c0f9,
      #bdb6ec,
      #d7b3e3,
      #efb3d5,
      #f9bccc);
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 1rem;
}

.card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 平板以上布局 */
@media (min-width: 768px) {
  .cards {
    gap: 2rem;
  }

  .card {
    letter-spacing: 5px;
  }

  .card:nth-of-type(4n) {
    grid-column: span 2;
  }

  .card:nth-of-type(5n) {
    grid-column: span 2;
  }

  .card:nth-of-type(7n) {
    grid-row: span 2;
  }
}

.picture-bottom-space {
  height: 72px;
}
</style>
