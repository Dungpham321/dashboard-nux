export const colMap: Record<string, any> = {
  df: "dataField",
  cp: "colSpan",
  it: "itemType",
  a: "alignment",
  ha: "horizontalAlignment",
  lt: "label.text",
  bt: "buttonOptions.text",
  bty: "buttonOptions.type",
  bw: "buttonOptions.width",
  bo: "buttonOptions.onClick",
  bi: "buttonOptions.icon",
  bus: "buttonOptions.useSubmitBehavior",
  et: "editorType",
  edmo: "editorOptions.mode",
  ed: "editorOptions.dataSource",
  edgp: "editorOptions.grouped",
  edve: "editorOptions.valueExpr",
  edde: "editorOptions.displayExpr",
  eddi: "editorOptions.disabled",
  edre: "editorOptions.readOnly",
  edv: "editorOptions.value",
  edw: "editorOptions.width",
  edh: "editorOptions.height",
  edm: "editorOptions.mask",
  edmc: "editorOptions.maskChar",
  edmr: "editorOptions.maskRules",
  eddf: "editorOptions.displayFormat",
  edf: "editorOptions.format",
  edsc: "editorOptions.showClearButton",
  edse: "editorOptions.searchEnabled",
  edofi: "editorOptions.onFocusIn",
  edofo: "editorOptions.onFocusOut",
  edoin: "editorOptions.onInitialized",
  edoct: "editorOptions.onContentReady",
  edotb: "editorOptions.toolbar",
  edoea: "editorOptions.elementAttr",
  edoia: "editorOptions.inputAttr",
  edoss: "editorOptions.showSelectionControls",
  edt: "editorOptions.type",
  edos: "editorOptions.onSelectionChanged",
  edov: "editorOptions.onValueChanged",
  edokd: "editorOptions.onKeyDown",
  edph: "editorOptions.placeholder",
  edla: "editorOptions.layout",
  edmin: "editorOptions.min",
  edmax: "editorOptions.max",
  eddsf: "editorOptions.dateSerializationFormat",
  edml: "editorOptions.maxLength",
  eddrow: "editorOptions.dropDownOptions.width",
  c: "caption",
  v: "visible",
  vi: "visibleIndex",
  cc: "colCount",
  t: "template",
  vr: "validationRules",
  cl: "cssClass",
  n: "name",
  its: "items",
  ht: "helpText",
  ct: "captionTemplate",
};

import { h, render, createApp } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

export function buildFormItem(
  config: Record<string, any>
): Record<string, any> {
  const item: Record<string, any> = {};
  // Nếu là group thì xử lý riêng
  if (config.it === "group") {
    item.itemType = "group";
    item.caption = config.c || "";
    item.colCount = config.cc || 2;
    item.items = (config.its || []).map(buildFormItem);
    return item;
  }
  // Ánh xạ các key ngắn sang cấu trúc đầy đủ
  Object.entries(config).forEach(([key, value]) => {
    const path = colMap[key];
    if (!path) return;
    const keys = path.split(".");
    let current = item;
    keys.forEach((k: any, index: any) => {
      if (index === keys.length - 1) {
        current[k] = value;
      } else {
        if (!current[k]) current[k] = {};
        current = current[k];
      }
    });
  });
  // Rule required
  if (config.rq && config.lt) {
    item.validationRules = item.validationRules || [];
    item.validationRules.push({
      type: "required",
      message: `${config.lt} là thông tin bắt buộc`,
    });
  }
  // Template tùy chỉnh
  if (typeof config.t === "function" || typeof config.t === "object") {
    // item.template = (data: any, container: HTMLElement) => {
    //   const vnode = h(config.t, {
    //     ops: config.tProps || {}, // props tùy chỉnh
    //     itemInfo: config,
    //     value: data.component.option("formData")[config.df],
    //     "onUpdate:value": (val: any) => {
    //       data.component.option("formData")[config.df] = val;
    //     },
    //   });
    //   render(vnode, container);
    // };
    item.template = (data: any, container: HTMLElement) => {
      const vnode = h(config.t, {
        ops: config.tProps || {},
        itemInfo: config,
        value: data.component.option("formData")[config.df],
        "onUpdate:value": (val: any) => {
          data.component.option("formData")[config.df] = val;
        },
      });
      const app = createApp({ render: () => vnode });
      app.component("font-awesome-icon", FontAwesomeIcon);
      app.mount(container);
    };
  }

  return item;
}

export function createFormOptions(
  overrides: Partial<any> = {}
): Record<string, any> {
  const baseOptions = {
    colCount: 2,
    readOnly: false,
    showColonAfterLabel: true,
    showValidationSummary: true,
    minColWidth: 200,
    validationGroup: "mainGroup",
    labelLocation: "top",
    scrollingEnabled: true,
    showRequiredMark: true,
    showOptionalMark: false,
    onInitialized(e: any) {
      e.component.__formInstance = e.component;
    },
    onContentReady(e: any) {
      // xử lý sau khi render nếu cần
    },
  };

  return {
    ...baseOptions,
    ...overrides,
  };
}
