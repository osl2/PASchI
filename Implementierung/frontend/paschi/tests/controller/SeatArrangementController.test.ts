import {createPinia, setActivePinia} from "pinia";
import {UserController} from "@/controller/UserController";
import {AdminController} from "@/controller/AdminController";
import {SeatArrangementController} from "@/controller/SeatArrangementController";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {CourseController} from "@/controller/CourseController";
import {RoomController} from "@/controller/RoomController";
import {StudentController} from "@/controller/StudentController";

const arrangementController = SeatArrangementController.getSeatArrangementController();
const arrangementData = {name: "Sitzordnung"};
let arrangementId: string | undefined;
let arrangement: SeatArrangement | undefined;
let courseId: string;
let roomId: string;
const participants: string[] = [];
const chairs: string[] = [];

beforeAll(async () => {
  // await beforeEachTest();
  // TODO: Entfernen, wenn das Backend richtig läuft @ugqbo
  setActivePinia(createPinia());
  const admin = {email: "admin@kit.edu", password: "admin"};
  const user = {firstName: "Test", lastName: "5", email: "test5@test.jest", password: "test"};
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

test("Create seat arrangement", async () => {
  courseId = await CourseController.getCourseController().createCourse("kurs", "subject");
  roomId = await RoomController.getRoomController().createRoom("raum");
  await arrangementController.createSeatArrangement(arrangementData.name, roomId, "24");
  arrangementId = await arrangementController.createSeatArrangement(arrangementData.name, roomId, courseId);
  arrangement = arrangementController.getSeatArrangement(arrangementId!);

  expect(arrangement).toBeDefined();
  expect(arrangement?.name).toBe(arrangementData.name);
  expect(arrangement?.course.getId).toBe(courseId);
  expect(arrangement?.room.getId).toBe(roomId);
});

test("Create automatic seat arrangement", async () => {
  for (let i = 0; i < 5; i++) {
    const studentId = await StudentController.getStudentConroller().createStudent("firstName", "lastName");
    participants.push(studentId);
    CourseController.getCourseController().addStudentToCourse(courseId, studentId);
  }

  await arrangementController.createAutomaticSeatArrangement("Default", "24");
  const defaultArrangementId = await arrangementController.createAutomaticSeatArrangement("Default", courseId);
  const defaultArrangement = arrangementController.getSeatArrangement(defaultArrangementId!);

  expect(defaultArrangement).toBeDefined();
  expect(defaultArrangement?.name).toBe("Default");
  expect(defaultArrangement?.course.getId).toBe(courseId);
  expect(defaultArrangement?.isVisible()).toBeFalsy();
  expect(defaultArrangement?.seatMap.size).toBe(6);

  await arrangementController.deleteSeatArrangement(defaultArrangementId!);
});

test("Add mapping", async () => {
  const teacher = CourseController.getCourseController().getTeacher();
  for (let i = 0; i < 6; i++) {
    const chairId = RoomController.getRoomController().addChair(
      roomId,
      (i + 10) * 100,
      (i + 10) * 100,
      0
    );
    chairs.push(chairId!);
    if (i == 5) {
      await arrangementController.addMapping(arrangementId!, chairId!, "24");
      await arrangementController.addMapping(arrangementId!, "24", teacher.getId);
      await arrangementController.addMapping(arrangementId!, chairId!, teacher.getId);
    } else {
      await arrangementController.addMapping(arrangementId!, chairId!, participants[i]);
    }
  }

  expect(arrangement?.seatMap.size).toBe(6);
});

test("Get all students", () => {
  const students = arrangementController.getAllStudents(arrangementId!);

  expect(students?.length).toBe(5);
});

test("Delete mapping", async () => {
  await arrangementController.deleteMapping(arrangementId!, chairs[0]);
  const chair = RoomController.getRoomController().getRoomObject(roomId, chairs[0]);

  expect(arrangement?.seatMap.size).toBe(5);
  expect(arrangement?.seatMap.has(chair!)).toBeFalsy();
});

test("Get students not assigned", () => {
  const students = arrangementController.getStudentsNotAssigned(arrangementId!);

  expect(students?.length).toBe(1);
  expect(students![0].getId).toBe(participants[0]);
});

test("Get all seat arrangements", () => {
  const arrangements = arrangementController.getAllArrangements();

  expect(arrangements.length).toBeGreaterThan(0);
});

test("Delete seat arrangement", async () => {
  await arrangementController.deleteSeatArrangement(arrangementId!);
  arrangement = arrangementController.getSeatArrangement(arrangementId!);
  const arrangements = arrangementController.getAllArrangements();

  expect(arrangement).toBeUndefined();
  expect(arrangements.length).toBe(0);
});
