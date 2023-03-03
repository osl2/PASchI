import {SessionController} from "@/controller/SessionController";
import {createPinia, setActivePinia} from "pinia";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {Session} from "@/model/userdata/courses/Session";
import {CourseController} from "@/controller/CourseController";

const sessionController = SessionController.getSessionController();
const sessionData = {name: "Kolloquium 1"};
let sessionId: string | undefined;
let session: Session | undefined;
let courseId: string;
const interaction = {fromId: "", toId: ""};

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Test", lastName: "4", email: "test4@test.jest", password: "test"};
  const userController = UserController.getUserController();
  const adminController = AdminController.getAdminController();

  await userController.register(
    user.firstName,
    user.lastName,
    user.email,
    user.password,
    user.password
  );

  await userController.login(admin.email, admin.password);
  const users = await adminController.getUsersNotAuthenticated();
  for (const user of users) {
    await adminController.authUser(user.getId);
  }

  setActivePinia(createPinia());

  await userController.login(user.email, user.password);
});

afterAll(async () => {
  // await afterEachTest();
});

test("Create session", async () => {
  courseId = await CourseController.getCourseController().createCourse("name", "subject");
  sessionId = await sessionController.createSession(courseId, undefined, sessionData.name);
  session = sessionController.getSession(sessionId!);

  expect(session).toBeDefined();
  expect(session?.name).toBe(sessionData.name);
  expect(session?.course.getId).toBe(courseId);
});

test("Update session", async () => {
  const _name = "Abschlusspräsentation";
  await sessionController.updateSession("0", _name);
  await sessionController.updateSession(sessionId!, _name);

  expect(session?.name).toBe(_name);
});

test("Get recent sessions", async () => {
  const id = await sessionController.createSession(courseId, undefined, "Kolloquium 2");
  let sessions = sessionController.getRecentSessions();

  expect(sessions.length).toBe(2);
  expect(sessions[0].name).toBe("Kolloquium 2");
  expect(sessions[1].name).toBe("Abschlusspräsentation");

  await sessionController.updateSession(sessionId!, sessionData.name);
  sessions = sessionController.getRecentSessions();

  expect(sessions[1].name).toBe("Kolloquium 2");
  expect(sessions[0].name).toBe(sessionData.name);

  await sessionController.deleteSession(id!);
});

test("Get course of session", () => {
  expect(sessionController.getCourseOfSession(sessionId!)?.getId).toBe(courseId);
});

// test("Create interaction", async () => {
//   interaction.fromId = await StudentController.getStudentConroller().createStudent("Luka", "Kosak");
//   interaction.toId = await StudentController.getStudentConroller().createStudent("Gregor", "Snelting");
//   const categoryId = await CategoryController.getCategoryController().createCategory("Kategorie");
// });

test("Get all sessions", () => {
  const sessions = sessionController.getAllSessions();

  expect(sessions.length).toBeGreaterThan(0);
});

test("Delete session", async () => {
  await sessionController.deleteSession(sessionId!);
  session = sessionController.getSession(sessionId!);
  const sessions = sessionController.getAllSessions();

  expect(session).toBeUndefined();
  expect(sessions.length).toBe(0);

  await sessionController.deleteSession(sessionId!);
});
