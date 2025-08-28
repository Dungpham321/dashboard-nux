<template>
    <div v-if="isReady">
        <BaseDataGrid :grid-key="grid" :data-source="dataSource.data" :key-expr="'ID'" :cols="Columns"
            :url="'HeThong/HT_NGUOIDUNG'" :Title="AccessRights.Title" :New="AccessRights.New" :Edit="AccessRights.Edit"
            :Delete="AccessRights.Delete" :toolbars="toolbarItem" />
        <PopupND v-show="showPopup" :visible="showPopup" :parm="popupData" :onClose="closePopup" :showFooter="true" />
    </div>
</template>
<script setup>
definePageMeta({
    layout: "default",
    middleware: ['auth']
});
import { ref, onMounted, onBeforeMount, watch, nextTick, createApp, h, render } from 'vue'
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import { DataSource, checkAccess } from '@/composables/GlobalService';
import { dsTrangThaiK } from '~/components/enums/TrangThai';
import { useToolbarButton } from '@/composables/GlobalService';
import { dsChucNang, dsDoiTuong, varVaiTro } from '~/components/enums/ThongBao';
import EditTemplateNDS from '~/components/devextreme/EditTemplateNDS.vue';
import { convertToKey, TemplateND } from '~/components/utils/Funtion-Grid';
import PopupND from '~/components/devextreme/PopupND.vue';
import EditTemplateND from '~/components/devextreme/EditTemplateND.vue';
const grid = ref("nguoidung");
const user = useCookie('user');
const gridRef = useState('gridRef-' + grid.value);
const showPopup = ref(false);
const popupData = ref({});
const childRef = ref();
const dataSource = DataSource("HeThong/HT_NGUOIDUNG", ['ID'], ["ID", "TEN_DANG_NHAP", "TEN_DAY_DU", "EMAIL", "DIEN_THOAI", "MO_TA", "DVQL_ID", "DVSD_ID", "TRANG_THAI", "NGAY_TAO", "TFA", "CANBO_ID"], ["NGAY_TAO DESC"]);
const Columns = [
    { df: "TEN_DANG_NHAP", c: "Tên đăng nhập", rq: true, w: 150 },
    { df: "MAT_KHAU", c: "Mật khẩu", rq: true, v: false },
    { df: "TEN_DAY_DU", c: "Tên đầy đủ", rq: true },
    { df: "EMAIL", c: "Email", w: 200, edtm: "email" },
    { df: "DIEN_THOAI", c: "Điện thoại" },
    {
        df: "RID", c: "Nhóm quyền", w: 150, rq: true, ops: {
            cellTemplate: TemplateND({
                chucnang: dsChucNang.nhomquyen, doituongloai: dsDoiTuong.DM_DANHMUC, td: 'Nhóm quyền', icon: false,
                popupmode: childRef.value,
                onClick: (cellInfo) => {
                    var m = user.value.TEN_DANG_NHAP != cellInfo.data.TEN_DANG_NHAP || AccessRights.VAI_TRO == varVaiTro.quantrihethong;
                    popupData.value = {
                        nguoidungid: cellInfo.key,
                        doituongid: '',
                        chucnang: dsChucNang.nhomquyen,
                        doituongloai: dsDoiTuong.DM_DANHMUC,
                        multiple: true,
                        require: false,
                        icon: false,
                        mode: m ? '' : 'view',
                        td: 'Nhóm quyền',
                        callback: function (e) {
                            const instance = gridRef.value?.instance
                            instance.refresh();
                        }
                    }
                    showPopup.value = true;
                }

            }),
            // async (container, cellInfo) => {
            //     var m = user.value.TEN_DANG_NHAP != cellInfo.data.TEN_DANG_NHAP || AccessRights.VAI_TRO == varVaiTro.quantrihethong;
            //     // const app = createApp(TemplateND, {
            //     //     nguoidungid: cellInfo.key, doituongid: '', chucnang: dsChucNang.nhomquyen, doituongloai: dsDoiTuong.DM_DANHMUC, multiple: true, required: false, icon: false, mode: m ? '' : 'view', td: 'Nhóm quyền',
            //     //     callback: function (e) {
            //     //         const instance = gridRef.value?.instance
            //     //         instance.refresh();
            //     //     }
            //     // });
            //     // app.mount(container);
            editCellTemplate: (container, cellInfo) => {
                var m = user.value.TEN_DANG_NHAP != cellInfo.data.TEN_DANG_NHAP || AccessRights.VAI_TRO == varVaiTro.quantrihethong;
                const app = createApp(EditTemplateNDS, {
                    nguoidungid: typeof cellInfo.data.ID != "undefined" ? cellInfo.data.ID : 0,
                    doituongid: '',
                    chucnang: dsChucNang.nhomquyen,
                    doituongloai: dsDoiTuong.DM_DANHMUC,
                    multiple: true,
                    required: false,
                    mode: m ? '' : 'view',
                    modelValue: cellInfo.value,
                    'onUpdate:modelValue': (val) => {
                        cellInfo.setValue(val)
                    }

                });
                app.mount(container);
            }
        }
    },
    {
        df: "COCAUTC", c: "Đơn vị", w: 150, af: false, as: false, ops: {
            cellTemplate: TemplateND({
                chucnang: dsChucNang.donvi, doituongloai: dsDoiTuong.DM_DANHMUC, multiple: true, required: true, icon: false,
                popupmode: childRef,
                onClick: (cellInfo) => {
                    popupData.value = {
                        nguoidungid: cellInfo.key,
                        doituongid: '',
                        chucnang: dsChucNang.donvi,
                        doituongloai: dsDoiTuong.DM_DANHMUC,
                        multiple: true,
                        require: true,
                        icon: false,
                        callback: function (e) {
                            const instance = gridRef.value?.instance
                            instance.refresh();
                        }
                    }
                    showPopup.value = true;
                }
            }),
            editCellTemplate: (container, cellInfo) => {
                if (cellInfo.cellElement == null) {
                    const app = createApp(EditTemplateND, {
                        nguoidungid: typeof cellInfo.data.ID != "undefined" ? cellInfo.data.ID : 0,
                        doituongid: '',
                        chucnang: dsChucNang.donvi,
                        doituongloai: dsDoiTuong.DM_DANHMUC,
                        multiple: true,
                        required: true,
                        modelValue: cellInfo.value,
                        'onUpdate:modelValue': (val) => {
                            cellInfo.setValue(val)
                        }
                    });
                    app.mount(container);
                }

            }
        }
    },
    { df: "TRANG_THAI", c: "Trạng thái", lds: dsTrangThaiK, lve: "ID", lde: "TEN" },
    { df: "NGAY_TAO", c: "Ngày tạo", dt: 'date', f: 'dd/MM/y', fv: false },
]
const isReady = ref(false);
const toolbarItem = ref([]);

const { addToolbarButton } = useToolbarButton(toolbarItem);
const AccessRights = reactive({
    New: false,
    Edit: false,
    Delete: false,
    Khoa: false,
    MoKhoa: false,
    Reset: false,
    VAI_TRO: 1,
    Title: ""
});
onBeforeMount(async () => {
    const check = await checkAccess("HeThong/HT_NGUOIDUNG/Access");
    if (check) {
        AccessRights.New = check.New;
        AccessRights.Edit = check.Edit;
        AccessRights.Delete = check.Delete;
        AccessRights.Title = check.Title;
        AccessRights.Khoa = check.Khoa;
        AccessRights.MoKhoa = check.MoKhoa;
        AccessRights.Reset = check.Reset;
        AccessRights.VAI_TRO = check.VAI_TRO;
    }
    if (AccessRights.Khoa) {
        addToolbarButton({
            text: "Khóa", icon: "clear", type: "danger",
            onClick: () => {
                alert("Đã khóa");
            }
        })
    }
    if (AccessRights.MoKhoa) {
        addToolbarButton({
            text: "Mở khóa", icon: "check", type: "default",
            onClick: () => {
                alert("Đã mở khóa");
            }
        })
    }
    isReady.value = true;
});
//
watch(isReady, (ready) => {
    if (ready) {
        nextTick(() => {
            const instance = gridRef.value?.instance
            if (instance) {
                instance.option('onInitNewRow', (e) => {
                    childRef.value = true;
                    e.data.TRANG_THAI = 2;
                    e.data.TFA = false;
                    e.data.DVQL_ID = user.value.DVQL_ID;
                    e.component.columnOption("MAT_KHAU", "formItem", { visible: true });
                });
                instance.option('onEditingStart', (e) => {
                    e.component.columnOption("MAT_KHAU", "formItem", { visible: false });
                });
                instance.option('onEditorPreparing', (e) => {
                    if (e.parentType == 'dataRow' && e.dataField == "TEN_DANG_NHAP") {
                        var standardHandler = e.editorOptions.onValueChanged;
                        e.editorOptions.onValueChanged = function (args) {
                            var v = convertToKey(args.value);
                            args.component.option('value', v);
                            args.value = v;
                            standardHandler(args);
                        }
                    }
                });
                instance.option('editing.popup.width', function () { return window.innerWidth > 1000 ? 1000 : window.innerWidth * 0.9; })
            } else {
                console.warn('⚠️ Grid instance vẫn chưa có sau isReady')
            }
        })

    }
})
const closePopup = () => {
    showPopup.value = false;
}
</script>