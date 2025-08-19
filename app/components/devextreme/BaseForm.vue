<template>
  <div class="form">
    <div class="Title_content text-[22px] mb-1.5">
        <h4>{{ Title }}</h4>
    </div>
    <div class="content-form">
        <DxForm :formData="formData" :items="builtItems" v-bind="finalOptions"/>
    </div>
  </div>

</template>

<script setup>
import { DxForm } from 'devextreme-vue/form'
import { computed } from 'vue'
import { buildFormItem, createFormOptions } from '@/components/utils/column-form-utils'

// Props nhận từ component cha
const props = defineProps({
  Title: {type:String, default: ""},
  formData: { type: Object, required: true },
  formItems: { type: Array, required: true },
  formOptions: { type: Object, default: () => ({}) }
})
// Dựng items từ cấu hình ngắn gọn
const builtItems = computed(() => props.formItems.map(buildFormItem))
// Gộp options mặc định + override
const finalOptions = computed(() => createFormOptions(props.formOptions))
</script>