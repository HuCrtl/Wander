<template>
  <div class="picture-layout">
    <StatusBar />
    <div class="picture-header">
      <h1 class="picture-title">Gallery</h1>
      <button
        class="add-btn"
        :class="{ 'is-bouncing': btnBouncing }"
        @click="onAddClick"
      ></button>
    </div>
    <div class="travel-pictures">
      <div
        class="travel-card"
        v-for="item in travelList"
        :key="item.id"
        @click="goToRegion(item.route)"
      >
        <div class="travel-card-info">
          <div class="travel-card-name">{{ item.name }}</div>
          <div class="travel-card-desc">{{ item.desc }}</div>
        </div>
        <div class="travel-card-image">
          <img v-if="item.image" :src="item.image" :alt="item.name" />
          <div v-else class="travel-card-placeholder">
            <span>{{ item.placeholder }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="picture-bottom-space"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import StatusBar from '@/components/StatusBar.vue'

export default defineComponent({
  name: 'PicturePage',
  components: { StatusBar },
  setup() {
    const router = useRouter()

    const btnBouncing = ref(false)

    const travelList = [
      { id: 1, name: 'Sanya', desc: 'Sunshine, beaches, coconut breezes', route: '/picture/sanya', image: null, placeholder: '☀️' },
      { id: 2, name: 'Bali', desc: 'Tropical paradise & sacred temples', route: '/picture/sanya', image: null, placeholder: '🇮🇩' },
      { id: 3, name: 'Iceland', desc: 'Northern lights & volcanic landscapes', route: '/picture/sanya', image: null, placeholder: '🇮🇸' },
      { id: 4, name: 'Machu Picchu', desc: 'Ancient Incan citadel in the clouds', route: '/picture/sanya', image: null, placeholder: '🇵🇪' },
      { id: 5, name: 'Dubai', desc: 'Futuristic skyline & desert adventures', route: '/picture/sanya', image: null, placeholder: '🇦🇪' },
    ]

    const goToRegion = (route: string) => {
      router.push(route)
    }

    const onAddClick = () => {
      btnBouncing.value = true
      setTimeout(() => {
        btnBouncing.value = false
      }, 500)
    }

    return { travelList, goToRegion, onAddClick, btnBouncing }
  },
})
</script>

<style scoped>
.picture-layout {
  min-height: 100vh;
  background: #fbedff;
  padding-top: 2rem;
  padding-bottom: 4rem;
}

.picture-header {
  padding: 16px 24px 8px;
  height: 80px;
}

.picture-title {
  position: relative;
  left: 16px;
  top: 8px;
  font-size: 32px;
  font-weight: 700;
  color: #a19ad4;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* ===== Add Button ===== */
.add-btn {
  position: fixed;
  top: 56px;
  right: 40px;
  z-index: 9999;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background-image: linear-gradient(to bottom right,
    #91defe,
    #99c0f9,
    #bdb6ec,
    #d7b3e3,
    #efb3d5,
    #f9bccc
  );
  cursor: pointer;
  will-change: transform;
  transition: transform 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
}

/* Click bounce animation */
.add-btn.is-bouncing {
  animation: clickBounce 0.5s cubic-bezier(0.25, 0.1, 0.25, 1) forwards;
}

@keyframes clickBounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(0.7); }
  60%  { transform: scale(1.3); }
  100% { transform: scale(1); }
}

/* Cross icon */
.add-btn::before,
.add-btn::after {
  content: '';
  position: absolute;
  background-color: #ffffff;
  border-radius: 2px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.add-btn::before {
  width: 30px;
  height: 3px;
}

.add-btn::after {
  width: 3px;
  height: 30px;
}

/* ===== Travel Cards ===== */
.travel-pictures {
  width: 90%;
  margin: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.travel-card {
  display: flex;
  height: 120px;
  align-items: center;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 16px rgba(186, 171, 218, 0.18);
  cursor: pointer;
  transition: transform 0.25s cubic-bezier(0.2, 0.9, 0.4, 1.1),
              box-shadow 0.25s ease;
  border: 1px solid rgba(255, 255, 255, 0.6);
  overflow: hidden;
}

.travel-card:hover {
  transform: translateY(-3px) scale(1.01);
  box-shadow: 0 8px 28px rgba(186, 171, 218, 0.28);
}

.travel-card:active {
  transform: scale(0.98);
}

.travel-card-info {
  flex: 1;
  padding: 20px 24px;
}

.travel-card-name {
  font-size: 18px;
  font-weight: 700;
  color: #4a3d6e;
  margin-bottom: 6px;
}

.travel-card-desc {
  font-size: 13px;
  color: #9a8bc5;
  line-height: 1.4;
}

.travel-card-image {
  width: 140px;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
}

.travel-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.travel-card-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg,
    rgba(145, 222, 254, 0.15),
    rgba(189, 182, 236, 0.15),
    rgba(249, 188, 204, 0.15)
  );
  font-size: 42px;
}

.picture-bottom-space {
  height: 72px;
}
</style>