<template>
  <router-view></router-view>
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
    // 登录页不显示底部导航栏
    const showTabbar = computed(() => route.path !== '/login')
    return { showTabbar }
  },
})
</script>