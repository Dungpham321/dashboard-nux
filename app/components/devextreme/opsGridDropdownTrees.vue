<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DropDownBox from 'devextreme-vue/drop-down-box'
import TreeView from 'devextreme-vue/tree-view'

const props = defineProps<{
  data: {
    value: string
    setValue: (val: string) => void
    column: any
  }
}>()

const treeBoxValue = ref<string[]>([])
const isDropDownOpened = ref(false)
const treeViewRef = ref<any>(null)

onMounted(() => {
  if (props.data?.value) {
    treeBoxValue.value = props.data.value.split(',')
  }
})

const syncTreeViewSelection = (e: any) => {
  treeBoxValue.value = e.value
  if (!treeViewRef.value) return

  if (!e.value) {
    treeViewRef.value.instance.unselectAll()
  } else {
    treeViewRef.value.instance.selectItem(e.value)
  }
}

const boxOptionChanged = (e: any) => {
  if (e.name === 'opened') {
    isDropDownOpened.value = e.value
  }
}

const treeViewItemSelectionChanged = (args: any) => {
  const value = args.component.getSelectedNodeKeys()
  props.data.setValue(value.join(','))
  treeBoxValue.value = value
}

const onTreeItemClick = () => {
  isDropDownOpened.value = false
}

const treeViewOnContentReady = (e: any) => {
  e.component.unselectAll()
  treeBoxValue.value.forEach((k) => {
    e.component.selectItem(k)
    e.component.expandItem(k)
  })
}
</script>

<template>
  <DropDownBox
    :opened="isDropDownOpened"
    :value="treeBoxValue"
    value-expr="MA"
    display-expr="TEN"
    placeholder="Lựa chọn..."
    :show-clear-button="true"
    :data-source="props.data.column.lookup.dataSource"
    @value-changed="syncTreeViewSelection"
    @option-changed="boxOptionChanged"
  >
    <template #content>
      <TreeView
        ref="treeViewRef"
        :data-source="props.data.column.lookup.dataSource"
        data-structure="plain"
        key-expr="MA"
        parent-id-expr="CHUC_NANG"
        selection-mode="multiple"
        display-expr="TEN"
        root-value=""
        :search-enabled="true"
        :select-by-click="true"
        :select-nodes-recursive="true"
        show-check-boxes-mode="normal"
        @content-ready="treeViewOnContentReady"
        @item-click="onTreeItemClick"
        @item-selection-changed="treeViewItemSelectionChanged"
      />
    </template>
  </DropDownBox>
</template>