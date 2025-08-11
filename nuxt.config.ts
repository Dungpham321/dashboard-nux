import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  css: [
    "~/assets/css/main.css",
    "swiper/css",
    "swiper/css/navigation",
    "swiper/css/pagination",
    "jsvectormap/dist/jsvectormap.css",
    "flatpickr/dist/flatpickr.css",
    "@fortawesome/fontawesome-svg-core/styles.css",
  ],
  build: {
    transpile: [
      "@fortawesome/vue-fontawesome",
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-brands-svg-icons",
    ],
  },
  plugins: [
    { src: "~/plugins/jsvectormap.client.ts", mode: "client" },
    {src: "~/plugins/fontawesome.client.ts", mode:"client"}
  ],
  devtools: { enabled: true },
  // ssr: true,
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["crypto-js"],
    },
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_URL_API || "",
    },
  }
});
