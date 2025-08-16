<template>
    <BaseDataGrid :data-source="dataSource.data" :key-expr="'_id'" :cols="Columns" :url="'HT_NHOMQUYEN'"
        :Title="'Quản lý nhóm quyền'" />
    <PopupND :visible="showPopup" :parm="popupData" :onClose="closePopup" :showFooter="true" />

</template>
<script setup>
definePageMeta({
    layout: "default",
    middleware: ['auth']
});
import { ref, onMounted } from 'vue'
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource } from '@/composables/GlobalService';
import { TrangThaiQuyen } from '~/components/enums/TrangThai';
import PopupND from '~/components/devextreme/PopupND.vue';

const showPopup = ref(false);
const popupData = ref({});

const dataSource = DataSource("HT_NHOMQUYEN", ['_id'], ["TEN", "MO_TA", "VI_TRI", "TRANG_THAI", "ngaytao"], ["ngaytao"]);
//các cột của lưới
const Columns = [
    { df: "TEN", c: "Tên", rq: true, w: 150 },
    { df: "MO_TA", c: "Mô tả" },
    { df: "VI_TRI", c: "Vị trí", rq: true, dt: 'number' },
    { df: "TRANG_THAI", c: "Trạng thái", lds: TrangThaiQuyen, lve: '_id', lde: 'ten' },
    {
        c: "Phân quyền", w: 100, ops: {
            type: 'buttons',
            name: 'btnPhanQuyen',
            buttons: [
                {
                    text: "Phân quyền",
                    icon: "detailslayout",
                    name: "config",
                    onClick(e) {
                        if (e.row) navigateTo("/hethong/nhomquyen/" + e.row.data._id);
                    }
                }
            ]
        }

    },
    {
        c: "Người dùng", w: 100, ops: {
            type: 'buttons',
            name: 'btnNguoiDung',
            buttons: [
                {
                    text: "Người dùng",
                    icon: "user",
                    name: "config",
                    onClick(e) {
                        if (e.row)
                            popupData.value = {
                                nguoidung_id: '',
                                doituong_id: e.row.data._id,
                                doituong_loai: '',
                                chucnang: 'HT_NHOMQUYEN'
                            };
                        // router.push("/admin/hethong/nhomquyen/" + e.row.data._id);
                        showPopup.value = true;
                    }
                }
            ]
        }
    },
]

const closePopup = () =>{
    showPopup.value = false;
}
const gridRef = useState('gridRef');
// const editMode = useState('editMode');
onMounted(() => {
    gridRef.value.instance.option("editing.form.colCount", 1);
    gridRef.value.instance.option('onInitNewRow', (e) => {
        e.data.TRANG_THAI = 1;
    });
})



</script>