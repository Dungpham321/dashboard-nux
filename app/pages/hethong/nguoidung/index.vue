<template>
    <BaseDataGrid :data-source="dataSource.data" :key-expr="'_id'" :cols="Columns" :url="'user'"
        :Title="'Quản lý người dùng'" />
</template>
<script setup>
definePageMeta({
    layout: "default",
    middleware: ['auth']
});
import { ref, onMounted } from 'vue'
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource } from '@/composables/GlobalService';

const dataSource = DataSource("user", ['_id'], ["ten_dang_nhap", "ho_ten", "email", "so_dien_thoai", "dia_chi", "ngay_tao", 'mat_khau'], ["ngaytao"]);
const Columns = [
    { df: "ten_dang_nhap", c: "Tên đăng nhập", rq: true, w: 150 },
    { df: "ho_ten", c: "Tên đầy đủ", rq: true },
    { df: "mat_khau", c: "Mật khẩu",edtm: "password", rq: true, v:false },
    { df: "email", c: "Email", w: 200, edtm:"email" },
    { df: "so_dien_thoai", c: "Số điện thoại" },
    { df: "dia_chi", c: "Địa chỉ" }
]
// const gridRef = useState('gridRef');
// const editMode = useState('editMode');
onMounted(() => {
    // console.log('Grid mounted:', gridRef.value);
    // console.log('Grid mounted:', editMode.value)
})



</script>