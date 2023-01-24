import {createRouter, createWebHistory} from "vue-router";
import Login from "@/components/authentication/Login.vue";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import EditStudentPage from "@/components/studentManagement/EditStudentPage.vue";
import Register from "@/components/authentication/Register.vue";
import AdminPage from "@/components/authentication/AdminPage.vue";
import RoomEditor from "@/components/interactionMaps/RoomEditor.vue";
import ViewStudentsPage from "@/components/studentManagement/ViewStudentsPage.vue";

const routes = [
  {path: '/login', name: 'Login', component: Login},
  {path: '/register', name: 'Register', component: Register},
  {path: '/admin', name: 'AdminPage', component: AdminPage},
  {path: '/dashboard', name: 'Dashboard', component: Dashboard},
  {path: '/edit-student', name: 'EditStudentPage', component: EditStudentPage, props: { studentId: 1}},
  {path: '/viewStudents', name: 'viewStudentsPage', component: ViewStudentsPage},
  {path: '/room-editor', name: 'InteractionMap', component: RoomEditor}

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
