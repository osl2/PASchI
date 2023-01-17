/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import { loadFonts } from './webfontloader'
import vuetify from './vuetify'
import router from "@/plugins/router";

// Types
import type { App } from 'vue'
import {createPinia} from "pinia";

const pinia = createPinia()

export function registerPlugins (app: App) {
  loadFonts()
  app.use(vuetify)
  app.use(router)
  app.use(pinia)
}
