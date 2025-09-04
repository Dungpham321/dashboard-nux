<template>
  <DxLoadPanel
    :visible="visible"
    :show-indicator="true"
    :show-pane="true"
    :shading="true"
    shading-color="rgba(0, 0, 0, 0.4)"
    :message="message"
  />
</template>

<script setup>
import { DxLoadPanel } from 'devextreme-vue/load-panel'
defineProps({
  visible: Boolean,
  message: {
    type: String,
    default: 'Đang tải dữ liệu...'
  },
  container: {
    type: String,
    default: '#app'
  }
})
</script>
