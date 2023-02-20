/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Components
import App from './App.vue'

// Composables
import {computed, createApp} from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
app.provide('isMobile', computed(()=> {
  return window.innerWidth < 1000
}))
registerPlugins(app)

app.mount('#app')
