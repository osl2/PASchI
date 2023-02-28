import {StudentController} from "@/controller/StudentController";
import {afterEachTest, beforeEachTest} from "../setup";
import {Student} from "@/model/userdata/interactions/Student";

const studentController = StudentController.getStudentConroller();
const studentData = {firstName: "Gregor", lastName: "Snelting"};
let student: Student | undefined;
let studentId: string;

beforeAll(async () => {
  await beforeEachTest();
});

afterAll(async () => {
  await afterEachTest();
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
