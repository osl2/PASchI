/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
app.config.globalProperties.$minDesktopSize = 1500;

registerPlugins(app)

app.mount('#app')
