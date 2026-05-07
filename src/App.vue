<template>
  <router-view v-slot="{ Component }">
    <keep-alive :exclude="['LoginPage', 'RegisterPage']">
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <Tabbar v-if="showTabbar" />
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import Tabbar from './components/Tabbar.vue'

export default defineComponent({
  name: 'App',
  components: { Tabbar },
  setup() {
    const route = useRoute()
    const hiddenPaths = ['/login', '/register', '/map', '/mytravel', '/picture/sanya']
    const showTabbar = computed(() => !hiddenPaths.includes(route.path))
    return { showTabbar }
  },
})
</script>