export function hideGridHeader(gridRef: any) {
  const gridInstance = gridRef.instance;
  if (!gridInstance) return;
  gridInstance.option("groupPanel.visible", false);
  gridInstance.option("filterRow.visible", false);
  gridInstance.option("filterPanel.visible", false); // tùy bạn
  gridInstance.option("headerFilter.visible", false);
  gridInstance.option("searchPanel.visible", false);
  gridInstance.option("export.enabled", false);
  gridInstance.option("onToolbarPreparing", (e: any) => {
    e.toolbarOptions.items = [];
  });
}
export function convertToKey(str: string): string {
  return str?.trim().toLowerCase().replace(/\s+/g, "_") ?? "";
}

import { varVaiTro } from "../enums/ThongBao";
// Kiểu dữ liệu cho props
interface CellTemplateOptions {
  chucnang: number;
  doituongloai: string;
  doituongid?: string;
  td?: string;
  icon?: boolean;
  multiple?: boolean;
  mode?: String;
  required?: boolean;
  VaiTro?: Number;
  onClick?: (cellInfo: any) => void;
  popupmode: string
}
interface UserInfo {
  TEN_DANG_NHAP: string;
}

export function TemplateND(options: CellTemplateOptions) {
  const user = useCookie<UserInfo>("user");
  return async (container: HTMLElement, cellInfo: any): Promise<void> => {
  
    const {
      chucnang,
      doituongloai,
      doituongid = "",
      td = "Nhóm quyền",
      icon = false,
      multiple = true,
      required = false,
      VaiTro,
      onClick,
      popupmode
    } = options;
      console.log(popupmode)
    const nguoidungid = cellInfo.key;
    const isEditable =
      user.value.TEN_DANG_NHAP !== cellInfo.data.TEN_DANG_NHAP ||
      VaiTro === varVaiTro.quantrihethong;
    const mode = isEditable ? "" : "view";
    const cacheKey = `${chucnang}_${doituongloai}_${nguoidungid}`;
    let dsdm = "";
    if (!dsdm) {
      
      const endpoint = doituongid ? "List" : "ListAccess";
      const response: any = await GetData(
        `HeThong/HT_NGUOIDUNG_SD/${endpoint}`,
        {
          NGUOIDUNG_ID: nguoidungid,
          DOITUONG_ID: doituongid,
          CHUCNANG: chucnang,
          DOITUONG_LOAI: doituongloai,
        }
      );
      const ds = response.Data.filter((c: any) => c.CHON);
      dsdm = !icon
        ? ds.length > 0
          ? ds
              .map((item: any) =>
                doituongid ? item.TEN_DANG_NHAP : item.TEN_DOI_TUONG
              )
              .join(", ")
          : (doituongid
              ? '<i class="fa fa-user"></i>'
              : '<i class="fa fa-list-alt"></i>') +
            " " +
            td
        : `${td} (${ds.length})`;
    }
    container.innerHTML = `<a href="#" class="div-lik text-blue-600 hover:text-rose-300 dark:hover:text-amber-400">${
      dsdm ?? ""
    }</a>`;
    container.querySelector("a")?.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick(cellInfo);
      }
    });
  };
}

export function EditTemplateND(options: CellTemplateOptions) {
  const user = useCookie<UserInfo>("user");
  return async (container: HTMLElement, cellInfo: any): Promise<void> => {
    const {
      chucnang,
      doituongloai,
      doituongid = "",
      td = "Nhóm quyền",
      icon = false,
      multiple = true,
      required = false,
      VaiTro,
      onClick,
    } = options;
    const nguoidungid = cellInfo.key;
    const isEditable =
      user.value.TEN_DANG_NHAP !== cellInfo.data.TEN_DANG_NHAP ||
      VaiTro === varVaiTro.quantrihethong;
    const mode = isEditable ? "" : "view";
    const cacheKey = `${chucnang}_${doituongloai}_${nguoidungid}`;
    let className = "";
    let dsdm = "";
    const getDefaultIcon = () =>
      doituongid === ""
        ? '<i class="fa fa-list-alt"></i> Lựa chọn'
        : '<i class="fa fa-user"></i> Lựa chọn';
    if (!dsdm) {
      const endpoint = doituongid ? "List" : "ListAccess";
      const response: any = await GetData(
        `HeThong/HT_NGUOIDUNG_SD/${endpoint}`,
        {
          NGUOIDUNG_ID: nguoidungid,
          DOITUONG_ID: doituongid,
          CHUCNANG: chucnang,
          DOITUONG_LOAI: doituongloai,
        }
      );
      const ds = response.Data.filter((c: any) => c.CHON);
      dsdm = !icon? ds.length > 0? ds.map((item: any) => doituongid ? item.TEN_DANG_NHAP : item.TEN_DOI_TUONG).join(", "): getDefaultIcon(): `${td} (${ds.length})`;
      className = ds.length === 0? "div-lik div-lik-donvi" : "div-lik text-blue-600 hover:text-rose-300 dark:hover:text-amber-400";
    }
    container.innerHTML = `<a href="#" class="${className}"> ${dsdm ?? ""}</a>`;
    container.querySelector("a")?.addEventListener("click", (e: MouseEvent) => {
      e.preventDefault();
      if (onClick) {
        onClick(cellInfo);
      }
    });
  };
}
