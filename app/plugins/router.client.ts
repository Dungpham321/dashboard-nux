export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('currentRoute', () => useRoute());
});
