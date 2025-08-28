import CustomStore from "devextreme/data/custom_store";
import notify from "devextreme/ui/notify";
import { ThongBao, TypeToast } from "~/components/enums/ThongBao";
export async function login(url: string, formdata: object) {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiBase;
  try {
    const response = await $fetch(apiUrl + url, {
      method: "POST",
      body: formdata,
    });
    return { Data: structuredClone(response) };
  } catch (error) {
    console.error("Login error:", error);
    return { Data: null, Error: error };
  }
}
export async function GetData(url: string, params: object | null = null) {
  const router = useRoute().fullPath;
  Object.assign(params ?? {}, { url: router.replace(/^\/+/, '') });
  const config = useRuntimeConfig();
  const token = useCookie("token");
  const apiUrl = config.public.apiBase;
  try {
    const response = await $fetch<RequestResult>(apiUrl + url, {
      method: "GET",
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : "",
        "Content-Type": "application/json",
      },
      query: params || {}, // truyền params nếu có
    });
    return response;
  } catch (error: any) {
    if (error?.status === 401) {
      navigateTo("/dangnhap");
      return;
    }
    throw error;
  }
}
export async function PostData(url: string, data: object | null) {
  const config = useRuntimeConfig();
  const token = useCookie("token");
  const apiUrl = config.public.apiBase;
  try {
    const response = await $fetch(apiUrl + url, {
      method: "POST",
      body: data,
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : "",
        "Content-Type": "application/json",
      },
      responseType: "json",
    });
    return response;
  } catch (error: any) {
    if (error?.status === 401) {
      navigateTo("/dangnhap");
    }
    throw error;
  }
}
export async function PutData(url: string, data: object | null) {
  const config = useRuntimeConfig();
  const token = useCookie("token");
  const apiUrl = config.public.apiBase;
  try {
    const response = await $fetch(apiUrl + url, {
      method: "PUT",
      body: data,
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : "",
      },
    });

    return response;
  } catch (error: any) {
    if (error?.status === 401) {
      navigateTo("/dangnhap");
    }
    throw error;
  }
}

export function useToast() {
  function showToast(
    message: string,
    type: string = "info",
    time: number = 3500,
    position: "top right" | "top center" = "top right",
    direction: "up-push" | "down-push" = "up-push"
  ) {
    notify(
      {
        message,
        height: 50,
        width: 250,
        type,
        displayTime: time,
        animation: {
          show: { type: "fade", duration: 400, from: 0, to: 1 },
          hide: { type: "fade", duration: 40, to: 0 },
        },
      },
      { position, direction }
    );
  }
  return { showToast };
}
//dataSoure
interface LoadOptions {
  fields: string;
  keys: string;
  defaultSort: string;
  sort?: string;
  filter?: string;
  skip: number;
  take: number;
  dataField: string;
  searchOperation?: string;
  searchValue?: string;
  requireTotalCount: boolean;
}
interface LoadOptionsP {
  fields: string;
  keys: string;
  defaultSort: string;
  requireTotalCount: boolean;
}
interface RequestResult {
  Data: ResultData | any;
}
interface ApiResponse<T = any> {
  status: number;
  data?: {
    Msg?: string;
    State?: number;
    [key: string]: any;
  };
}
interface ResultData {
  items: any;
  totalCount: number;
}
export async function OnLoad(
  loadOptions: any,
  url: string,
  fields: any,
  keys: any,
  defaultSort: any,
  exParamerter: any
) {
  let parameters = {
    fields: JSON.stringify(fields),
    keys: JSON.stringify(keys),
    defaultSort: JSON.stringify(defaultSort),
    sort: loadOptions.sort ? JSON.stringify(loadOptions.sort) : [],
    filter: loadOptions.filter ? JSON.stringify(loadOptions.filter) : [],
    skip: loadOptions.skip,
    take: loadOptions.take,
    dataField: loadOptions.dataField,
    searchOperation: loadOptions.searchOperation? loadOptions.searchOperation: null,
    searchValue: loadOptions.searchValue ? loadOptions.searchValue : null,
    requireTotalCount: loadOptions.requireTotalCount || true,
  } as LoadOptions;
  Object.assign(parameters, exParamerter || {});
  const result = await GetData(url, parameters);
  return result
    ? {
        data: result["Data"]["items"],
        totalCount: result["Data"]["totalCount"],
      }
    : result;
}
export async function OnLoadP(
  loadOptions: any,
  url: string,
  fields: any,
  keys: any,
  defaultSort: any,
  exParamerter: any
) {
  var parameters = {
    fields: JSON.stringify(fields),
    keys: JSON.stringify(keys),
    defaultSort: JSON.stringify(defaultSort),
    requireTotalCount: false,
  } as LoadOptionsP;
  Object.assign(parameters, exParamerter || {});
  const result: RequestResult | undefined = await GetData(url, parameters);
  return result ? result["Data"]["items"] : result;
}
export function DataSource(u: any, k: any, f: any, s: any, exOps = {}) {
  //url, key, field, sort, ex ops
  let op = {
    ul: "/List",
    ulo: function () {
      return null;
    },
    bl: function () {},
    al: function (response: any) {},
    uu: "",
    uuo: function () {
      return null;
    },
    bu: function (key: any, values: any) {},
    au: function (response: any) {},
    ui: "/Create",
    uio: function () {
      return null;
    },
    bi: function (values: any) {},
    ai: function (response: any) {},
    ca: true,
    bk: undefined,
    err: function (error: any) {},
  };
  op = Object.assign(op, exOps);
  const data = { items: [], data: {} };
  data.data = new CustomStore({
    key: k.length == 1 ? k[0] : k,
    async load(loadOptions) {
      op.bl();
      let result = await OnLoad(loadOptions, u + op.ul, f, k, s, op.ulo());
      if (result) data.items = result["data"];
      else throw "Lỗi tải dữ liệu";
      op.al(result);
      return result;
    },
    async update(key, values) {
      var key_url = key;
      if (typeof key === "object") {
        key_url = "";
        Object.keys(key).map(function (oKey) {
          key_url += (key_url != "" ? "/" : "") + encodeURIComponent(key[oKey]);
        });
      } else {
        key_url = encodeURIComponent(key_url);
      }
      op.bu(key, values);
      let result: any = await PutData(u + op.uu + "/" + key_url, values);
      return result;
    },
    async insert(values) {
      op.bi(values);
      let result: any = await PostData(u + op.ui, values);
      // if (result.status == 200) {
        op.ai(result);
        return result;
      // }
    },
    byKey: op.bk,
    cacheRawData: op.ca,
    errorHandler: (error: any) => {
      op.err(error);
    },
  });
  return data;
}
export function DataSourceP(u: any, k: any, f: any, s: any, exOps = {}) {
  //url, key, field, sort, ex ops
  let op = {
    ulo: function () {
      return null;
    },
    bl: function () {},
    al: function (response: any) {},
    lm: "raw",
    ca: true,
    bk: undefined,
  };
  op = Object.assign(op, exOps);
  const data = { items: [], data: {} };
  data.data = new CustomStore({
    key: k.length == 1 ? k[0] : k,
    loadMode: "raw",
    async load(loadOptions) {
      op.bl();
      let result = await OnLoadP(loadOptions, u, f, k, s, op.ulo());
      if (result) data.items = result["data"];
      else throw "Lỗi tải dữ liệu";
      op.al(result);
      return result;
    },
    byKey: op.bk,
    cacheRawData: op.ca,
  });
  return data;
}
export async function checkAccess(url: any, params: object | null = null){
  const router = useRoute().fullPath;
 params =  Object.assign(params ?? {}, { url: router });
  const result: any = await GetData(url, params);
  const data = result.Data;
  if(data.View){
    return data;
  }else{
    return navigateTo("/401");
  }

}


interface ToolbarButtonOptions {
  text: string;
  icon: string;
  type: 'default' | 'danger' | 'success' | 'normal';
  hint: string;
  onClick?: () => void;
}

export function useToolbarButton(toolbarItem: any) {
  function addToolbarButton({ text , icon, type, hint, onClick }: ToolbarButtonOptions) {
    toolbarItem.value.push({
      location: 'after',
      widget: 'dxButton',
      locateInMenu: 'auto',
      options: {
        text,
        icon,
        type,
        hint,
        visible: true,
        onClick: onClick || (() => navigateTo("/hethong/menu"))
      }
    });
  }

  return { addToolbarButton };
}