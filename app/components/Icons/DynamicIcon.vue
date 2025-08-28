<template>
  <font-awesome-icon v-if="icon" :icon="[prefix, name]" />
</template>
<script setup lang="ts">
import { library } from '@fortawesome/fontawesome-svg-core'
import * as brands from '@fortawesome/free-brands-svg-icons'
import * as solid from '@fortawesome/free-solid-svg-icons'
import * as regular from '@fortawesome/free-regular-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { computed, onMounted, watchEffect } from 'vue'

const props = defineProps<{
  name: string
  prefix?: 'fab' | 'fas' | 'far'
}>()

const iconModule = computed(() => {
  if (props.prefix === 'fab') return brands
  if (props.prefix === 'far') return regular
  return solid // default to solid
})
const icon = computed(() => {
  const icons = iconModule.value
  for (const key in icons) {
    const iconDef = icons[key as keyof typeof icons] as IconDefinition
    if (iconDef.iconName === props.name) {
      return iconDef
    }
  }
  return undefined
});

watchEffect(() => {
  if (icon.value) {
    library.add(icon.value)
  }
})
</script>
