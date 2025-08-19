<template>
  <BaseDataGrid :data-source="dataSource.data" :key-expr="'_id'" :cols="Columns" :url="'HT_MENU'"
    :Title="'Quản lý menu'" />
</template>
<script setup>
definePageMeta({
  layout: "default",
  middleware: ['auth']
});
import { ref, onMounted } from 'vue'
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource } from '@/composables/GlobalService';

const Columns = [
  { df: 'ma', c: 'Mã', rq: true },
  { df: 'ten', c: 'Tên menu', ml: 100, rq: true },
  { df: 'mota', c: 'Mô tả' },
  { df: 'ngaytao', c: 'Ngày tạo', dt: 'date', f: 'dd/MM/y', fv: false },
  {
    c: "Liên kết", w: 100, ops: {
      type: 'buttons',
      buttons: [
        {
          text: "Cấu hình",
          icon: "detailslayout",
          name: "config",
          onClick(e) {
            if (e.row) navigateTo("/hethong/menu/" + e.row.data._id);
          }
        }
      ]
    }

  },
]
const dataSource = DataSource("HT_MENU", ['_id'], ["ma", "ten", "mota", "ngaytao"], ["ngaytao"]);
const gridRef = useState('gridRef');
onMounted(() => {
  gridRef.value.instance.option("editing.form.colCount", 1);
})
</script>