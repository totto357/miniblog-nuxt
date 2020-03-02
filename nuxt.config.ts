import { Configuration } from "@nuxt/types"

const config: Configuration = {
  head: {
    title: "ミニブログ",
  },
  mode: "spa",
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  plugins: [
    "~/plugins/firebase",
  ],
  buildModules: [
    "@nuxtjs/vuetify",
    "@nuxt/typescript-build",
  ],
  router: {
    middleware: ["ready-auth"]
  }
}

export default config
