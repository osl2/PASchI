import {StudentController} from "@/controller/StudentController";
import {Student} from "@/model/userdata/interactions/Student";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {createPinia, setActivePinia} from "pinia";

const studentController = StudentController.getStudentConroller();
const studentData = {firstName: "Gregor", lastName: "Snelting"};
let student: Student | undefined;
let studentId: string;

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Test", lastName: "3", email: "test3@test.jest", password: "test"};
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

test("Create student", async () => {
  studentId = await studentController.createStudent(studentData.firstName, studentData.lastName);
  student = studentController.getStudent(studentId);

  expect(studentId).toBeDefined();
  expect(student?.firstName).toBe(studentData.firstName);
  expect(student?.lastName).toBe(studentData.lastName);
});

test("Update student", async () => {
  const _firstName = "Walter";
  const _lastName = "Tichy";
  await studentController.updateStudent("24", _firstName, _lastName);
  await studentController.updateStudent(studentId, _firstName, _lastName);

  expect(student?.firstName).toBe(_firstName);
  expect(student?.lastName).toBe(_lastName);
});

test("Get all students", () => {
  const students = studentController.getAllStudents();

  expect(students.length).toBeGreaterThan(0);
});

test("Delete student", async () => {
  await studentController.deleteStudent(studentId);
  student = studentController.getStudent(studentId);

  expect(student).toBeUndefined();

  await studentController.deleteStudent(studentId);
});
