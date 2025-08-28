<template>
    <DxPopup :visible="visible" :title="title" :width="width" :height="height" :show-close-button="showCloseButton"
        :hide-on-outside-click="hideOnOutsideClick" drag-enabled @hiding="onClose">
        <div class="flex flex-col h-full">
            <div class="flex-1 min-h-0 overflow-hidden">
                <BaseUploader />
            </div>

            <div v-if="showFooter" class="flex justify-end mt-4 gap-2 px-4 py-2">
                <DxButton text="Hủy" @click="onClose" type="normal" />
                <!-- <DxButton text="Đồng ý" @click="handleConfirm" type="success" /> -->
            </div>
        </div>
    </DxPopup>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import DxPopup from 'devextreme-vue/popup'
import DxButton from 'devextreme-vue/button'
import BaseUploader from './BaseUploader.vue'
import { GetData, PostData } from '@/composables/GlobalService'
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
watch(() => props.visible, async (val) => {
    if (val) {

    }
});
onMounted(async () => {
    console.log(props.parm.soluong);
});
const handleConfirm = async () => {
    props.onClose()
}
</script>