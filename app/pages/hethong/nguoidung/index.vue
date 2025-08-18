<template>
    <div v-if="isReady">
        <BaseDataGrid :data-source="dataSource.data" :key-expr="'_id'" :cols="Columns" :url="'user'"
            :Title="AccessRights.Title" :New="AccessRights.New" :Edit="AccessRights.Edit"
            :Delete="AccessRights.Delete" />
    </div>

</template>
<script setup>
definePageMeta({
    layout: "default",
    middleware: ['auth']
});
import { ref, onMounted, onBeforeMount } from 'vue'
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource, checkAccess } from '@/composables/GlobalService';
import { accessButton } from '@/components/utils/Funtion-Grid';
import { Title } from '#components';
const check = ref(null);
const dataSource = DataSource("user", ['_id'], ["ten_dang_nhap", "ho_ten", "email", "so_dien_thoai", "dia_chi", "ngay_tao", 'mat_khau'], ["ngaytao"]);
const Columns = [
    { df: "ten_dang_nhap", c: "Tên đăng nhập", rq: true, w: 150 },
    { df: "ho_ten", c: "Tên đầy đủ", rq: true },
    { df: "mat_khau", c: "Mật khẩu", edtm: "password", rq: true, v: false },
    { df: "email", c: "Email", w: 200, edtm: "email" },
    { df: "so_dien_thoai", c: "Số điện thoại" },
    { df: "dia_chi", c: "Địa chỉ" }
]
const gridRef = useState('gridRef');
const isReady = ref(false);
const AccessRights = reactive({
    New: false,
    Edit: false,
    Delete: false,
    Title: ""
});
onBeforeMount(async () => {
   const check = await checkAccess("user/Access");
    if (check) {
        AccessRights.New = check.New;
        AccessRights.Edit = check.Edit;
        AccessRights.Delete = check.Delete;
        AccessRights.Title = check.Title
    }
    isReady.value = true;

});
</script>