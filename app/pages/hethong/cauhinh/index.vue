<template>
    <DxLoadPanel :visible="isLoading" />
    <BaseForm v-if="isReady" :formData="formData" :formItems="userFormConfig" :formOptions="formOption"
        :Title="Title" />
</template>
<script setup>
definePageMeta({
    layout: "default",
    middleware: ['auth']
});
import BaseForm from '@/components/devextreme/BaseForm.vue'
import { DxLoadPanel } from 'devextreme-vue/load-panel'
import { PostData, useToast } from '@/composables/GlobalService';
import { ref, onBeforeMount } from 'vue'
import { ThongBao, TypeToast } from '~/components/enums/ThongBao';
import templateEditFile from '~/components/devextreme/templateEditFile.vue';
const isLoading = ref(false);
const isReady = ref(false);
const formData = reactive({});
const { showToast } = useToast()
const Title = ref(null);

const AccessData = async () => {
    const check = await checkAccess("HT_CAUHINH/Access", { MA: "HETHONG" });
    if (check) {
        Object.assign(formData, check.Data);
        Title.value = check.Title;
    }
    isReady.value = true;
}
onBeforeMount(async () => {
    AccessData();
});

const formOption = {
    colCount: 1,
    labelLocation: 'left',
}
const userFormConfig = [
    {
        it: 'group',
        c: 'Thông tin hệ thống',
        cc: 1,
        its: [
            { df: 'ten_he_thong', lt: 'Tên ứng dụng', et: 'dxTextBox', edph: 'Tên ứng dụng' },
            { df: 'mk_macdinh', lt: 'Mật khẩu mặc định', edph: 'Mật khẩu mặc định' },
            { df: 'smtp_server', lt: 'SMTP Server' },
            { df: 'smtp_port', lt: 'SMTP Port' },
            { df: 'smtp_ssl', lt: 'SMTP Ssl' },
            { df: 'smtp_user', lt: 'SMTP User' },
            { df: 'smtp_pass', lt: 'SMTP Pass', edmo: 'password' },
            { df: 'smtp_from', lt: 'SMTP Name' },
            { df: 'smtp_mail', lt: 'SMTP Email' },
            {
                df: 'logo', lt: 'Logo hệ thống', t: templateEditFile, tProps:{
                    soluong: 1
                }
            },
        ]
    },
    {
        it: 'group',
        c: 'Liên hệ hỗ trợ',
        cc: 1,
        its: [
            { df: 'zalo', lt: 'Link nhóm hỗ trợ', et: 'dxTextBox' },
            { df: 'phone', lt: 'Điện thoại hỗ trợ', et: 'dxTextBox' }
        ]
    },
    {
        it: 'button', ha: 'right', bt: 'Cập nhật', bi: 'save', bus: true, bty: 'success',
        bo: function (e) {
            isLoading.value = true;
            PostData("HT_CAUHINH/Save", { MA: "HETHONG", items: formData }).then((response) => {
                showToast(ThongBao.CapNhatThanhCong, TypeToast.Success);
                AccessData();
                isLoading.value = false;
            });
        }
    }

]
</script>
