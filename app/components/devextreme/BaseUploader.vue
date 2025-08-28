<template>
  <div class="widget-container">
    <div id="dropzone-external" class="flex-box" :class="{ 'dropzone-active': isDropZoneActive }">
      <img id="dropzone-image" :src="imageSource" v-if="imageSource" alt="Uploaded image" width="100%" height="100%" />
      <div id="dropzone-text" class="flex-box" v-if="textVisible">
        <span>Kéo thả file vào đây</span>
        <span>…hoặc nhấn chọn.</span>
      </div>
      <DxProgressBar id="upload-progress" :min="0" :max="100" width="30%" :show-status="false"
        :visible="progressVisible" :value="progressValue" />
    </div>
    <DxFileUploader 
      id="file-uploader" 
      dialog-trigger="#dropzone-external" 
      drop-zone="#dropzone-external"
      :multiple="false" 
      :allowed-file-extensions="allowedFileExtensions" 
      upload-mode="instantly"
      upload-url="https://js.devexpress.com/Demos/NetCore/FileUploader/Upload" 
      :visible="false" 
      @uploaded="onUploaded"
      @progress="onProgress" 
      @upload-started="onUploadStarted" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { DxFileUploader, type DxFileUploaderTypes } from 'devextreme-vue/file-uploader'
import { DxProgressBar } from 'devextreme-vue/progress-bar'
const props = defineProps({
  doituongid: {
    type: [String, Number],
    default: ""
  },
  doituongloai: {
    type: String,
    default: ""
  },
  chucnang: {
    type: String,
    default: ""
  },
  soluong:{
    type: Number,
    default: 0
  },
  fileExt:{
    type:Array,
    default: () => []
  }
});
const isDropZoneActive = ref(false)
const imageSource = ref('')
const textVisible = ref(true)
const progressVisible = ref(false)
const progressValue = ref(0)
const allowedFileExtensions = ['.jpg', '.jpeg', '.gif', '.png']

function onDropZoneEnter({ component, dropZoneElement, event }: DxFileUploaderTypes.DropZoneEnterEvent) {
  if (dropZoneElement.id === 'dropzone-external') {
    const items = (event as any).originalEvent.dataTransfer.items
    const allowed = component.option('allowedFileExtensions') as string[] | undefined;
    const draggedExt = `.${items[0].type.replace(/^image\//, '')}`
    if (items.length === 1 && allowed?.includes(draggedExt)) {
      isDropZoneActive.value = true
    }
  }
}

function onDropZoneLeave(e: DxFileUploaderTypes.DropZoneLeaveEvent) {
  if (e.dropZoneElement.id === 'dropzone-external') {
    isDropZoneActive.value = false
  }
}

function onUploaded({ file, request }: DxFileUploaderTypes.UploadedEvent) {
  // const reader = new FileReader()
  // reader.onload = () => {
  //   isDropZoneActive.value = false
  //   imageSource.value = reader.result as string
  // }
  // reader.readAsDataURL(file)
  
  textVisible.value = false
  progressVisible.value = false
  progressValue.value = 0
  console.log(request);
}

function onProgress(e: DxFileUploaderTypes.ProgressEvent) {
  progressValue.value = (e.bytesLoaded / e.bytesTotal) * 100
}

function onUploadStarted() {
  imageSource.value = ''
  progressVisible.value = true
}
</script>

<style scoped>
#dropzone-external {
  width: 200px;
  height: 200px;
  background-color: rgb(183 183 183 / 10%);
  border-width: 2px;
  border-style: dashed;
  padding: 10px;
  border-color: var(--dx-color-border);
}

#dropzone-external>* {
  pointer-events: none;
}

#dropzone-external.dropzone-active {
  border-style: solid;
  border-color: var(--dx-color-primary);
}

.widget-container>span {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 16px;
}

#dropzone-image {
  width: 100%;
  height: 100%;
}

#dropzone-text>span {
  font-weight: 100;
  opacity: 0.5;
}

#upload-progress {
  display: flex;
  margin-top: 10px;
}

.flex-box {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>