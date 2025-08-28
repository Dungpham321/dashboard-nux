<template>
  <div>
    <button v-if="ops.soluong > 0" @click="openUploadModal"
      class="px-4 py-2 border border-gray-400 rounded text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
      <DynamicIcon :name="'upload'" prefix="fas" /> Tải lên tệp tin...
    </button>
    <a href="#" class="div-lik" @click.prevent="openUploadModal" v-html="dsfile"></a>
  </div>
  <PopupFile v-if="showPopup" :visible="showPopup" :parm="ops" :onClose="closePopup" :showFooter="true"
    :title="'Upload file'" :width="800" />
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DynamicIcon from "../Icons/DynamicIcon.vue";
import PopupFile from './PopupFile.vue';
const showPopup = ref(false);
const popupData = ref({});

const props = defineProps({
  ops: {
    type: Object,
    default: () => ({
      tgroup: null,
      doituongid: 0,
      chucnang: '',
      doituongloai: '',
      soluong: 0,
      fileExt: '',
      icon: false,
      download: true,
      delete: true,
      multiple: false,
      kyso: false,
      callbackUpload: null,
      callback: null
    })
  },
  itemInfo: {
    type: Object,
    default: () => ({})
  },
  value: {
    type: [String, Number, Object],
    default: null
  }

})
const dsfile = ref('')

const fetchFiles = async () => {
  //   try {
  //     const response = await nuxtApp.$api.get('HeThong/HT_TEP/List', {
  //       params: {
  //         DOITUONG_ID: props.ops.doituongid,
  //         CHUCNANG: props.ops.chucnang,
  //         DOITUONG_LOAI: props.ops.doituongloai,
  //         TGROUP: props.ops.tgroup
  //       }
  //     })

  //     const files = response.data.Data || []

  //     if (props.ops.icon) {
  //       dsfile.value = files.length > 0 ? `<i class="fa fa-file"></i> ${files.length} Tệp tin` : ''
  //     } else {
  //       const groups = [...new Set(files.filter(f => f.TGROUP).map(f => f.TGROUP))]
  //       dsfile.value = ''

  //       if (groups.length > 1) {
  //         groups.forEach(g => {
  //           dsfile.value += `<strong>- ${g}</strong><br/>`
  //           files.filter(f => f.TGROUP === g).forEach(item => {
  //             dsfile.value += `<i class="fa fa-file"></i> ${item.TEN_TEP} <i class="idate">(${formatDate(item.NGAY_TAO)})</i><br/>`
  //           })
  //         })
  //       } else {
  //         files.forEach(item => {
  //           dsfile.value += `<i class="fa fa-file"></i> ${item.TEN_TEP} <i class="idate">(${formatDate(item.NGAY_TAO)})</i><br/>`
  //         })
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Lỗi khi tải danh sách tệp:', error)
  //   }
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('vi-VN', { hour12: false })
}
const closePopup = () => {
  showPopup.value = false;
}
const openUploadModal = () => {
  showPopup.value = true;
  //   // Gọi modal hoặc component upload của bạn
  //   // Truyền props.ops vào để xử lý
  //   // Sau khi upload xong, gọi lại fetchFiles()
  //   if (props.ops.callbackUpload) props.ops.callbackUpload()
  //   fetchFiles()
  //   if (props.ops.callback) props.ops.callback()
}

onMounted(() => {
  console.log(props.value);
  //   fetchFiles()
})
</script>
