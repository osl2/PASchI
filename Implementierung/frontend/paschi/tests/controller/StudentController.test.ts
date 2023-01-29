import {StudentController} from "@/controller/StudentController";
import {setActivePinia, createPinia} from "pinia";
import {UserController} from "@/controller/UserController";

// TODO: Backend

setActivePinia(createPinia());
const studentController = StudentController.getStudentConroller();
const userController = UserController.getUserController();

const _firstName = "Gregor";
const _lastName = "Snelting";
const _email = "snelting@kit.edu";
const _password = "exmatrikulaion";
userController.register(_firstName, _lastName, _email, _password, _password);

let firstName = "Luka";
let lastName = "Kosak";
const id = studentController.createStudent(firstName, lastName);
const student = studentController.getStudent(id)!;

test("create", () => {
  expect(student.getId).toBe(id);
  expect(student.firstName).toBe(firstName);
  expect(student.lastName).toBe(lastName);

  const noStudent = studentController.getStudent("1");
  expect(noStudent).toBe(undefined);
});

test("update", () => {
  firstName = "Florian";
  lastName = "Knechtel";
  studentController.updateStudent(id, firstName, lastName);

  expect(student.firstName).toBe(firstName);
  expect(student.lastName).toBe(lastName);
});

test("delete", () => {
  const _id = studentController.createStudent(firstName, lastName);
  let _student = studentController.getStudent(_id)!;
  expect(_student).toBeDefined();
  studentController.deleteStudent(_id);
  _student = studentController.getStudent(_id)!;
  expect(_student).toBe(undefined);
});

test("getAll", () => {
  const students = studentController.getAllStudents();
  expect(students.at(0)!.firstName).toBe(firstName);
  expect(students.at(0)!.lastName).toBe(lastName);
});
