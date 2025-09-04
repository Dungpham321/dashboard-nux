<template>
    <div class="w-auto">
        <div class="Title_content text-[22px] mb-4">
            Phân quyền
        </div>
        <div class="flex items-center mb-2 mt-2.5">
            <label class="min-w-[120px] text-left label-text Title_content text-[16px]">Nhóm quyền</label>
            <DxSelectBox id="my-selectbox" :data-source="dataListNhomQuyen.data" value-expr="ID" display-expr="TEN"
                :value="RID" :width="500" :search-enabled="true" @selection-changed="(e) => RID = e.selectedItem.ID" />
            <DxButton class="ml-2" text="Lưu lại" type="success" @initialized="onBtnInit" @click="luuQuyen" />
        </div>

        <DxTreeView :data-source="dataListQuyen.data" data-structure="plain" key-expr="MA" display-expr="TEN"
            parent-id-expr="CHUC_NANG" root-value="" show-check-boxes-mode="normal" selection-mode="multiple"
            :select-by-click="true" :select-nodes-recursive="true" :search-enabled="true"
            no-data-text="không có dữ liệu" :height="'100%'" :visible="true" @initialized="onTreeInitialized"
            @item-selection-changed="onItemSelectionChanged" />
        <CustomLoading :visible="isLoading" />
    </div>
</template>
<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useToast, GetData, PostData, DataSourceP } from '@/composables/GlobalService'
import DxSelectBox from 'devextreme-vue/select-box'
import DxTreeView from 'devextreme-vue/tree-view';
import DxButton from 'devextreme-vue/button'
import CustomLoading from '~/components/devextreme/CustomLoading.vue';
const route = useRoute()
const treeViewRef = ref()
const isLoading = ref(false);
const btnRef = ref()
const autoSelect = ref(false)
const RID = ref(Number(route.params.id))
const { showToast } = useToast()

const dataListQuyen = DataSourceP('HeThong/HT_NHOMQUYEN_QUYEN/ListQUYEN', ['MA'], ['MA', 'TEN', 'CHUC_NANG'], ['CHUC_NANG', 'SAP_XEP']);
const dataListNhomQuyen = DataSourceP('DanhMuc/DM_HETHONG/NHOMQUYEN', ['ID'], ['ID', 'TEN'], ['TEN']);

const loadData = (selected) => {
    if (!treeViewRef.value) return
    setTimeout(async () => {
        treeViewRef.value.option('visible', true)
        treeViewRef.value.unselectAll()
        btnRef.value.option('disabled', true);
        isLoading.value = true;
        const response = await GetData('HeThong/HT_NHOMQUYEN_QUYEN/List', { RID: selected });
        const itemss = response.Data.items;
        autoSelect.value = true
        selectItems(itemss);
        autoSelect.value = false
    }, 100);
}

const selectItems = (itemss) => {
    const nodes = treeViewRef.value.getNodes();
    itemss.forEach((item) => {
        let hasChild = true;
        for (const n of nodes) {
            if (item.QUYEN === n.key && n.children?.length !== 0) {
                hasChild = false;
                break;
            }
        }
        if (hasChild) {
            treeViewRef.value.selectItem(item.QUYEN);
        }
    });
    isLoading.value = false;
};

const luuQuyen = async (e) => {
     isLoading.value = true;
    treeViewRef.value.option('searchValue', '');
    const reqData = treeViewRef.value.getSelectedNodeKeys()
    await PostData('HeThong/HT_NHOMQUYEN_QUYEN/Create', { RID: RID.value, items: reqData }).then((response) => {
        showToast('Lưu thành công!', 'success');
        e.component.option('disabled', true);
         isLoading.value = false;
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
    console.log(newVal);
    if (newVal) {
        //setTimeout(() => {
        loadData(newVal)
        //}, 200)
    }
})
onMounted(() => {
    if (RID.value) {
        loadData(RID.value)
    }
})
</script>
