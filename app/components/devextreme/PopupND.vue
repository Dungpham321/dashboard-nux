<template>
  <DxPopup :visible="visible" :title="title" :width="width" :height="height" :show-close-button="showCloseButton"
    :hide-on-outside-click="hideOnOutsideClick" drag-enabled @hiding="onClose">
    <div class="flex flex-col h-full overflow-hidden">
      <div class="flex-grow overflow-auto">
        <BaseDataGrid :grid-key="gridkey" :data-source="dataSourced" :cols="cols" :visible-title="false"
          :selectionMode="'none'" :modeEditing="'cell'" class="h-full" />
      </div>
      <div v-if="showFooter" class="flex justify-end gap-2 py-2 shrink-0">
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
import { dsDoiTuong, dsChucNang } from '~/components/enums/ThongBao'

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
const dataSourced = ref([]);
const cols = ref([]);
const gridkey = ref("popupND");
function generateCols(data, saveVisible, dataMain, gridRef) {
  cols.value = [];
  let cap = 'Đối tượng';
  if (!data.doituongid) {
    if (data.doituongloai === dsDoiTuong.DM_DANHMUC) {
      if (data.chucnang === dsChucNang.donvi) cap = 'Đơn vị';
      else if (data.chucnang === dsChucNang.nhomquyen) cap = 'Nhóm quyền';
    }
    cols.value.push({
      df: 'TEN_DOI_TUONG',
      c: cap,
      ae: false
    });
  } else {
    cols.value.push({
      df: 'TEN_DANG_NHAP',
      c: 'Người dùng',
      ae: false
    });
  }
  // Cột CHON có checkbox ở header
  cols.value.push({
    df: 'CHON',
    dt: 'boolean',
    c: 'Lựa chọn',
    w: 115,
    sortIndex: 0,
    sortOrder: 'desc',
    a: 'center',
    ae: saveVisible,
    ops: {
      headerCellTemplate: function (container) {
        if (data.multiple) {
          const wrapper = document.createElement('div');
          wrapper.style.display = 'flex';
          wrapper.style.justifyContent = 'center';
          wrapper.style.alignItems = 'center';
          wrapper.style.width = '100%';
          wrapper.style.flexDirection = 'column'; // Căn dọc
          const label = document.createElement('label');
          label.style.display = 'flex';
          label.style.flexDirection = 'column'; // Đặt nội dung theo chiều dọc
          label.style.alignItems = 'center';
          label.style.textAlign = 'center';
          const labelText = document.createElement('span');
          labelText.textContent = 'Lựa chọn';
          const checkbox = document.createElement('input');
          checkbox.type = 'checkbox';
          label.appendChild(labelText);
          label.appendChild(checkbox);
          label.addEventListener('click', () => {
            const checked = checkbox.checked;
            dataMain.forEach(dt => dt.CHON = checked);
            gridRef.value.instance.option('dataSource', dataMain);
          });

          wrapper.appendChild(label);
          container.appendChild(wrapper);
        } else {
          container.innerHTML = '<label>Lựa chọn</label>';
        }


      }
    }

  });
}
const getDataSource = async () => {
  const response = await GetData('HeThong/HT_NGUOIDUNG_SD/' + (props.parm.doituongid == "" ? "ListAccess" : "List"), {
    NGUOIDUNG_ID: props.parm?.nguoidungid,
    DOITUONG_ID: props.parm?.doituongid,
    CHUCNANG: props.parm?.chucnang,
    DOITUONG_LOAI: props.parm?.doituongloai,
    MULTIPLE: props.parm?.multiple
  })
  dataSourced.value = response.Data
}
const gridRef = useState('gridRef-' + gridkey.value);
watch(() => props.visible, async (val) => {
  if (val) {
    const saveVisible = typeof props.parm.mode != 'undefined' && props.parm.mode == 'view' ? false : true;
    await getDataSource();
    generateCols(props.parm, saveVisible ?? true, dataSourced.value, gridRef)
    hideGridHeader(gridRef.value);
    gridRef.value.instance.option('editing.allowUpdating', true);
  } else {
    cols.value = [];
    dataSourced.value = [];
    gridRef.value = null;
  }
});

const handleConfirm = async () => {
  await PostData('HeThong/HT_NGUOIDUNG_SD' + (props.parm.doituongid + '' == '' ? '/Access' : ''), {
    NGUOIDUNG_ID: props.parm?.nguoidungid,
    DOITUONG_ID: props.parm?.doituongid,
    CHUCNANG: props.parm?.chucnang,
    DOITUONG_LOAI: props.parm?.doituongloai,
    data: dataSourced.value
  }).then((response) => {
    showToast(ThongBao.CapNhatThanhCong, TypeToast.Success);
    props.parm.callback();
  });
  props.onClose()
}
</script>