<template>
    <div v-if="isReady">
        <BaseDataGrid :grid-key="gridkey" :data-source="dataSource.data" :key-expr="'ID'" :cols="Columns"
            :url="'DanhMuc/DM_DANHMUC_COL'" :Title="dataAcess.Title" :New="dataAcess.New" :Edit="dataAcess.Edit"
            :Delete="dataAcess.Delete" />
    </div>
</template>
<script setup>
definePageMeta({
    layout: "default",
    middleware: ['auth']
});
import { ref, onMounted, onBeforeMount, nextTick, watch, createApp } from 'vue'
import { useRoute } from 'vue-router'
import { DataSource, DataSourceP } from '@/composables/GlobalService';
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import TemplateND from '~/components/devextreme/TemplateND.vue';
import EditTemplateND from '~/components/devextreme/EditTemplateND.vue';
import { dsChucNang, dsDoiTuong, dsKieuDuLieu, dsSoThapPhan } from '~/components/enums/ThongBao';
import { icon } from '@fortawesome/fontawesome-svg-core';
const dataAcess = reactive({
    New: false,
    Edit: false,
    Delete: false,
    Title: "",
    danhmuc: {}
});
const route = useRoute();
const ma = ref(route.params.ma);
const isReady = ref(false);
const gridkey = ref('danhmucitem');
const baseGridRef = useState('gridRef-' + gridkey.value);
const Columns = [];
onBeforeMount(async () => {
    const check = await checkAccess("DanhMuc/DM_DANHMUC_COL/Access", { MA_DANHMUC: ma.value });
    if (check) {
        dataAcess.New = check.New;
        dataAcess.Edit = check.Edit;
        dataAcess.Delete = check.Delete;
        dataAcess.Title = check.Title;
        dataAcess.danhmuc = check.danhmuc;
    }
    isReady.value = true;
    Columns.push({ df: 'MA', c: 'Mã', w: 150, rq: true });
    Columns.push({ df: 'TEN', c: 'Tên', rq: true });
    Columns.push({ df: 'SAP_XEP', c: 'Vị trí', w: 80, rq: true, dt: 'number' });
    Columns.push({ df: 'KIEUDULIEU', c: 'Kiểu dữ liệu', rq: true, lds: dsKieuDuLieu, lve: 'ID', lde: 'TEN', w: 130 });
    Columns.push({ df: 'CHIEURONG', c: 'Chiều rộng', w: 110, dt: 'number' });
    Columns.push({ df: 'DM_ID', c: 'Danh mục', w: 140, lds: dataDanhMuc.data, lve: 'ID', lde: 'TEN' });
    Columns.push({ df: 'THAPPHAN', c: 'Thập phân', w: 150, v: false, fv: false, lds: dsSoThapPhan, lve: 'ID', lde: 'TEN' });
    Columns.push({ df: 'TUDIEN_ID', c: 'Từ điển', w: 140, lds: dataTuDien.data, lve: 'ID', lde: 'TEN' });
    Columns.push({ df: 'TOITHIEU', c: 'Tối thiểu', dt: 'number', v: false, fv: true });
    Columns.push({ df: 'TOIDA', c: 'Tối đa', dt: 'number', v: false, fv: true });
    Columns.push({ df: 'HIENTHI', c: 'Hiển thị lưới', w: 140, dt: 'boolean' });
    Columns.push({ df: 'CODINH', c: 'Cố định', dt: 'boolean', v: false, fv: true });
    Columns.push({ df: 'BATBUOC', c: 'Bắt buộc', dt: 'boolean', v: false, fv: true });
    Columns.push({ df: 'COLSPAN', c: 'Gộp ô', dt: 'number', v: false, fv: true });
    Columns.push({ df: 'CHECKTRUNG', c: 'Kiểm tra trùng', dt: 'boolean', v: false, fv: true });
    Columns.push({ df: 'MACDINH', c: 'Mặc định', v: false, fv: true });
});
const dataSource = DataSource("DanhMuc/DM_DANHMUC_COL", ["ID"], ["MA", "TEN", "SAP_XEP", "KIEUDULIEU", "CHIEURONG", "DM_ID", "THAPPHAN", "TOITHIEU", "TOIDA", "HIENTHI", "CODINH", "BATBUOC", "CHECKTRUNG", "MACDINH", "COLSPAN", "TUDIEN_ID"], ["SAP_XEP"], {
    ulo: function () {
        return { DANHMUC_ID: dataAcess.danhmuc.ID };
    },
    bi: function (values) {
        values.DANHMUC_ID = dataAcess.danhmuc.ID;
    },
});
var dataDanhMuc = DataSourceP("DanhMuc/DM_DANHMUC_COL/ListDanhMuc", ['ID'], ["MA", "TEN"], ["SAP_XEP"]);
var dataTuDien = DataSourceP("DanhMuc/DM_TUDIEN/List", ['ID'], ["TEN"], ["TEN"]);

watch(isReady, (ready) => {
    if (ready) {
        nextTick(() => {
            const instance = baseGridRef.value?.instance
            if (instance) {
                instance.option('onInitNewRow', function (e) {
                    e.data.SAP_XEP = 0;
                    e.data.KIEUDULIEU = "string";
                    e.data.HIENTHI = true;
                    e.data.CODINH = false;
                    e.data.BATBUOC = false;
                    e.data.CHECKTRUNG = false;
                });
            } else {
                console.warn('⚠️ Grid instance vẫn chưa có sau isReady')
            }
        })

    }
})
</script>