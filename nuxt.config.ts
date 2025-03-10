export default defineNuxtConfig({
  ssr: false,
  typescript: {
    shim: false,
  },
  app: {
    baseURL: '/',
    buildAssetsDir: 'assets',
    head: {
      title:
        "Quasi AI",
    },
  },
  build: {
    transpile: ["vuetify"],
  },
  nitro: {
    compatibilityDate: '2025-03-06',
    serveStatic: true,
  },
  sourcemap: { server: false, client: false },
  devServerHandlers: [],
});
