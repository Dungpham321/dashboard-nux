<template>
    <div class='flex flex-col'>
        <div class='Title_content text-lg mb-24'>
            {{ props.Title }}
        </div>
        <div class='flex-1 overflow-y-auto'>
            <DxDataGrid ref="gridRef" :data-source="dataSource" :key-expr="keyExpr" :show-borders="true"
                :column-auto-width="true" :allow-column-reordering="true" :show-column-lines="true"
                :show-row-lines="true" :row-alternation-enabled="false" width="100%" height="100%"
                :remote-operations="true" :focused-row-enabled="false" :sync-lookup-filter-values="false"
                :word-wrap-enabled="true" :two-way-binding-enabled="true" :repaint-changes-only="true"
                :allow-column-resizing="true" @exporting="onExporting" @toolbar-preparing="onToolbarPreparing"
                @selection-changed="selectedChanged" @row-updating="onRowUpdating" @row-inserting="onRowInserting"
                @row-updated="onRowUpdated" @row-inserted="onRowInsert" @init-new-row="onInitNewRow"
                @editing-start="onEditingStart">
                <!-- Cột động -->
                <template v-for="(col, index) in cols" :key="index">
                    <DxColumn v-bind="buildColumn(col, col.ops ?? {})" />
                </template>
                <!-- Paging -->
                <DxPaging :enabled="true" :page-size="20" />
                <DxPager :visible="true" :show-page-size-selector="true" :allowed-page-sizes="allowedPageSizes" />
                <!-- Selection -->
                <DxSelection :mode="selectionMode" select-all-mode="allPages" show-check-boxes-mode="onClick" />
                <!-- Search -->
                <DxSearchPanel :visible="true" placeholder="Tra cứu" :width="280" />
                <!-- Editing -->
                <DxEditing :mode="modeEditing">
                    <DxPopup title="Thêm mới" :show-title="true" :width="width" :height="height" />
                    <DxForm>
                        <template v-for="(col, index) in cols" :key="index">
                            <DxColumn v-bind="buildColumn(col, col.ops ?? {})" />
                        </template>
                    </DxForm>
                </DxEditing>
                <!-- Export -->
                <DxExport :enabled="true" :formats="exportFormats" :allow-export-selected-data="true" />
                <!-- Load Panel -->
                <DxLoadPanel :enabled="true" />
            </DxDataGrid>
        </div>
    </div>

</template>

<script setup>
import { ref, watch } from 'vue'
const selectedRowIndex = ref(-1);
const gridRef = useState('gridRef', () => ref());
const editMode = useState('editMode', () => ref(""));
import {
    DxDataGrid,
    DxPaging,
    DxPager,
    DxSelection,
    DxSearchPanel,
    DxEditing,
    DxPopup,
    DxForm,
    DxExport,
    DxLoadPanel,
    DxColumn
} from 'devextreme-vue/data-grid'
import { confirm } from 'devextreme/ui/dialog';
import { buildColumn } from '@/components/utils/column-utils'
import { useToast } from '@/composables/GlobalService'
import { ThongBao, TypeToast } from '~/components/enums/ThongBao';
import { Title } from '#components';
const { showToast } = useToast();

const props = defineProps({
    dataSource: Array,
    keyExpr: String,
    cols: Array,
    allowedPageSizes: Array,
    selectionMode: {
        type: String,
        default: 'multiple'
    },
    modeEditing: {
        type: String,
        default: 'popup'
    },
    width: {
        type: [String, Number],
        default: '600px'
    },
    height: {
        type: [String, Number],
        default: '400px'
    },
    exportFormats: {
        type: Array,
        default: () => ['xlsx', 'pdf']
    },
    toolbars: {
        type: Array,
        default: () => []
    },
    url: {
        type: String,
        default: ""
    },
    Title:{
        type:String,
        default:"Tiêu đề chức năng"
    }
})

function onExporting(e) {
    // xử lý xuất file
}
function onToolbarPreparing(e) {
    const mergedArray = toolbarItem.concat(props.toolbars);
    mergedArray.forEach(item => {
        e.toolbarOptions.items?.unshift(item);
    });
}
function onRowUpdated(e) {

    if (e.component.option('editing.mode') === 'popup') {
        showToast(ThongBao.Sua, TypeToast.Success);
    }
    e.component.refresh();
}
function onRowInsert(e) {
    if (e.component.option('editing.mode') === 'popup') {
        showToast(ThongBao.ThemMoi, TypeToast.Success);
    }
    e.component.refresh();
}

function selectedChanged(e) {
    if (e.selectedRowKeys.length > 0) {
        const index = e.component.getRowIndexByKey(e.selectedRowKeys[0]);
        selectedRowIndex.value = index;
        updateToolbarItems({
            myGridEditRow: { disabled: false },
            myGridDeleteRow: { disabled: false }
        });

    } else {
        selectedRowIndex.value = -1;
        updateToolbarItems({
            myGridEditRow: { disabled: true },
            myGridDeleteRow: { disabled: true }
        });
    }
}
function addRow() {
    const gridInstance = gridRef.value?.instance;
    if (gridInstance) {
        gridInstance.addRow();
        gridInstance.deselectAll();
    }
}
function editRow() {
    const gridInstance = gridRef.value?.instance;
    if (gridInstance && selectedRowIndex.value >= 0) {
        gridInstance.editRow(selectedRowIndex.value);
        gridInstance.deselectAll();
    }
}
function onInitNewRow(e) {
    editMode.value = "new";
    e.component.option("editing").popup.title = "Thêm mới";
}
function onEditingStart(e) {
    editMode.value = "edit";
    e.component.option("editing").popup.title = "Sửa";
}
function updateToolbarItems(updates) {
    const gridInstance = gridRef.value?.instance;
    if (!gridInstance) return;
    gridInstance.option('onToolbarPreparing', (e) => {
        const mergedArray = toolbarItem.concat(props.toolbars);
        mergedArray.forEach(item => {
            e.toolbarOptions.items?.unshift(item);
        });
        const toolbarItems = e.toolbarOptions.items;
        for (const name in updates) {
            const index = toolbarItems.findIndex(item => item.name == name);
            if (index !== -1) {
                Object.assign(toolbarItems[index].options, updates[name]);
            }
        }
    });
}

const toolbarItem = [
    {
        location: "after",
        widget: "dxButton",
        name: 'myGridRefresh',
        locateInMenu: 'auto',
        options: {
            icon: "refresh",
            hint: 'Làm mới dữ liệu',
            disabled: false,
            onClick: function () {
                gridRef.value?.instance?.refresh()

            },
        }
    },
    {
        location: 'after',
        widget: 'dxButton',
        name: 'myGridDeleteRow',
        locateInMenu: 'auto',
        options: {
            text: "Xóa",
            icon: 'trash',
            type: 'danger',
            hint: "Xoá",
            disabled: selectedRowIndex.value,
            visible: true,
            onClick: function () {
                var items_selected = gridRef.value?.instance?.getSelectedRowsData();
                if (items_selected.length) {
                    let result = confirm(`Xác nhận xóa ${items_selected.length} bản ghi đã chọn?`, "Thông báo");
                    result.then((dialogResult) => {
                        if (dialogResult) {
                            var items_selected = gridRef.value?.instance?.getSelectedRowsData();
                            var items = [];
                            var keyDT = gridRef.value?.instance?.getDataSource().key();
                            items_selected.forEach(function (value) {
                                if (Array.isArray(keyDT)) {
                                    var keyArr = {};
                                    keyDT.forEach(function (val) {
                                        keyArr[val] = value[val];
                                    });
                                    items.push(keyArr);
                                } else {
                                    items.push(value[keyDT]);
                                }
                            });
                            gridRef.value?.instance?.beginCustomLoading("Đang xử lý ...");
                            let result = PostData(props.url + "/Delete", { items: JSON.stringify(items) });
                            result.then((response) => {
                                console.log(response);
                                if (response.Data != null && response.Data.length) {
                                    alert(response.Data.join('<br/>'), "Thông báo");
                                } else {
                                    showToast(ThongBao.xoa, TypeToast.Success);
                                }
                                gridRef.value?.instance?.endCustomLoading();
                                gridRef.value?.instance?.deselectAll();
                                gridRef.value?.instance?.refresh();
                            });
                            gridRef.value?.instance?.endCustomLoading();
                        }
                    });
                } else {
                    alert("Vui lòng chọn 1 bản ghi", "Thông báo");
                }

            }
        }
    },
    {
        location: 'after',
        widget: 'dxButton',
        name: 'myGridEditRow',
        locateInMenu: 'auto',
        options: {
            text: "Sửa",
            icon: 'edit',
            type: 'default',
            hint: "Sửa",
            disabled: selectedRowIndex.value === -1,
            visible: true,
            onClick: function () {
                editRow();
            }
        }
    },
    {
        location: 'after',
        widget: 'dxButton',
        name: 'myGridCopy',
        locateInMenu: 'auto',
        options: {
            icon: 'copy',
            hint: 'Sao chép',
            disabled: selectedRowIndex.value === -1,
            visible: false,
            onClick: function () {

            }
        }
    },
    {
        location: 'after',
        widget: 'dxButton',
        name: 'myGridAddRow',
        locateInMenu: 'auto',
        options: {
            text: "Thêm",
            icon: 'plus',
            type: 'success',
            hint: "Thêm mới",
            visible: true,
            onClick: function () {
                addRow();
            }
        }
    },
]
</script>
