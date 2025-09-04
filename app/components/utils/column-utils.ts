export const colMap: Record<string, any> = {
  df: "dataField",
  c: "caption",
  ml: "editorOptions.maxLength",
  ficc: "formItem.cssClass",
  cp: "formItem.colSpan",
  dt: "dataType",
  f: "format",
  v: "visible",
  vi: "visibleIndex",
  fv: "formItem.visible",
  w: "width",
  ft: "falseText",
  tt: "trueText",
  af: "allowFiltering",
  as: "allowSorting",
  d: "editorOptions.disabled",
  ro: "editorOptions.readOnly",
  edmin: "editorOptions.min",
  edmax: "editorOptions.max",
  n: "name",
  fn: "formItem.name",
  en: "editorOptions.name",
  cc: "cssClass",
  a: "alignment",
  ae: "allowEditing",
  gi: "groupIndex",
  ef: "editorOptions.format",
  edf: "editorOptions.displayFormat",
  eumb: "editorOptions.useMaskBehavior",
  eov: "editorOptions.value",
  fx: "fixed",
  fxp: "fixedPosition",
  ect: "editCellTemplate",
  ct: "cellTemplate",
  edph: "editorOptions.placeholder",
  edsc: "editorOptions.showClearButton",
  scv: "setCellValue",
  ccc: "calculateCellValue",
  si: "sortIndex",
  so: "sortOrder",
  scc: "showInColumnChooser",
  vr: "validationRules",
  cl: "columns",
  fvi: "formItem.visibleIndex",
  edm: "editorOptions.mask",
  edmc: "editorOptions.maskChar",
  edmr: "editorOptions.maskRules",
  mw: "minWidth",
  edtm: "editorOptions.mode",
};

export const setValueToObject = (
  obj: Record<string, any>,
  value: any,
  path: string
): void => {
  if (!path) return;
  const keys: string[] = path.split(".").filter(Boolean); // loại bỏ key rỗng
  if (keys.length === 0) return;
  let current: Record<string, any> = obj;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (typeof key === "undefined") continue;
    if (
      !(key in current) ||
      typeof current[key] !== "object" ||
      current[key] === null
    ) {
      current[key] = {};
    }
    current = current[key];
  }
  const lastKey = keys[keys.length - 1];
  if (typeof lastKey === "string") {
    current[lastKey] = value;
  }
};

export const lookUpDisplay = (item: any, title: any) => {
  if (typeof title === "function") {
    return title(item);
  } else if (Array.isArray(title)) {
    return title
      .map((v) => item[v])
      .filter(Boolean)
      .join(" - ");
  } else {
    return item?.[title];
  }
};
import { createApp, h, defineComponent, type Component } from "vue";
export const buildColumn = (c: any, op: any = {}) => {
  const col: Record<string, any> = { formItem: {}, editorOptions: {} };
  Object.keys(colMap).forEach((k) => {
    if (c[k] != null) setValueToObject(col, c[k], colMap[k]);
  });
  if (!col.validationRules) col.validationRules = [];
  if (c.lds) {
    col.lookup = {
      dataSource: c.lds,
      valueExpr: c.lve ?? "ID",
      displayExpr: (item: any) => item && lookUpDisplay(item, c.lde ?? "TEN"),
    };
    col.editorOptions.showClearButton = true;
  }
  if (op.editorOptions) {
    Object.assign(col.editorOptions, op.editorOptions);
    delete op.editorOptions;
  }
  if (op.formItem) {
    Object.assign(col.formItem, op.formItem);
    delete op.formItem;
  }
  if (op.editCellTemplate && typeof op.editCellTemplate === "object") {
    const component = op.editCellTemplate;
    col.editCellTemplate = (cellElement: HTMLElement, cellInfo: any) => {
      if (cellInfo.rowType !== 'data') return;
      const Wrapper = {
        render() {
          return h(component, { data: cellInfo });
        },
      };
      createApp(Wrapper).mount(cellElement);
    };
    delete op.editCellTemplate;
  }
  if (typeof op.cellTemplate === "function") {
    col.cellTemplate = op.cellTemplate;
  }

  // if (op.cellRender && typeof op.cellRender === "object") {
  //   const component = op.cellRender as Component;
  //   col.cellRender = (cellInfo: any, container: HTMLElement) => {
  //     const Wrapper = defineComponent({
  //       render() {
  //         return h(component, { value: cellInfo.value });
  //       },
  //     });
  //     createApp(Wrapper).mount(container);
  //   };
  //   delete op.cellRender;
  // }

  Object.assign(col, op);
  if (c.rq) col.validationRules.push({ type: "required" });
  return col;
};
