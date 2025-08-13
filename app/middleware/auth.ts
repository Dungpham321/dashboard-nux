

// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const token = useCookie("token");
  if (!token.value && to.path !== "/dangnhap") {
    return navigateTo("/dangnhap");
  }
  if (token.value && to.path === "/dangnhap") {
    return navigateTo("/");
  }
  return;
});
