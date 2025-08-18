<template>
  <div class="min-h-screen xl:flex dark:border-gray-800 dark:bg-gray-900 ">
    <app-sidebar />
    <Backdrop />
    <div class="flex-1 transition-all duration-300 ease-in-out" :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']">
      <app-header />
      <div class="p-4 mx-auto md:p-6">
        <!-- max-w-(--breakpoint-2xl) -->
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>

import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import { useSidebar } from '@/composables/useSidebar'
import Backdrop from './Backdrop.vue'
import { ref, onMounted } from 'vue'
const { isExpanded, isHovered } = useSidebar()
onMounted(() => {

})

</script>
