<template>
    <div v-if="isReady">
        <BaseDataGrid :grid-key="gridkey" :data-source="dataSource.data" :key-expr="'ID'" :cols="Columns"
            :url="'DanhMuc/DM_DANHMUC'" :Title="AccessRights.Title" :New="AccessRights.New" :Edit="AccessRights.Edit"
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
import { DataSource, DataSourceP } from '@/composables/GlobalService';
const dataMainP = DataSourceP("DanhMuc/DM_DANHMUC/List", ["ID"], ["TEN"], ["SAP_XEP"], {
    ca: false,
});
const Columns = [
    { df: 'ID', c: 'ID', fv: false, w: 50 },
    { df: 'MA', c: 'Mã', ml: 110, rq: true },
    { df: 'TEN', c: 'Tên', rq: true },
    { df: 'MO_TA', c: 'Mô tả' },
    { df: 'SAP_XEP', c: 'Sắp xếp', dt: 'number', w: 100 },
    { df: 'IDTUTANG', c: 'ID Tự tăng', dt: 'boolean', w: 100 },
    { df: 'PID', c: 'Danh mục cha', lds: dataMainP.data, lve: 'ID', lde: 'TEN', w: 120 },
    { df: 'CODUYET', c: 'Có duyệt', dt: 'boolean', w: 100 },
    { df: 'NOIBO', c: 'Nội bộ', dt: 'boolean', w: 100 },
    { df: 'CHIEURONG', c: 'Chiều rộng', dt: 'number', w: 100, v: false },
    {
        c: "Cấu hình", fv: false, w: 100, ops: {
            type: 'buttons',
            buttons: [
                {
                    text: "Cấu hình",
                    icon: "detailslayout",
                    name: "config",
                    onClick(e) {
                        if (e.row) navigateTo("/danhmuc/col/" + e.row.data.MA);
                    }
                }
            ]
        }

    },
    {
        c: "Liên kết", w: 100, af: false, as: false, fv: false, ops: {
            cellTemplate: linkCellTemplate
        }
    }
]
const dataSource = DataSource("DanhMuc/DM_DANHMUC", ['ID'], ["MA", "TEN", "SAP_XEP", "MO_TA", "IDTUTANG", "PID", "CODUYET", "NOIBO", "CHIEURONG"], ["SAP_XEP"]);


const isReady = ref(false);
function linkCellTemplate(Element, cellInfo) {
    const { data } = cellInfo;
    const type = data.PID && data.PID === data.ID ? 'tree' : 'grid';
    const url = `/danhmuc/${type}/${data.MA}`;
    const link = document.createElement('a');
    link.href = url;
    link.className = 'dx-link';
    link.innerHTML = '<i class="fa fa-list-alt"></i> Danh sách';
    Element.appendChild(link);
}
const AccessRights = reactive({
    New: false,
    Edit: false,
    Delete: false,
    Title: "",
});
const gridkey = ref('danhmuc');

onBeforeMount(async () => {
    const check = await checkAccess("DanhMuc/DM_DANHMUC/Access");
    if (check) {
        AccessRights.New = check.New;
        AccessRights.Edit = check.Edit;
        AccessRights.Delete = check.Delete;
        AccessRights.Title = check.Title
    }
    isReady.value = true;
});
const baseGridRef = useState('gridRef-' + gridkey.value);
watch(isReady, (ready) => {
    if (ready) {
        nextTick(() => {
            const instance = baseGridRef.value?.instance
            if (instance) {
                instance.option('onInitNewRow', (e) => {
                    e.data.IDTUTANG = false;
                    e.data.SAP_XEP = 0;
                    e.data.CODUYET = false;
                    e.data.NOIBO = false;
                });
                instance.option('onEditorPreparing', (e) => {
                    if (e.parentType == 'dataRow' && e.dataField == "MA") {
                        if (e.row != null && e.row.isSelected == true) {
                            e.editorOptions.readOnly = true;
                        }
                    }
                });
            } else {
                console.warn('⚠️ Grid instance vẫn chưa có sau isReady')
            }
        })

    }
})

</script>