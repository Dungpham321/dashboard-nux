<template>
    <div v-if="isReady">
        <BaseDataGrid :grid-key="gridkey" :data-source="dataSource.data" :key-expr="'ID'" :cols="Columns"
            :url="'DanhMuc/DM_DANHMUC_ITEM'" :Title="AccessRights.Title" :New="AccessRights.New"
            :Edit="AccessRights.Edit" :Delete="AccessRights.Delete" />
    </div>
</template>
<script setup>
definePageMeta({
    layout: "default",
    middleware: ['auth']
});
import { ref, onMounted, onBeforeMount, nextTick, watch, createApp } from 'vue'
import { useRoute } from 'vue-router'
import { DataSource, DataSourceP, CheckEmpty } from '@/composables/GlobalService';
import BaseDataGrid from '@/components/devextreme/BaseDataGrid.vue';
import TemplateND from '~/components/devextreme/TemplateND.vue';
import EditTemplateND from '~/components/devextreme/EditTemplateND.vue';
import { dsChucNang, dsDoiTuong } from '~/components/enums/ThongBao';
import OpsGridDropdownTree from '~/components/devextreme/OpsGridDropdownTree.vue';

const AccessRights = reactive({
    New: false,
    Edit: false,
    Delete: false,
    Title: "",
    PhanQuyen: null,
    danhmuc: {},
    Cols: null,
    DmTree: null
});
const route = useRoute();
const ma = ref(route.params.ma);
const isReady = ref(false);
const gridkey = ref('danhmucitem');
const baseGridRef = useState('gridRef-' + gridkey.value);
const Columns = [];
onBeforeMount(async () => {
    const check = await checkAccess("DanhMuc/DM_DANHMUC_ITEM/Access", { MA_DANHMUC: ma.value });
    if (check) {
        AccessRights.New = check.New;
        AccessRights.Edit = check.Edit;
        AccessRights.Delete = check.Delete;
        AccessRights.Title = check.Title;
        AccessRights.danhmuc = check.danhmuc;
        AccessRights.PhanQuyen = check.PhanQuyen;
        AccessRights.Cols = check.Cols;
        AccessRights.DmTree = check.DmTree;
    }
    isReady.value = true;
    if (!AccessRights.danhmuc.IDTUTANG) {
        Columns.push({ df: "MA", c: "Mã", w: 150, vi: 1, fvi: 1, rq: true });
    }
    Columns.push({ df: 'TEN', c: "Tên", rq: true, vi: 2, fvi: 2 });
    Columns.push({ df: "MO_TA", c: "Mô tả", v: true, vi: 3, fvi: 3 });
    if (AccessRights.danhmuc.PID) {
        Columns.push({
            df: "PID", c: 'Cấp cha', vi: 4, fvi: 4, v: AccessRights.danhmuc.PID != AccessRights.danhmuc.ID, fv: true, lds: dataMainP.data,
            ops: {
                editCellTemplate: OpsGridDropdownTree
            },
            vr: [
                {
                    type: "async", message: "Cấp cha không phù hợp", ignoreEmptyValue: true,
                    validationCallback: function (o) {
                        var d = $.Deferred();
                        if (o.data.id == null || o.value == 0) {//them mới
                            d.resolve(true);
                        } else if (o.value == o.data.id) {//chọn cùng id
                            d.resolve(false);
                        } else {
                            d.resolve(true);
                        }
                        return d.promise();
                    },
                }
            ]
        });
    }
    let ttDs = [];
    let stt = 5;
    if (!AccessRights.danhmuc.CODUYET) {
        ttDs = [
            { ID: 3, TEN: 'Không sử dụng' },
            { ID: 2, TEN: 'Sử dụng' },
        ];
    } else {
        ttDs = [
            { ID: 1, TEN: 'Chờ duyệt' },
            { ID: 2, TEN: 'Đã duyệt' },
            { ID: 3, TEN: 'Không duyệt' },
        ];
    }
    Columns.push({ df: "SAP_XEP", c: "Vị trí", v: ma.value != 'canbo', vi: 90, fvi: 90, rq: true, w: 80, dt: "number", });
    if (ma.value == 'canbo' && ttDs.length > 0) {
        ttDs = [
            { ID: 2, TEN: 'Đang công tác' },
            { ID: 3, TEN: 'Nghỉ việc' },
        ];
    }
    Columns.push({ df: "TRANG_THAI", c: "Trạng thái", vi: 100, fvi: 100, fv: AccessRights.danhmuc.CODUYET ? false : true, lds: ttDs, w: 110 });
    if (AccessRights.danhmuc.ID == dsChucNang.nhomquyen && AccessRights.PhanQuyen) {
        Columns.push({
            c: "Phân quyền", w: 110, af: false, as: false, fv: false, vi: 110, fvi: 110, ops: {
                type: 'buttons',
                name: 'btnPhanQuyen',
                buttons: [
                    {
                        text: "Phân quyền",
                        icon: "detailslayout",
                        name: "config",
                        onClick(e) {
                            if (e.row) navigateTo("/hethong/phanquyen/" + e.row.data.ID);
                        }
                    }
                ]
            }
        });
    }
    if (AccessRights.danhmuc.ID == dsChucNang.donvi || AccessRights.danhmuc.ID == dsChucNang.nhomquyen) {
        Columns.push({
            df: "NGUOIDUNG_ID", c: "Người dùng", cp: 2, w: 130, af: false, as: false, vi: 120, fvi: 120, ops: {
                cellTemplate: async (container, cellInfo) => {
                    // if (childRef.value.editMode === "") {
                    const app = createApp(TemplateND, {
                        nguoidungid: 0, doituongid: cellInfo.data.ID, chucnang: AccessRights.danhmuc.ID, doituongloai: dsDoiTuong.DM_DANHMUC, multiple: true, required: false, icon: true,
                        callback: function (e) {
                            const instance = baseGridRef.value?.instance
                            instance.refresh();
                        }
                    });
                    app.mount(container);
                    // }
                },
                editCellTemplate: (container, cellInfo) => {
                    if (cellInfo.cellElement == null) {

                        const app = createApp(EditTemplateND, {
                            nguoidungid: 0,
                            doituongid: typeof cellInfo.data.ID != "undefined" ? cellInfo.data.ID : - 1,
                            chucnang: AccessRights.danhmuc.ID,
                            doituongloai: dsDoiTuong.DM_DANHMUC,
                            multiple: true,
                            required: false,
                            icon: true,
                            modelValue: cellInfo.value,
                            'onUpdate:modelValue': (val) => {
                                cellInfo.setValue(val)
                            }
                        });
                        app.mount(container);
                    }
                }
            }
        })
    }
    if (!AccessRights.danhmuc.CHIEURONG) baseGridRef.value?.instance.option('editing.popup.width', function () { return window.innerWidth > AccessRights.danhmuc.CHIEURONG ? AccessRights.danhmuc.CHIEURONG : window.innerWidth * 0.9; });
    ///cấu hình
    let lstBoolean = {}
    AccessRights.Cols.forEach((c) => {
        let cc = Columns.find(f => f.df == c.MA);
        let themmoi = false;
        if (!cc) {
            cc = { df: c.MA };
            themmoi = true;
        }
        cc.c = c.TEN;
        if (c.SAP_XEP != null && c.SAP_XEP != 0) {
            cc.vi = c.SAP_XEP;
            cc.fvi = c.SAP_XEP;
            stt = c.SAP_XEP;
        } else {
            cc.vi = stt;
            cc.fvi = stt;
        }
        stt++;
        if (c.CHIEURONG != null) cc.w = c.CHIEURONG;
        if (c.KIEUDULIEU == 'file') {
            // cc.ct = function (container, options) {
            //     GlobalService.templateFile(container, { doituongid: options.data.ID, chucnang: dataAcess.danhmuc.ID + '_' + c.MA.toLowerCase(), doituongloai: 'DM_DANHMUC_ITEM', soluong: 5, delete: true, fileExt: CheckEmpty(c.MACDINH) ? '.doc,.docx,.xls,.xlsx,.pdf' : c.MACDINH, icon: true, multiple: true });
            // };
            // cc.ect = function (cellElement, cellInfo) {
            //     if (cellInfo.cellElement == null) {
            //         GlobalService.templateEditFile(cellElement, { doituongid: typeof cellInfo.data.ID === "undefined" ? 0 : cellInfo.data.ID, chucnang: dataAcess.danhmuc.ID + '_' + c.MA.toLowerCase(), doituongloai: 'DM_DANHMUC_ITEM', soluong: 5, fileExt: CheckEmpty(c.MACDINH) ? '.doc,.docx,.xls,.xlsx,.pdf' : c.MACDINH, icon: true, multiple: true });
            //     }
            // };
        } else if (c.KIEUDULIEU == 'danhmuc') {
            // cc.ct = function (container, options) {
            //     GlobalService.templateDM(container, { danhmucid: c.DM_ID, doituongid: options.data.ID, chucnang: dataAcess.danhmuc.ID + '_' + c.MA.toLowerCase(), doituongloai: 'DM_DANHMUC_ITEM', multiple: true, required: false, icon: true });
            // };
            // cc.ect = function (cellElement, cellInfo) {
            //     if (cellInfo.cellElement == null) {
            //         GlobalService.templateEditDM(cellElement, { danhmucid: c.DM_ID, doituongid: typeof cellInfo.data.ID === "undefined" ? 0 : cellInfo.data.ID, chucnang: dataAcess.danhmuc.ID + '_' + c.MA.toLowerCase(), doituongloai: 'DM_DANHMUC_ITEM', multiple: true, required: false, icon: true });
            //     }
            // };
        } else {
            if (c.KIEUDULIEU != null) cc.dt = c.KIEUDULIEU;
            if (c.KIEUDULIEU == 'number') {
                if (c.THAPPHAN == null) c.THAPPHAN = '-1';
                var fm = c.THAPPHAN == '-1' ? '###0' : (c.THAPPHAN == "0" ? '#,##0' : '#,##0.' + ('').padStart(c.THAPPHAN, '0'));
                cc.ops = { editorOptions: { format: fm, step: 0, locale: "vi", } };
                cc.f = fm;
                if (!CheckEmpty(c.TOITHIEU)) cc.edmin = c.TOITHIEU;
                if (!CheckEmpty(c.TOIDA)) cc.edmax = c.TOIDA;
            } else if (c.KIEUDULIEU == 'string') {
                cc.ops = { editorOptions: {} };
                if (!CheckEmpty(c.TOITHIEU)) cc.ops.editorOptions.maxLength = c.TOITHIEU;
                if (!CheckEmpty(c.TOIDA)) cc.ops.editorOptions.minLength = c.TOIDA;
            } else if (c.KIEUDULIEU == 'date' || c.KIEUDULIEU == 'datetime') {
                cc.ef = 'dd/MM/y';
                cc.f = 'dd/MM/y';
                cc.eumb = true;
            }

            if (!CheckEmpty(c.DM_ID)) {
                const dtDanhMuc = DataSourceP("DanhMuc/DM_DANHMUC_ITEM/List", ['ID'], ["TEN", "PID"], ["SAP_XEP"], {
                    ulo: function () { return { DANHMUC_ID: c.DM_ID } }
                });
                cc.lds = dtDanhMuc.data;
                if (AccessRights.DmTree.find(f => f.ID == c.DM_ID)) {
                    cc.ops = {
                        editCellTemplate: OpsGridDropdownTree
                    }
                }
            }

            if (!CheckEmpty(c.TUDIEN_ID)) {
                const dtTuDien = DataSourceP("DanhMuc/DM_TUDIEN_ITEM/List", ['MA'], ["TEN"], ["SAP_XEP"], {
                    ulo: function () { return { TUDIEN_ID: c.TUDIEN_ID } }
                });
                cc.lds = dtTuDien.data;
                cc.lve = function (item) { return item && parseInt(item.MA); };
            }
        }

        if (c.HIENTHI != null) {
            cc.v = c.HIENTHI;
            cc.fv = true;
        }
        if (c.CODINH) cc.fx = c.CODINH;
        if (c.BATBUOC != null) cc.rq = c.BATBUOC;
        if (c.COLSPAN) cc.cp = c.COLSPAN;
        if (c.CHECKTRUNG) {
            if (typeof cc.vr === 'undefined') cc.vr = [];
            // cc.vr.push(GlobalService.validationRulesCheck("DanhMuc/DM_DANHMUC_ITEM/Check", $scope.mainGrid, '', cc.c + ' đã tồn tại', function (e, checkData) {
            //     checkData.DANHMUC_ID = dataAcess.danhmuc.ID;
            //     checkData.Field = cc.df;
            // }));
        }
        if (themmoi) Columns.push(cc);
        if (cc.df.indexOf('CB') == 0) {
            lstBoolean[cc.df] = false;
        }
        if (c.KIEUDULIEU == 'file' || c.KIEUDULIEU == 'danhmuc') {
            cc.rq = false;
        }
    });

});
const dataSource = DataSource("DanhMuc/DM_DANHMUC_ITEM", ['ID'], ["MA", "TEN", "MO_TA", "CC1", "CC2", "CC3", "CC4", "CC5", "CT1", "CT2", "CT3", "CT4", "CT5", "PID", "TRANG_THAI", "HASCHILD", "SAP_XEP",
    "CB1", "CB2", "CB3", "CB4", "CB5", "CD1", "CD2", "CD3", "CD4", "CD5", "DATA"
], ["PID", "SAP_XEP"], {
    ulo: function () {
        return { DANHMUC_ID: AccessRights.danhmuc.ID }
    },
    bi: function (values) {
        values.DANHMUC_ID = AccessRights.danhmuc.ID;
    }
});
const dataMainP = DataSourceP("DanhMuc/DM_DANHMUC_ITEM/List", ["ID"], ["MA", "TEN", "PID"], ["PID", "SAP_XEP"], {
    ulo: function () {
        return { DANHMUC_ID: AccessRights.danhmuc.PID };
    },
    ca: false,
});
watch(isReady, (ready) => {
    if (ready) {
        nextTick(() => {
            const instance = baseGridRef.value?.instance
            if (instance) {
                // console.log(AccessRights);
            } else {
                console.warn('⚠️ Grid instance vẫn chưa có sau isReady')
            }
        })

    }
})
</script>