<template>
    <div v-if="isReady">
        <BaseDataGrid :data-source="dataSource.data" :key-expr="'ID'" :cols="Columns" :url="'HeThong/HT_MENUITEM'"
            :Title="AccessRights.Title" :New="AccessRights.New" :Edit="AccessRights.Edit" :Delete="AccessRights.Delete"
            :toolbars="toolbarItem" :width="800">
        </BaseDataGrid>
    </div>
</template>
<script setup>
import { ref, h } from 'vue';
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource, DataSourceP } from '@/composables/GlobalService';
import OpsGridDropdownTree from '@/components/devextreme/OpsGridDropdownTree.vue';
import OpsGridDropdownTrees from '@/components/devextreme/opsGridDropdownTrees.vue';
const route = useRoute()
const dataSource = DataSource("HeThong/HT_MENUITEM", ['ID'], ["ID", "NAME", "HREF", "PID", "PERM", "WEIGHT", "HIDEN", "ICON"], ["PID", "WEIGHT"], {
    ulo() { return { MID: route.params.id } },
    bi(values) {
        values.MID = route.params.id;
    },
    uu: "/" + route.params.id,
});
const dataCapCha = DataSourceP("HeThong/HT_MENUITEM/List", ["ID"], ["NAME", "PID"], ["PID", "WEIGHT"], {
    ulo() { return { MID: route.params.id } }
});
const dataPerm = DataSourceP("HeThong/HT_MENUITEM/Perm", ["MA"], ["MA", "TEN", "NHOM_QUYEN", "CHUC_NANG"], ["CHUC_NANG", "NHOM_QUYEN", "SAP_XEP"]);

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
    { df: "PID", c: "Cấp cha", lds: dataCapCha.data, lve: 'ID', lde: 'NAME', ops: { editCellTemplate: OpsGridDropdownTree } },
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

const isReady = ref(false);
const AccessRights = reactive({
    New: false,
    Edit: false,
    Delete: false,
    Title: ""
});
onBeforeMount(async () => {
    const check = await checkAccess("HeThong/HT_MENUITEM/Access", { MID: route.params.id });
    if (check) {
        AccessRights.New = check.New;
        AccessRights.Edit = check.Edit;
        AccessRights.Delete = check.Delete;
        AccessRights.Title = check.Title
    }
    isReady.value = true;

});

const gridRef = useState('gridRef');
watch(isReady, (ready) => {
    if (ready) {
        nextTick(() => {
            const instance = gridRef.value?.instance
            if (instance) {
                instance.option('onInitNewRow', (e) => {
                    e.data.HIDEN = false;
                });
            } else {
                console.warn('⚠️ Grid instance vẫn chưa có sau isReady')
            }
        })

    }
})
</script>