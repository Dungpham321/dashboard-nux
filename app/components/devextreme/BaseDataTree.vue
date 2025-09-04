<template>
    <div class='content flex flex-col h-[90vh] max-h-[85vh] overflow-hidden'>
        <div class='Title_content text-[22px] mb-4 shrink-0' v-show="visibleTitle">
            {{ props.Title }}
        </div>
        <div class='flex-grow overflow-auto'>
            <DxTreeList ref="gridRef" :key="gridKey" :key-expr="'ID'" :parent-id-expr="'PID'" :root-value="0"
                :has-items-expr="'HASCHILD'" :data-source="dataSource" :show-borders="true" :column-auto-width="true"
                :allow-column-reordering="true" :show-column-lines="true" :show-row-lines="true"
                :row-alternation-enabled="false" width="100%" height="100%" :remote-operations="{
                    filtering: true,
                    sorting: false,
                    paging: false
                }" :focused-row-enabled="false" :sync-lookup-filter-values="false" :word-wrap-enabled="true"
                :two-way-binding-enabled="true" :repaint-changes-only="true" :allow-column-resizing="true"
                @exporting="onExporting" @toolbar-preparing="onToolbarPreparing" @selection-changed="selectedChanged"
                @row-updated="onRowUpdated" @row-inserted="onRowInsert" @init-new-row="onInitNewRow"
                @editing-start="onEditingStart" @edit-canceled="onCancel">
                <!-- Cột động -->
                <template v-for="(col, index) in formColumns" :key="col.df || index">
                    <DxColumn v-bind="col" />
                </template>
                <!-- Paging -->
                <DxPaging :enabled="true" :page-size="20" />
                <DxPager :visible="true" :show-page-size-selector="true" :allowed-page-sizes="allowedPageSizes"
                    :display-mode="'compact'" />
                <!-- Selection -->
                <DxSelection :mode="selectionMode" select-all-mode="allPages" show-check-boxes-mode="onClick" />
                <!-- Search -->
                <DxSearchPanel :visible="true" placeholder="Tra cứu" :width="280" />
                <!-- Editing -->
                <DxEditing :mode="modeEditing">
                    <DxPopup title="Thêm mới" :show-title="true" :width="width" :height="height" />
                    <DxForm>
                        <template v-for="(col, index) in formColumns" :key="col.df || index">
                            <DxColumn v-bind="col" />
                        </template>
                    </DxForm>
                </DxEditing>

                <!-- Load Panel -->
                <DxLoadPanel :enabled="true" />
            </DxTreeList>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, defineExpose, onBeforeUnmount } from 'vue'
const selectedRowIndex = ref(-1);
const editMode = ref("");
import { useGridState } from '@/composables/useGridState';
import {
    DxTreeList,
    DxColumn,
    DxPaging,
    DxPager,
    DxSelection,
    DxSearchPanel,
    DxEditing,
    DxPopup,
    DxForm,
    DxLoadPanel
} from 'devextreme-vue/tree-list';

import { confirm } from 'devextreme/ui/dialog';
import { buildColumn } from '@/components/utils/column-utils'
import { useToast } from '@/composables/GlobalService'
import { ThongBao, TypeToast } from '~/components/enums/ThongBao';
const { showToast } = useToast();
const props = defineProps({
    dataSource: {
        type: [Array, Object]
    },
    keyExpr: {
        type: String,
        default: 'ID'
    },
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
    Title: {
        type: String,
        default: "Tiêu đề chức năng"
    },
    visibleTitle: {
        type: Boolean,
        default: true
    },
    New: {
        type: Boolean,
        default: true
    },
    Edit: {
        type: Boolean,
        default: true
    },
    Delete: {
        type: Boolean,
        default: true
    },
    gridKey: {
        type: String,
        default: "grid"
    }
});
const { gridRef, gridKey } = useGridState(props.gridKey);

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
        editMode.value = "edit";
        gridInstance.editRow(selectedRowIndex.value);
        gridInstance.deselectAll();
    }
}
function onInitNewRow(e) {
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
function onCancel(e) {
    editMode.value = "";
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
            visible: props.Delete,
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
                                if (typeof response != "undefined" && response.Data != null && response.Data.length) {
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
            visible: props.Edit,
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
            visible: props.New,
            onClick: function () {
                addRow();
            }
        }
    },
]
const formColumns = computed(() =>
    props.cols.map(col => buildColumn(col, col.ops ?? {}))
);
defineExpose({
    editMode
})
</script>
