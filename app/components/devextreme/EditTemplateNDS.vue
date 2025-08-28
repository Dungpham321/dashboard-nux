<template>
  <DxTagBox
    v-if="multiple"
    v-model:value="localValue"
    :data-source="dataSource"
    :display-expr="'TEN_DOI_TUONG'"
    :value-expr="'DOITUONG_ID'"
    :search-enabled="true"
    :show-selection-controls="true"
    :read-only="isReadOnly"
    class="w-full"
  />
  <DxSelectBox
    v-else
    v-model:value="localValue"
    :data-source="dataSource"
    :display-expr="'TEN_DOI_TUONG'"
    :value-expr="'DOITUONG_ID'"
    :search-enabled="true"
    :show-clear-button="true"
    :read-only="isReadOnly"
    class="w-full"
  />
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { DxTagBox, DxSelectBox } from 'devextreme-vue'
import { GetData } from '@/composables/GlobalService'

const props = defineProps({
  nguoidungid: [String, Number],
  doituongid: [String, Number],
  chucnang: [String, Number],
  doituongloai: [String, Number],
  multiple: Boolean,
  mode: String,
  modelValue: [Array, String, Number]
})

const emit = defineEmits(['update:modelValue'])

const dataSource = ref([])
const localValue = ref(props.modelValue ?? (props.multiple ? [] : null))

const isReadOnly = computed(() => props.mode === 'view')

watch(localValue, (val) => {
  emit('update:modelValue', val)
})

const loadData = async () => {
  const endpoint = props.doituongid ? 'List' : 'ListAccess'
  const response = await GetData(`HeThong/HT_NGUOIDUNG_SD/${endpoint}`, {
    NGUOIDUNG_ID: props.nguoidungid,
    DOITUONG_ID: props.doituongid,
    CHUCNANG: props.chucnang,
    DOITUONG_LOAI: props.doituongloai,
    MULTIPLE: props.multiple
  })

  const raw = response.Data || []
  dataSource.value = raw.map(({ DOITUONG_ID, TEN_DOI_TUONG }) => ({
    DOITUONG_ID,
    TEN_DOI_TUONG
  }))

  const selected = raw.filter(f => f.CHON).map(f => f.DOITUONG_ID)
  localValue.value = props.multiple ? selected : selected[0] ?? null
}

onMounted(loadData)
</script>