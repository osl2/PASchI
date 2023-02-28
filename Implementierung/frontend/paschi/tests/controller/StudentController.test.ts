import {createPinia, setActivePinia} from "pinia";
import {StudentController} from "@/controller/StudentController";
import {UserController} from "@/controller/UserController";

setActivePinia(createPinia());

const studentController = StudentController.getStudentConroller();

const studentData = {firstName: "Gregor", lastName: "Snelting"};
const userData = {email: "admin@kit.edu", password: "admin"};
let studentId: string;

beforeAll(async () => {
  await UserController.getUserController().login(userData.email, userData.password);
});

test("Create student", async () => {
  studentId = await studentController.createStudent(studentData.firstName, studentData.lastName);
  expect(studentId).toBeDefined();
  const student = studentController.getStudent(studentId);
  expect(student?.firstName).toBe(studentData.firstName);
  expect(student?.lastName).toBe(studentData.lastName);
});

test("Update student", async () => {
  const _firstName = "Walter";
  const _lastName = "Tichy";
  await studentController.updateStudent("0", _firstName, _lastName);
  await studentController.updateStudent(studentId, _firstName, _lastName);
  const student = studentController.getStudent(studentId);
  expect(student?.firstName).toBe(_firstName);
  expect(student?.lastName).toBe(_lastName);
});

test("Get all students", () => {
  const students = studentController.getAllStudents();
  expect(students.length).toBeGreaterThan(0);
});

test("Delete student", async () => {
  await studentController.deleteStudent(studentId);
  const student = studentController.getStudent(studentId);
  expect(student).toBeUndefined();
  await studentController.deleteStudent(studentId);
});
