import { createRouter, createWebHistory } from "vue-router";
import Login from "@/components/userManagement/Login.vue";
import Dashboard from "@/components/dashboard/Dashboard.vue";
import EditStudentPage from "@/components/studentManagement/EditStudentPage.vue";
import Register from "@/components/userManagement/Register.vue";
import AdminPage from "@/components/userManagement/AdminPage.vue";
import RoomEditor from "@/components/room/RoomEditor.vue";
import ViewStudentsPage from "@/components/studentManagement/ViewStudentsPage.vue";
import ViewCoursesPage from "@/components/courses/ViewCoursesPage.vue";
import EditCoursePage from "@/components/courses/EditCoursePage.vue";
import EditAccountPage from "@/components/userManagement/EditAccountPage.vue";
import CourseDetailsPage from "@/components/courses/CourseDetailsPage.vue";
import CourseStatisticPage from "@/components/statistics/CourseStatisticPage.vue";
import SessionStatisticPage from "@/components/statistics/SessionStatisticPage.vue";
import StudentStatisticPage from "@/components/statistics/StudentStatisticPage.vue";
import ShowInteractionMapPage from "@/components/statistics/ShowInteractionMapPage.vue";
import SeatArrangementPage from "@/components/room/SeatArrangementPage.vue";
import ViewRoomsPage from "@/components/room/ViewRoomsPage.vue";
import SessionPage from "@/components/session/SessionPage.vue";
import SessionPageDesktop from "@/components/session/SessionPageDesktop.vue";

const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  { path: "/admin", name: "AdminPage", component: AdminPage },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  {
    path: "/edit-student/:studentId",
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
    path: "/edit-course/:courseId",
    name: "EditCoursePage",
    component: EditCoursePage,
    props: true,
  },
  {
    path: "/view-courses",
    name: "ViewCoursesPage",
    component: ViewCoursesPage,
  },
  {
    path: "/room-editor/:roomId",
    name: "RoomEditor",
    component: RoomEditor,
    props: true,
  },
  {
    path: "/edit-account",
    name: "EditAccountPage",
    component: EditAccountPage,
  },
  {
    path: "/course-details/:courseId",
    name: "CourseDetailsPage",
    component: CourseDetailsPage,
    props: true,
  },
  {
    path: "/course-statistic/:courseId",
    name: "CourseStatisticPage",
    component: CourseStatisticPage,
    props: true,
  },
  {
    path: "/session-statistic/:sessionId",
    name: "SessionStatisticPage",
    component: SessionStatisticPage,
    props: true,
  },
  {
    path: "/student-statistic/:studentId",
    name: "StudentStatisticPage",
    component: StudentStatisticPage,
    props: true,
  },
  {
    path: "/show-interaction-map/:sessionId",
    name: "ShowInteractionMapPage",
    component: ShowInteractionMapPage,
    props: true,
  },
  {
    path: "/seat-arrangement/:seatArrangementId",
    name: "SeatArrangementPage",
    component: SeatArrangementPage,
    props: true,
  },
  {
    path: "/view-rooms",
    name: "ViewRoomsPage",
    component: ViewRoomsPage,
  },
  {
    path: "/session/:sessionId",
    name: "SessionPage",
    component: SessionPage,
    props: true,
  },
  {
    path: "/session-desktop/:sessionId",
    name: "SessionPageDesktop",
    component: SessionPageDesktop,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
