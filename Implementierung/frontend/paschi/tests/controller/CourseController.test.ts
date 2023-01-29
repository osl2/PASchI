import {CourseController} from "@/controller/CourseController";
import {setActivePinia, createPinia} from "pinia";
import {UserController} from "@/controller/UserController";

setActivePinia(createPinia());
const courseController = CourseController.getCourseController();
const userController = UserController.getUserController();

const _firstName = "Gregor";
const _lastName = "Snelting";
const _email = "snelting@kit.edu";
const _password = "exmatrikulaion";
userController.register(_firstName, _lastName, _email, _password, _password);

let name = "PSE";
let subject = "Praktische Informatik";
const id = courseController.createCourse(name, subject);
const course = courseController.getCourse(id)!;

test("create", () => {
  expect(course.getId).toBe(id);
  expect(course.name).toBe(name);
  expect(course.subject).toBe(subject);

  const noCourse = courseController.getCourse("1");
  expect(noCourse).toBe(undefined);
});

test("update", () => {
  name = "Propa";
  subject = "Exmatrikulieren";
  courseController.updateCourse(id, name, subject);

  expect(course.name).toBe(name);
  expect(course.subject).toBe(subject);
});

test("delete", () => {
  const _id = courseController.createCourse(name, subject);
  let _course = courseController.getCourse(_id);
  expect(_course).toBeDefined();
  courseController.deleteCourse(_id);
  _course = courseController.getCourse(_id);
  expect(_course).toBe(undefined);
});

test("getAll", () => {
  const courses = courseController.getAllCourses();
  expect(courses.at(0)!.getId).toBe(id);
});
