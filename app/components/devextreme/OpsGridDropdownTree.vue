<script setup lang="ts">
import { ref, watch } from 'vue'
import DxDropDownBox, { type DxDropDownBoxTypes } from 'devextreme-vue/drop-down-box';
import TreeView from 'devextreme-vue/tree-view'
const props = defineProps<{
  data: {
    value: any
    setValue: (val: any) => void
    column: any
  }
}>()
const treeBoxValue = ref(props.data.value ?? null)
const isDropDownOpened = ref(false)
const treeViewRef = ref()

watch(treeBoxValue, (val) => {
  if (!treeViewRef.value) return
  if (!val) {
    treeViewRef.value.instance.unselectAll()
  } else {
    treeViewRef.value.instance.selectItem(val)
  }
})

const onValueChanged = (e: any) => {
  treeBoxValue.value = e.value
}

const onOptionChanged = (e: any) => {
  if (e.name === 'opened') {
    isDropDownOpened.value = e.value
  }
}

const onItemSelectionChanged = (e: any) => {
  const selected = e.component.getSelectedNodeKeys()
  const value = selected[0]
  props.data.setValue(value)
  treeBoxValue.value = value
}

const onItemClick = () => {
  isDropDownOpened.value = false
}

const onContentReady = (e: any) => {
  e.component.selectItem(treeBoxValue.value)
}
</script>

<template>
  <DxDropDownBox
    :opened="isDropDownOpened"
    :value="treeBoxValue"
    value-expr="ID"
    display-expr="NAME"
    placeholder="Lựa chọn..."
    :show-clear-button="true"
    :data-source="props.data.column?.lookup?.dataSource"
    @value-changed="onValueChanged"
    @option-changed="onOptionChanged"
  >
    <template #content>
      <TreeView
        ref="treeViewRef"
        :data-source="props.data.column?.lookup?.dataSource"
        key-expr="ID"
        parent-id-expr="PID"
        data-structure="plain"
        selection-mode="single"
        display-expr="NAME"
        :select-by-click="true"
        @content-ready="onContentReady"
        @item-click="onItemClick"
        @item-selection-changed="onItemSelectionChanged"
      />
    </template>
  </DxDropDownBox>
</template>