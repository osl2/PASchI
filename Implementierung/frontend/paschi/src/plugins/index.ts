/**
 * plugins/index.ts
 *
 * Automatically included in `./src/main.ts`
 */

// Plugins
import vuetify from "./vuetify";
import router from "@/plugins/router";

// Types
import type { App } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import VueAxios from "vue-axios";

const pinia = createPinia();

export function registerPlugins(app: App) {
  app.use(pinia);
  app.use(vuetify);
  app.use(router);
  app.use(VueAxios, axios);
}
