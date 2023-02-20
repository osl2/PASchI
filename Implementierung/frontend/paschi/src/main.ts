/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */


// Components
import App from './App.vue'

// Composables
import {computed, createApp, ref} from 'vue'

// Plugins
import { registerPlugins } from '@/plugins'

const app = createApp(App)
window.addEventListener("resize", ()=>{console.log("res")
  isMobile.value = window.innerWidth < 1000
  console.log(isMobile.value)
})
const isMobile = ref(window.innerWidth < 1000)
function resize() {
  isMobile.value = window.innerWidth < 1000
}
app.provide('isMobile', isMobile)
registerPlugins(app)

app.mount('#app')
