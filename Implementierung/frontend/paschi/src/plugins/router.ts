import {createRouter, createWebHistory} from "vue-router";
import Login from "@/components/authentication/Login.vue";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import editStudentPage from "@/components/studentManagement/EditStudentPage.vue";
import EditStudentPage from "@/components/studentManagement/EditStudentPage.vue";
import Register from "@/components/authentication/Register.vue";

const routes = [
  {path: '/login', name: 'Login', component: Login},
  {path: '/register', name: 'Register', component: Register},
  {path: '/dashboard', name: 'Dashboard', component: Dashboard},
  {path: '/editStudent', name: 'EditStudentPage', component: EditStudentPage},

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
