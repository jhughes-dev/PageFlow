import {existsSync, readFileSync} from "node:fs";
// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    vue: {
      script: {
        fs: {
          fileExists(file: string) {
            return existsSync(file);
          },
          readFile(file: string) {
            return readFileSync(file, "utf-8");
          },
        },
      },
    },
  },
  runtimeConfig: {
    public: {
      loggerIds: (process.env?.LOGGER_IDS ?? "").split(",") as string[]
    }
  }
})
