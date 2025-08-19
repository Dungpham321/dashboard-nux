<template>
    <div class="w-auto">
        <div class="Title_content text-[22px] mb-4">
            Phân quyền
        </div>
        <div class="flex items-center mb-2 mt-2.5">
            <label class="min-w-[120px] text-left label-text Title_content text-[16px]">Nhóm quyền</label>
            <DxSelectBox id="my-selectbox" :data-source="dataListNhomQuyen.data" value-expr="_id" display-expr="TEN"
                :value="RID" :width="500" :search-enabled="true" @selection-changed="(e) => RID = e.selectedItem._id" />
            <DxButton class="ml-2" text="Lưu lại" type="success" @initialized="onBtnInit" @click="luuQuyen" />
        </div>

        <DxTreeView :data-source="dataListQuyen.data" data-structure="plain" key-expr="MA" display-expr="TEN"
            parent-id-expr="CHUC_NANG" root-value="" show-check-boxes-mode="normal" selection-mode="multiple"
            :select-by-click="true" :select-nodes-recursive="true" :search-enabled="true"
            no-data-text="không có dữ liệu" :height="'100%'" :visible="true" @initialized="onTreeInitialized"
            @item-selection-changed="onItemSelectionChanged" />
    </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useToast, GetData, PostData, DataSourceP } from '@/composables/GlobalService'
import DxSelectBox from 'devextreme-vue/select-box'
import DxTreeView from 'devextreme-vue/tree-view';
import DxButton from 'devextreme-vue/button'
const route = useRoute()
const treeViewRef = ref()
const btnRef = ref()
const autoSelect = ref(false)
const RID = ref(route.params.id)

const { showToast } = useToast()

const dataListQuyen = DataSourceP('HT_NHOMQUYEN_QUYEN/ListQUYEN', ['MA'], ['MA', 'TEN', 'CHUC_NANG'], ['SAP_XEP']);
const dataListNhomQuyen = DataSourceP('HT_NHOMQUYEN/List', ['_id'], ['_id', 'TEN'], ['TEN']);

const loadData = async (selected) => {
    if (!treeViewRef.value) return
    setTimeout(() => {
        treeViewRef.value.option('visible', true)
    }, 500)
    treeViewRef.value.unselectAll()
    btnRef.value.option('disabled', true);
    const response = await GetData('HT_NHOMQUYEN_QUYEN/List', { RID: selected })
    const items = response.Data
    const nodes = treeViewRef.value.getNodes()
    autoSelect.value = true
    items.forEach((item) => {
        let hasChild = true
        for (const n of nodes) {
            if (item.QUYEN === n.key && (n.children?.length ?? 0) !== 0) {
                hasChild = false
                break
            }
        }
        if (hasChild) {
            treeViewRef.value.selectItem(item.QUYEN)
        }
    });
    autoSelect.value = false
}

const luuQuyen = async (e) => {
    treeViewRef.value.option('searchValue', '')
    const reqData = treeViewRef.value.getSelectedNodeKeys()
    await PostData('HT_NHOMQUYEN_QUYEN/Create', { RID: RID.value, items: reqData }).then((response) => {
        showToast('Lưu thành công!', 'success')
        e.component.option('disabled', true)
    });

}

function onItemSelectionChanged(e) {
    btnRef.value.option('disabled', false);
    btnRef.value.repaint()
}


function onTreeInitialized(e) {
    treeViewRef.value = e.component
}
function onBtnInit(e) {
    btnRef.value = e.component;
}

watch(RID, (newVal) => {
    if (newVal) {
        setTimeout(() => {
            loadData(newVal)
        }, 200)
    }
})

onMounted(async () => {
    if (RID.value) {

        loadData(RID.value)
    }
})
</script>
