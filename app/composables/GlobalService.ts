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
  const config = useRuntimeConfig();
  const token = useCookie("token");
  const apiUrl = config.public.apiBase;
  try {
    const response = await $fetch(apiUrl + url, {
      method: "GET",
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : "",
      },
      query: params || {}, // truyền params nếu có
    });
    return response;
  } catch (error: any) {
    if (error?.status === 401) {
      await $fetch("/dangxuat", { method: "POST" });
    }
    throw error;
  }
}
export async function PostData(url: string, data: object | null) {
  const config = useRuntimeConfig();
  const token = useCookie('token');
  const apiUrl = config.public.apiBase;
  try {
    const response = await $fetch(apiUrl + url, {
      method: 'POST',
      body: data,
      headers: {
        Authorization: token.value ? `Bearer ${token.value}` : '',
      },
    });

    return response;
  } catch (error: any) {
    if (error?.status === 401) {
      // Gọi API đăng xuất hoặc xử lý logout
      await $fetch('/dangxuat', { method: 'POST' });
    }
    throw error;
  }
}
