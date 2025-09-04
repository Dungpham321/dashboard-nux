<template>
    <a :id="keyElement" :class="['div-lik hover:text-rose-300 dark:hover:text-amber-400 text-blue-600 dark:text-blue-300 whitespace-normal']" href="#"
        @click="openBrowser" v-html="dsdm"></a>
    <PopupND v-show="showPopup" :visible="showPopup" :parm="props" :onClose="closePopup" :showFooter="true" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { GetData } from '@/composables/GlobalService';
import PopupND from './PopupND.vue';
const props = defineProps({
    nguoidungid: [String, Number],
    doituongid: [String, Number],
    chucnang: [String, Number],
    doituongloai: [String, Number],
    multiple: Boolean,
    mode: String,
    required: Boolean,
    callback: {
        type: Function,
        default: () => {}
    },
    icon: Boolean,
    modelValue: [Array, String, Number]
})
const dsdm = ref('')
const showPopup = ref(false);
const selectedItems = ref([])
const keyElement = computed(() =>
    `dsnds-${props.chucnang}_${props.doituongloai}_${props.doituongid}_${props.nguoidungid}`
)
const loadData = async () => {
    const endpoint = props.doituongid === '' ? 'ListAccess' : 'List'
    const response = await GetData(`HeThong/HT_NGUOIDUNG_SD/${endpoint}`, {
        NGUOIDUNG_ID: props.nguoidungid,
        DOITUONG_ID: props.doituongid,
        CHUCNANG: props.chucnang,
        DOITUONG_LOAI: props.doituongloai
    })
    selectedItems.value = response.Data.filter(item => item.CHON);
    if (!props.icon) {
        dsdm.value = selectedItems.value.length ? selectedItems.value.map(item => props.doituongid === '' ? item.TEN_DOI_TUONG : item.TEN_DANG_NHAP).join(', ') : getDefaultIcon()
    } else {
        dsdm.value = getDefaultIcon() + (selectedItems.value.length ? ` (${selectedItems.value.length})` : '')
    }

}
const getDefaultIcon = () => props.doituongid === '' ? '<i class="fa fa-list-alt"></i> Lựa chọn' : '<i class="fa fa-user"></i> Lựa chọn'

onMounted(() => {
    loadData()
})
function openBrowser() {
    showPopup.value = true;
}
const closePopup = () => {
    loadData();
    showPopup.value = false;
}
</script>
<style scoped>
.div-lik {
    cursor: pointer;
    padding: 5px;
}

.div-lik-donvi {
    color: rgb(100, 103, 105);
}

:hover .div-lik-donvi {
    color: rgb(245, 70, 79);
}
</style>
