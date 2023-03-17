import {CourseController} from "@/controller/CourseController";
import {StudentController} from "@/controller/StudentController";
import {Course} from "@/model/userdata/courses/Course";
import {SessionController} from "@/controller/SessionController";
import {SeatArrangementController} from "@/controller/SeatArrangementController";
import {RoomController} from "@/controller/RoomController";
import {afterEachTest, beforeEachTest} from "../setup";

const courseController = CourseController.getCourseController();
const courseData = {name: "PSE", subject: "Informatik"};
let courseId: string;
let participantId: string;
let arrangementId: string | undefined;
let course: Course | undefined;

beforeAll(async () => {
  await beforeEachTest();
});

afterAll(async () => {
  await afterEachTest();
});

test("Create course", async () => {
  courseId = await courseController.createCourse(courseData.name, courseData.subject);
  course = courseController.getCourse(courseId);

  expect(course).toBeDefined();
  expect(course?.name).toBe(courseData.name);
  expect(course?.subject).toBe(courseData.subject);
});

test("Update course", async () => {
  const _name = "Algo";
  const _subject = "Theoretische Informatik";
  await courseController.updateCourse("0", _name, _subject);
  await courseController.updateCourse(courseId, _name, _subject);

  expect(course?.name).toBe(_name);
  expect(course?.subject).toBe(_subject);
});

test("Get recent courses", async () => {
  const id = await courseController.createCourse("name", "subject");
  let courses = courseController.getRecentCourses();

  expect(courses.length).toBe(2);
  expect(courses[0].name).toBe("name");
  expect(courses[1].name).toBe("Algo");

  await courseController.updateCourse(courseId, courseData.name, courseData.subject);
  courses = courseController.getRecentCourses();

  expect(courses[1].name).toBe("name");
  expect(courses[0].name).toBe(courseData.name);

  await courseController.deleteCourse(id);
});

test("Add student to course and get student", async () => {
  const _firstName = "Luka";
  const _lastName = "Kosak";
  participantId = await StudentController.getStudentConroller().createStudent(_firstName, _lastName);

  expect(courseController.getStudentsOfCourse(courseId)?.length).toBe(0);

  await courseController.addStudentToCourse(courseId, participantId);
  const student = courseController.getStudentsOfCourse(courseId);

  if (student != undefined) {
    expect(student.length).toBe(1);
    expect(student[0].firstName).toBe(_firstName);
    expect(student[0].lastName).toBe(_lastName);
  }
  expect(courseController.getStudentsOfCourse("24")).toBeUndefined();
});

test("Get students not in course", async () => {
  const _firstName = "Gregor";
  const _lastName = "Snelting";
  const participantId = await StudentController.getStudentConroller().createStudent(_firstName, _lastName);
  const student = courseController.getStudentsNotInCourse(courseId);

  if (student != undefined) {
    expect(student.length).toBe(1);
    expect(student[0].firstName).toBe(_firstName);
    expect(student[0].lastName).toBe(_lastName);
  }

  await StudentController.getStudentConroller().deleteStudent(participantId);
  expect(courseController.getStudentsNotInCourse("24")).toBeUndefined();
});

test("Remove student from course", async () => {
  expect(courseController.getStudentsNotInCourse(courseId)?.length).toBe(0);
  expect(course?.participants.length).toBe(1);

  const roomController = RoomController.getRoomController();
  const roomId = await roomController.createRoom("raum");
  roomController.addChair(roomId, 0, 0, 0);
  await roomController.saveRoom(roomId);
  const chairId = roomController.getRoomObjects(roomId)![0].getId;
  const arrangementController = SeatArrangementController.getSeatArrangementController();
  arrangementId = await arrangementController.createSeatArrangement("arrangement", roomId, courseId);
  await arrangementController.addMapping(arrangementId!, chairId!, participantId);

  await courseController.removeStudentFromCourse(courseId, participantId);

  expect(course?.participants.length).toBe(0);
  expect(courseController.getStudentsNotInCourse(courseId)?.length).toBe(1);

  await StudentController.getStudentConroller().deleteStudent(participantId);
});

test("Get sessions of course", async () => {
  expect(courseController.getSessions(courseId)?.length).toBe(0);

  const sessionController = SessionController.getSessionController();
  const sessionId = await sessionController.createSession(courseId, undefined, "session");

  const sessions = courseController.getSessions(courseId);
  if (sessions != undefined) {
    expect(sessions[0].name).toBe("session");
  }

  await courseController.deleteSession(courseId, sessionId!);
  expect(courseController.getSessions(courseId)?.length).toBe(0);
});

test("Get seatArrangmenets of course", async () => {
  expect(courseController.getSeatArrangements("24")).toBeUndefined();
  expect(courseController.getSeatArrangements(courseId)?.length).toBe(1);

  await SeatArrangementController.getSeatArrangementController().deleteSeatArrangement(arrangementId!);
  expect(courseController.getSeatArrangements(courseId)?.length).toBe(0);
});

test("Get all courses", () => {
  const courses = courseController.getAllCourses();

  expect(courses.length).toBeGreaterThan(0);
});

test("Get teacher", () => {
  const teacher = courseController.getTeacher();

  expect(teacher).toBeDefined();
  expect(teacher.isTeacher()).toBeTruthy();
});

test("Delete course", async () => {
  const sessionController = SessionController.getSessionController();
  await sessionController.createSession(courseId, undefined, "session");
  await courseController.addStudentToCourse(courseId, participantId);

  await courseController.deleteCourse(courseId);
  course = courseController.getCourse(courseId);
  const courses = courseController.getAllCourses();

  expect(course).toBeUndefined();
  expect(courses.length).toBe(0);
});
