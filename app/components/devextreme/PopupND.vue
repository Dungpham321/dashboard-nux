<template>
  <DxPopup :visible="visible" :title="title" :width="width" :height="height" :show-close-button="showCloseButton"
    :hide-on-outside-click="hideOnOutsideClick" drag-enabled @hiding="onClose">
    <div class="flex flex-col h-full">
      <div class="flex-1 min-h-0 overflow-hidden">
        <BaseDataGrid :data-source="dataSourced" :cols="cols" :visible-title="false"
          :selectionMode="'none'" :modeEditing="'cell'" />
      </div>

      <div v-if="showFooter" class="flex justify-end mt-4 gap-2 px-4 py-2">
        <DxButton text="Hủy" @click="onClose" type="normal" />
        <DxButton text="Đồng ý" @click="handleConfirm" type="success" />
      </div>
    </div>
  </DxPopup>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import DxPopup from 'devextreme-vue/popup'
import DxButton from 'devextreme-vue/button'
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue'
import { GetData, PostData } from '@/composables/GlobalService'
import { hideGridHeader } from '../utils/Funtion-Grid'
import { useToast } from '@/composables/GlobalService'
import { ThongBao, TypeToast } from '~/components/enums/ThongBao';
const { showToast } = useToast();
const props = defineProps({
  visible: Boolean,
  title: { type: String, default: 'Lựa chọn' },
  width: { type: Number, default: 600 },
  height: { type: Number, default: 500 },
  onClose: Function,
  showCloseButton: { type: Boolean, default: true },
  hideOnOutsideClick: { type: Boolean, default: true },
  showFooter: { type: Boolean, default: false },
  onConfirm: Function,
  confirmText: { type: String, default: 'Đồng ý' },
  cancelText: { type: String, default: 'Hủy' },
  parm: Object
})

const dataSourced = ref([])
const cols = [
  { df: 'ID', c: 'Mã', w: 150, ae: false, v: false },
  { df: 'TEN_DANG_NHAP', c: 'Tên đăng nhập', ae: false },
  { df: 'CHON', c: 'Chọn', dt: 'boolean', w: 80, ae: true }
]

const getDataSource = async () => {
  const response = await GetData('HT_NGUOIDUNG_SD/List', {
    NGUOIDUNG_ID: props.parm?.nguoidung_id,
    DOITUONG_ID: props.parm?.doituong_id,
    CHUCNANG: props.parm?.chucnang,
    DOITUONG_LOAI: props.parm?.doituong_loai
  })
  dataSourced.value = response.Data
}
const gridRef = useState('gridRef');
watch(() => props.visible, async (val) => {
  if (val) {
    await getDataSource()
    hideGridHeader(gridRef.value);
    gridRef.value.instance.option('editing.allowUpdating', true);
  }
});
onMounted(async () =>{
   await getDataSource()
    hideGridHeader(gridRef.value);
    gridRef.value.instance.option('editing.allowUpdating', true);
});


const handleConfirm = async () => {
  await PostData('HT_NGUOIDUNG_SD/Create', {
    NGUOIDUNG_ID: props.parm?.nguoidung_id,
    DOITUONG_ID: props.parm?.doituong_id,
    CHUCNANG: props.parm?.chucnang,
    DOITUONG_LOAI: props.parm?.doituong_loai,
    dataMain: dataSourced.value
  }).then((response) => {
    showToast(ThongBao.CapNhatThanhCong, TypeToast.Success);
  });

  props.onClose()
}
</script>