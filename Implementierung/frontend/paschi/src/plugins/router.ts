import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/userManagement/Login.vue";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import EditStudentPage from "@/components/studentManagement/EditStudentPage.vue";
import Register from "@/components/userManagement/Register.vue";
import AdminPage from "@/components/userManagement/AdminPage.vue";
import RoomEditor from "@/components/interactionMaps/RoomEditor.vue";
import ViewStudentsPage from "@/components/studentManagement/ViewStudentsPage.vue";
import ViewCoursesPage from "@/components/courses/viewCoursesPage.vue";
import EditCoursePage from "@/components/courses/editCoursePage.vue";
import EditAccountPage from "@/components/userManagement/EditAccountPage.vue";
import CourseDetailsPage from "@/components/courses/CourseDetailsPage.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/admin", name: "AdminPage", component: AdminPage },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/edit-student",
    name: "EditStudentPage",
    component: EditStudentPage,
    props: true,
  },
  {
    path: "/view-students",
    name: "ViewStudentsPage",
    component: ViewStudentsPage,
  },
  {
    path: "/edit-course",
    name: "EditCoursePage",
    component: EditCoursePage,
    props: true,
  },
  {
    path: "/view-courses",
    name: "ViewCoursesPage",
    component: ViewCoursesPage,
  },
  { path: "/room-editor", name: "InteractionMap", component: RoomEditor },
  {
    path: "/edit-account",
    name: "EditAccountPage",
    component: EditAccountPage,
  },
  {
    path: "/course-details",
    name: "CourseDetailsPage",
    component: CourseDetailsPage,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
