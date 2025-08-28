<template>
  <a :id="keyElement" href="#" class="div-lik hover:text-rose-300 dark:hover:text-amber-400"
    :class="ds.length === 0 ? 'div-lik-gray div-lik-wrap' : 'text-blue-600 dark:text-blue-300 whitespace-normal'" 
    v-html="dsdm"
    @click.prevent="openBrowser"></a>
  <PopupND v-show="showPopup" :visible="showPopup" :parm="props" :onClose="closePopup" :showFooter="true" />
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { GetData } from '@/composables/GlobalService';
import PopupND from './PopupND.vue';
const props = defineProps({
  nguoidungid: Number,
  doituongid: String,
  chucnang: Number,
  doituongloai: String,
  multiple: Boolean,
  title: String,
  required: Boolean,
  icon: Boolean,
  mode: String,
  td: { type: String, default: 'Lựa chọn' },
  exData: Object,
  callback: Function
});
const keyElement = `dsnd-${props.chucnang}_${props.doituongloai}_${props.doituongid}_${props.nguoidungid}`;
const dsdm = ref('');
const ds = ref([]);
const showPopup = ref(false);
const popupData = ref({});

const loadData = async () => {
  const cacheKey = props.chucnang + props.doituongloai;
  const cached = props.exData?.[cacheKey]?.[props.nguoidungid];
  if (cached) {
    dsdm.value = cached;
    return;
  }
  const endpoint = props.doituongid ? 'List' : 'ListAccess';
  const response = await GetData(`HeThong/HT_NGUOIDUNG_SD/${endpoint}`, {
    NGUOIDUNG_ID: props.nguoidungid,
    DOITUONG_ID: props.doituongid,
    CHUCNANG: props.chucnang,
    DOITUONG_LOAI: props.doituongloai
  });
  ds.value = response.Data.filter(c => c.CHON);
  if (!props.icon) {
    if (ds.value.length > 0) {
      dsdm.value = ds.value.map(item =>
        props.doituongid ? item.TEN_DANG_NHAP : item.TEN_DOI_TUONG
      ).join(', ');

      if (props.exData && dsdm.value) {
        props.exData[cacheKey] = props.exData[cacheKey] || {};
        props.exData[cacheKey][props.nguoidungid] = dsdm.value;

      }
    } else {
      dsdm.value = props.doituongid ? '<i class="fa fa-user"></i>' : '<i class="fa fa-list-alt"></i>';
      dsdm.value += ' ' + props.td;

    }
  } else {
    dsdm.value = `${props.td} (${ds.value.length})`;
  }
};

// onMounted(loadData);
watch(() => props.nguoidungid,() => {
  
    loadData();
  },
  { immediate: true }
);

function openBrowser() {
  showPopup.value = true;
}
const closePopup = () => {
  showPopup.value = false;
}
</script>
