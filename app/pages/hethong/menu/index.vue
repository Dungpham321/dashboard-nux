<template>
  <div v-if="isReady">
    <BaseDataGrid :grid-key="gridkey" :data-source="dataSource.data" :key-expr="'ID'" :cols="Columns"
      :url="'HeThong/HT_MENU'" :Title="AccessRights.Title" :New="AccessRights.New" :Edit="AccessRights.Edit"
      :Delete="AccessRights.Delete" />
  </div>
</template>
<script setup>
definePageMeta({
  layout: "default",
  middleware: ['auth']
});
import { ref, onMounted, onBeforeMount, nextTick, watch } from 'vue'
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource } from '@/composables/GlobalService';
const Columns = [
  { df: 'MID', c: 'Mã', rq: true },
  { df: 'NAME', c: 'Tên', ml: 100, rq: true },
  {
    c: "Liên kết", w: 100, ops: {
      type: 'buttons',
      buttons: [
        {
          text: "Cấu hình",
          icon: "detailslayout",
          name: "config",
          onClick(e) {
            if (e.row) navigateTo("/hethong/menu/" + e.row.data.MID);
          }
        }
      ]
    }

  },
]
const dataSource = DataSource("HeThong/HT_MENU", ['MID'], ["MID", "NAME"], ["MID"]);
const isReady = ref(false);
const AccessRights = reactive({
  New: false,
  Edit: false,
  Delete: false,
  Title: ""
});
const gridkey = ref('menu');

onBeforeMount(async () => {
  const check = await checkAccess("HeThong/HT_MENU/Access");
  if (check) {
    AccessRights.New = check.New;
    AccessRights.Edit = check.Edit;
    AccessRights.Delete = check.Delete;
    AccessRights.Title = check.Title
  }
  isReady.value = true;
});
const baseGridRef = useState('gridRef-'+gridkey.value);
watch(isReady, (ready) => {
  if (ready) {
    nextTick(() => {
      const instance = baseGridRef.value?.instance
      if (instance) {
        instance.option("editing.form.colCount", 1)
        instance.option("onEditorPreparing", function (e) {
          if (e.parentType === 'dataRow' && e.dataField === "MID") {
            if (e.row?.isSelected) {
              e.editorOptions.readOnly = true
            }
          }
        })
      } else {
        console.warn('⚠️ Grid instance vẫn chưa có sau isReady')
      }
    })

  }
})

</script>