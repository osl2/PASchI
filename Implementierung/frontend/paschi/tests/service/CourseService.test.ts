import {CourseService} from "@/service/CourseService";
import {Course} from "@/model/userdata/courses/Course";
import {UserController} from "@/controller/UserController";
import {afterEachTest, beforeEachTest} from "../setup";

const service = CourseService.getService();
let course: Course

beforeAll(async () => {
  await beforeEachTest();

  course = new Course(
    undefined,
    0,
    UserController.getUserController().getUser(),
    "Kurs",
    "Fach"
  );
});

afterAll(async () => {
  await afterEachTest();
});

test("Add and get course", async () => {
  await service.add(course);
  const courses = await service.getAll();
  course.setId = courses[0].getId;

  expect(courses.length).toBe(1);
  expect(courses[0].name).toBe(course.name);
  expect(courses[0].subject).toBe(course.subject);
});

test("Get course by id", async () => {
  const _course = await service.getById(course.getId);

  expect(_course?.getId).toBe(course.getId);
  expect(_course?.name).toBe(course.name);
  expect(_course?.subject).toBe(course.subject);
});

test("Update course", async () => {
  course.name = "PSE";
  course.subject = "Informatik";
  await service.update(course);
  const _course = await service.getById(course.getId);

  expect(_course?.name).toBe("PSE");
  expect(_course?.subject).toBe("Informatik");
});

test("Delete course", async () => {
  await service.delete(course.getId);
  const _course = await service.getById(course.getId);

  expect(_course).toBeUndefined();
});
