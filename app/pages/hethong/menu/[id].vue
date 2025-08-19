<template>
    <BaseDataGrid :data-source="dataSource.data" :key-expr="'_id'" :cols="Columns" :url="'HT_MENU_ITEM'"
        :Title="'Quản lý các liên kết'" :toolbars="toolbarItem" :width="800">
    </BaseDataGrid>
</template>
<script setup>
import { ref, h } from 'vue';
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource, DataSourceP } from '@/composables/GlobalService';
import OpsGridDropdownTree from '@/components/devextreme/OpsGridDropdownTree.vue';
import OpsGridDropdownTrees from '@/components/devextreme/opsGridDropdownTrees.vue';
const route = useRoute()
const dataSource = DataSource("HT_MENU_ITEM", ['_id'], ["NAME", "HREF", "PERM", "WEIGHT", "PID", "ICON", "HIDEN"], ["ngaytao"], {
    ulo() { return { MID: route.params.id } },
    bi(values) {
        values.MID = route.params.id;
    }
});
const dataCapCha = DataSourceP("HT_MENU_ITEM/List", ["_id"], ["NAME", "PID"], ["PID", "WEIGHT"], {
    ulo() { return { MID: route.params.id } }
});
const dataPerm = DataSourceP("HT_MENU_ITEM/Perm", ["MA"], ["MA", "TEN", "NHOM_QUYEN", "CHUC_NANG"], ["SAP_XEP"]);

const renderPermCell = (element, cell) => {
    let str = ""
    if (cell.value) {
        const ids = cell.value.split(",")
        ids.forEach((vl) => {
            const vls = vl.split(";")
            str += (str === "" ? "" : ", ") + vls[0]
        });
    }
    const span = document.createElement("span");
    span.textContent = str || "";
    element.appendChild(span);

}
const Columns = [
    { df: "NAME", c: "Tên", rq: true, w: 150 },
    { df: "HREF", c: "Đường dẫn" },
    { df: "PID", c: "Cấp cha", lds: dataCapCha.data, lve: '_id', lde: 'NAME', ops: { editCellTemplate: OpsGridDropdownTree } },
    {
        df: "PERM", c: "Quyền", lds: dataPerm.data, lve: 'MA', lde: 'TEN',
        ops: {
            cellTemplate: renderPermCell,
            editCellTemplate: OpsGridDropdownTrees
        }
    },
    { df: "WEIGHT", c: "Vị trí", rq: true, dt: 'number' },
    { df: "ICON", c: "Biểu tượng" },
    { df: "HIDEN", c: "Ẩn", dt: 'boolean' },
]
const toolbarItem = [
    {
        location: 'before',
        widget: 'dxButton',
        name: 'myGridBack',
        locateInMenu: 'auto',
        options: {
            text: "Trở về",
            icon: 'arrowleft',
            hint: "Trở về",
            visible: true,
            onClick: function () {
                navigateTo("/hethong/menu");
            }
        }
    },
]
const gridRef = useState('gridRef');
onMounted(() => {
    gridRef.value.instance.option('onInitNewRow', (e) => {
        e.data.HIDEN = false;
    });
});
</script>