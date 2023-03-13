import {CourseService} from "@/service/CourseService";
import {Course} from "@/model/userdata/courses/Course";
import {createPinia, setActivePinia} from "pinia";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";

const service = CourseService.getService();
let course: Course

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Service", lastName: "Test", email: "service3@test.jest", password: "test"};
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

  course = new Course(
    undefined,
    0,
    userController.getUser(),
    "Kurs",
    "Fach"
  );
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
