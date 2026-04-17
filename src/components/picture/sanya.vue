<template>
  <div class="sanya-layout">
    <div class="sanya-header">
      <button class="back-btn" @click="goBack">‹</button>
      <h1 class="sanya-title">Sanya</h1>
      <p class="sanya-subtitle">Sunshine, beaches, coconut breezes</p>
    </div>
    <Pictures :cardList="sanyaCards" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import Pictures from '@/components/picture/pictures.vue'

export default defineComponent({
  name: 'SanyaPage',
  components: { Pictures },
  setup() {
    const router = useRouter()

    const sanyaCards = Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      text: `Sanya${i + 1}`,
      image: null,
    }))

    const goBack = () => {
      router.back()
    }

    return { sanyaCards, goBack }
  },
})
</script>

<style scoped>
.sanya-layout {
  min-height: 100vh;
  background: linear-gradient(180deg, #e0f7fa 0%, #fbedff 40%, #fbedff 100%);
  padding-top: 1rem;
  padding-bottom: 4rem;
}

.sanya-header {
  position: relative;
  padding: 16px 24px 20px;
  text-align: center;
}

.back-btn {
  position: absolute;
  left: 20px;
  top: 18px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-size: 24px;
  color: #4a3d6e;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, background 0.2s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
}

.back-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.9);
}

.back-btn:active {
  transform: scale(0.95);
}

.sanya-title {
  font-size: 28px;
  font-weight: 700;
  color: #4a3d6e;
  margin: 0;
  letter-spacing: 2px;
}

.sanya-subtitle {
  font-size: 14px;
  color: #9a8bc5;
  margin-top: 6px;
  letter-spacing: 1px;
}
</style>
