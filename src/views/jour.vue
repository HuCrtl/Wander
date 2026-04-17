<template>
  <BgLayout>
    <StatusBar />
    <div>
      <div class="home-header">
        <div class="home-greeting">
          <div class="home-greeting-text">Explore</div>
          <div class="home-greeting-sub">Discover the world, starting now</div>
        </div>
      </div>
    <Jour />
      <div class="home-content">
        <div class="home-section">
          <div class="home-section-title">Popular Picks</div>
          <div class="home-cards">
            <div class="home-card" v-for="item in recommendList" :key="item.id">
              <div class="home-card-icon">{{ item.icon }}</div>
              <div class="home-card-info">
                <div class="home-card-title">{{ item.title }}</div>
                <div class="home-card-desc">{{ item.desc }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="home-section">
          <div class="home-section-title">Quick Access</div>
          <div class="home-quick-grid">
            <div class="home-quick-item" v-for="item in quickList" :key="item.id">
              <div class="home-quick-icon">{{ item.icon }}</div>
              <div class="home-quick-text">{{ item.text }}</div>
            </div>
          </div>
        </div>

        <div class="home-section">
          <div class="home-section-title">Travel News</div>
          <div class="home-news-list">
            <div class="home-news-item" v-for="item in newsList" :key="item.id">
              <div class="home-news-dot"></div>
              <div class="home-news-content">
                <div class="home-news-title">{{ item.title }}</div>
                <div class="home-news-time">{{ item.time }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Bottom spacer to avoid tabbar overlap -->
      <div class="home-bottom-space"></div>
    </div>
  </BgLayout>
</template>

<script lang="ts">
import BgLayout from '@/components/BgLayout.vue';
import Jour from '@/components/jour/jour.vue';
import StatusBar from '@/components/StatusBar.vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'HomePage',
  components: { BgLayout, Jour,StatusBar },
  data() {
    return {
      recommendList: [
        { id: 1, icon: '🗼', title: 'Paris, France', desc: 'The City of Light — art, cuisine & romance' },
        { id: 2, icon: '🏔️', title: 'Swiss Alps', desc: 'Majestic peaks, scenic railways & alpine villages' },
        { id: 3, icon: '🌸', title: 'Kyoto, Japan', desc: 'Ancient temples, cherry blossoms & zen gardens' },
        { id: 4, icon: '🏖️', title: 'Maldives', desc: 'Crystal-clear waters & overwater bungalows' },
        { id: 5, icon: '🗽', title: 'New York, USA', desc: 'The city that never sleeps — iconic skylines' },
      ],
      quickList: [
        { id: 1, icon: '✈️', text: 'Flights' },
        { id: 2, icon: '🏨', text: 'Hotels' },
        { id: 3, icon: '🚄', text: 'Trains' },
        { id: 4, icon: '🎫', text: 'Tickets' },
        { id: 5, icon: '🗺️', text: 'Guides' },
        { id: 6, icon: '📸', text: 'Stories' },
      ],
      newsList: [
        { id: 1, title: 'Spring deals: Up to 40% off Europe flights', time: '2024-03-15' },
        { id: 2, title: 'Japan eases visa rules for 68 countries', time: '2024-03-12' },
        { id: 3, title: 'Top 10 must-visit islands this summer', time: '2024-03-10' },
        { id: 4, title: 'Iceland Northern Lights season guide', time: '2024-03-08' },
        { id: 5, title: 'New direct routes to Bali from major hubs', time: '2024-03-05' },
      ],
    }
  },
})
</script>

<style scoped>

.home-header {
  position: relative;
  z-index: 1;
  padding: 48px 24px 20px;
}

.home-greeting-text {
  font-size: 32px;
  font-weight: 700;
  color: #fff;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.home-greeting-sub {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  margin-top: 6px;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
}

.home-content {
  position: relative;
  z-index: 1;
  padding: 0 16px;
}

.home-section {
  margin-bottom: 20px;
}

.home-section-title {
  font-size: 24px;
  font-weight: 600;
  color: #253c5c;
  margin-bottom: 16px;
  padding-left: 8px;
}

/* Recommend Cards */
.home-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.home-card {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 16px 16px;
  box-shadow: 0 8px 32px rgba(155, 109, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-card:active {
  transform: scale(0.97) translateY(2px);
  background: rgba(255, 255, 255, 0.6);
}

.home-card-icon {
  font-size: 36px;
  margin-right: 16px;
  flex-shrink: 0;
}

.home-card-title {
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 4px;
}

.home-card-desc {
  font-size: 14px;
  color: #9CA3AF;
}

/* Quick Access */
.home-quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.home-quick-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 16px 8px;
  box-shadow: 0 8px 32px rgba(155, 109, 255, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.home-quick-item:active {
  transform: scale(0.92);
  background: rgba(255, 255, 255, 0.6);
}

.home-quick-icon {
  font-size: 28px;
  margin-bottom: 6px;
}

.home-quick-text {
  font-size: 13px;
  color: #4B5563;
  font-weight: 500;
}

/* News List */
.home-news-list {
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 20px;
  padding: 4px 0;
  box-shadow: 0 8px 32px rgba(155, 109, 255, 0.08);
}

.home-news-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
}

.home-news-item + .home-news-item {
  border-top: 1px solid #F3F4F6;
}

.home-news-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: linear-gradient(135deg, #9b6dff, #ff6dab);
  margin-right: 12px;
  flex-shrink: 0;
}

.home-news-content {
  flex: 1;
  min-width: 0;
}

.home-news-title {
  font-size: 14px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.home-news-time {
  font-size: 12px;
  color: #9CA3AF;
  margin-top: 2px;
}

.home-bottom-space {
  height: 72px;
}
</style>
