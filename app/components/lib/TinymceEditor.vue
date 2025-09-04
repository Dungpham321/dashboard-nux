<template>
    <ClientOnly>
        <Editor v-model="model" :init="editorConfig" />
    </ClientOnly>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/tinymce';
// @ts-ignore
import 'tinymce/themes/silver/theme';
// @ts-ignore
import 'tinymce/icons/default/icons';
// @ts-ignore
import 'tinymce/plugins/link';
// @ts-ignore
import 'tinymce/plugins/image';
// @ts-ignore
import 'tinymce/plugins/code';
// @ts-ignore
import 'tinymce/plugins/lists';
// @ts-ignore
import 'tinymce/plugins/table';
const props = defineProps < { modelValue: string } > ()
const emit = defineEmits < { (e: 'update:modelValue', value: string): void }> ()

const model = ref(props.modelValue)
watch(model, val => emit('update:modelValue', val))

const editorConfig = {
    height: 400,
    menubar: false,
    plugins: 'link image code lists table',
    toolbar:
        'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image table | code',
    branding: false,
    model: 'dom',
    model_url: 'https://cdn.tiny.cloud/1/no-api-key/tinymce/7/models/dom/model.js' // hoặc host riêng nếu cần
}

</script>