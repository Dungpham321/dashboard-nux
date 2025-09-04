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
import TinymceEditor from '~/components/lib/TinymceEditor.vue';
const isLoading = ref(false);
const isReady = ref(false);
const formData = reactive({});
const { showToast } = useToast()
const Title = ref(null);

const AccessData = async () => {
    const check = await checkAccess("HeThong/HT_CAUHINH/Access", { MA: "HETHONG" });
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
            { df: 'TT_TEN_DON_VI', lt: 'Tên đơn vị', edml: 255 },
            { df: 'TT_SO_DIEN_THOAI', lt: 'Số điện thoại', edml: 255 },
            { df: 'TT_EMAIL', lt: 'Email', edml: 255 },
            { df: 'TT_DIA_CHI', lt: 'Địa chỉ', edml: 255 },
            // {
            //     df: 'logo', lt: 'Logo hệ thống', t: templateEditFile, tProps: {
            //         soluong: 1
            //     }
            // },
        ]
    },
    {
        it: 'group',
        c: 'Thông số hệ thống',
        cc: 1,
        its: [
            { df: 'TS_DANG_NHAP_SAI', lt: 'Số lần đăng nhập sai', et: 'dxNumberBox', edmin: 0, ht: 'Lần (0 là không giới hạn)' },
            { df: 'TS_THOI_GIAN_MAT_KHAU', lt: 'Thời gian mật khẩu hợp lệ', et: 'dxNumberBox', edmin: 0, ht: 'Ngày (0 là không giới hạn)' },
            { df: 'TS_DOI_MAT_KHAU', lt: 'Yêu cầu đổi mật khẩu mặc định', et: 'dxCheckBox' },
            { df: 'TS_DO_DAI_MAT_KHAU', lt: 'Yêu cầu độ dài mật khẩu', et: 'dxNumberBox', edmin: 0 },
            { df: 'TS_MATKHAU_SO', lt: 'Mật khẩu có ký tự số', et: 'dxCheckBox' },
            { df: 'TS_MATKHAU_DB', lt: 'Mật khẩu có ký tự đặc biệt', et: 'dxCheckBox' },
            { df: 'TS_TEN_MIEN', lt: 'Tên miền', edml: 255 },
            { df: 'TS_TEN_APP', lt: 'Tên ứng dụng', edml: 255 },
            { df: 'DefaultPassword', lt: 'Mật khẩu mặc định' },
            { df: 'SMTP_SERVER', lt: 'SMTP server' },
            { df: 'SMTP_PORT', lt: 'SMTP server' },
            { df: 'SMTP_SSL', lt: 'SMTP SSL' },
            { df: 'SMTP_USER', lt: 'Username' },
            { df: 'SMTP_PASS', lt: 'Password', edmo: "password" },
            { df: 'SMTP_FROM', lt: 'From Name' },
            { df: 'SMTP_MAIL', lt: 'From Email' },
            { df: 'MA_HO_SO', lt: 'Cấu trúc sinh mã hố sơ', ht: '@madonvi: Mã đơn vị; @lv: Lĩnh vực; @soluonghs: Số lượng hồ sơ trong ngày; @sotutang: Số tăng tự động; @nam: Năm tạo; @ngay: Ngày tạo; @thang: Tháng tạo ...' },
            { df: 'MA_DIABAN', lt: 'Mã địa bàn' },
        ]
    },
    {
        it: 'group',
        c: 'Giao diện hệ thống',
        cc: 1,
        its: [
            // {
            //     df: 'GD_LOGO', lt: 'Hình ảnh logo, banner quản trị',
            //     t: function (itemInfo, itemElement) {
            //         GlobalService.templateEditFile(itemElement, { doituongid: 1000, chucnang: 'HT_CAUHINH', doituongloai: 'LOGO', soluong: 1, fileExt: 'image/*', icon: false, multiple: false });
            //     },
            // },
            { df: 'TITLE', lt: 'Tiêu đề trang quản trị' },
            {
                df: 'FOOTER', lt: 'Chân trang quản trị', type:'tinymce'
            },
            { df: 'HOTRO_ZALOLINK', lt: 'Link nhóm hỗ trợ' },
            { df: 'HOTRO_ZALOPHONE', lt: 'Điện thoại hỗ trợ' },
        ]
    },
    {
        it: 'group',
        c: 'Kiểm soát truy cập',
        cc: 1,
        its: [
            { df: 'BAOMAT_TRUYCAP', lt: 'Yêu cầu giao thức HTTPS', et: 'dxCheckBox' },
            { df: 'BAOMAT_IP', lt: 'Danh sách IP được truy cập', et: 'dxTextArea', edph: 'Mỗi ip trên 1 dòng' },
            { df: 'BAOMAT_TIMEOUT', lt: 'Giới hạn thời gian chờ', et: 'dxNumberBox', edmin: 0, ht: 'Giây (0 là không giới hạn)' },
            { df: 'BAOMAT_GOIHAN', lt: 'Giới hạn thiết bị truy cập mỗi IP', et: 'dxNumberBox', edmin: 0, ht: 'Thiết bị (0 là không giới hạn)' }
        ]
    },
    {
        it: 'button', ha: 'right', bt: 'Cập nhật', bi: 'save', bus: true, bty: 'success',
        bo: function (e) {
            isLoading.value = true;
            PostData("HeThong/HT_CAUHINH/Save", { formData }).then((response) => {
                showToast(ThongBao.CapNhatThanhCong, TypeToast.Success);
                AccessData();
                isLoading.value = false;
            });
            e.preventDefault();
        }
    }

]
</script>
