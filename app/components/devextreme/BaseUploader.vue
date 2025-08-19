<template>
  <div>
    <DxFileUploader v-bind="uploaderOptions" />
    <DxLoadPanel :visible="loadingVisible" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { DxFileUploader } from 'devextreme-vue/file-uploader'
import { DxLoadPanel } from 'devextreme-vue/load-panel'

const props = defineProps({
  uploadUrl: {
    type: String,
    default:'/api/upload',
    required: true
  },
  maxFile: {
    type: Number,
    default: 3
  },
  onUploadDone: {
    type: Function,
    default: () => {}
  }
});



const fileUploader = ref(null)
const valueFile = ref([])
const fileUploaded = ref([])
const uploadNum = ref(0)
const uploadCount = ref(0)
const loadingVisible = ref(false)
const abort = ref(false)

const headers = {
  Authorization: 'Bearer your-token-here'
}

const onContentReady = (e) => {
  fileUploader.value = e.component
  uploadCount.value = 0
  abort.value = false
}

const onUploadStarted = (e) => {
  if (maxFile > 0 && uploadCount.value >= maxFile) {
    e.component.abortUpload(e.file)
    abort.value = true
  } else {
    uploadNum.value++
    uploadCount.value++
    loadingVisible.value = true
    abort.value = false
  }
}

const onUploadError = (e) => {
  e.component.reset()
}

const onUploaded = (e) => {
  const res = e.request.response
  if (!res) {
    resetUpload()
    return
  }

  const data = JSON.parse(res)
  if (data.Data) fileUploaded.value.push(data.Data)

  uploadNum.value--

  if (e.component.option('progress') === 100 && uploadNum.value <= 0) {
    resetUpload()
  } else if (abort.value) {
    resetUpload()
    abort.value = false
  }
}

const resetUpload = () => {
  uploadCount.value = 0
  loadingVisible.value = false
}

const uploaderOptions = {
  uploadUrl,
  uploadHeaders: headers,
  multiple: true,
  accept: '*',
  uploadMode: 'useButtons',
  showFileList: false,
  value: valueFile.value,
  onContentReady,
  onUploadStarted,
  onUploadError,
  onUploaded,
}

</script>