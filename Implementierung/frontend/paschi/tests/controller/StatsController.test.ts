import {StatsController} from "@/controller/StatsController";
import {CourseController} from "@/controller/CourseController";
import {StudentController} from "@/controller/StudentController";
import {SessionController} from "@/controller/SessionController";
import {CategoryController} from "@/controller/CategoryController";
import {Category} from "@/model/userdata/interactions/Category";
import {Quality} from "@/model/userdata/interactions/Quality";
import {Session} from "@/model/userdata/courses/Session";
import {afterEachTest, beforeEachTest} from "../setup";

const statsController = StatsController.getStatsController();
const studentIds: string[] = []
let sessionId: string;
let session: Session;
let courseId: string;
let category: Category;
let disturbance: Category;
let ratedCategoryThree: Category;
let ratedCategoryFour: Category;

beforeAll(async () => {
  await beforeEachTest();

  const studentController = StudentController.getStudentConroller();
  const sessionController = SessionController.getSessionController();
  const courseController = CourseController.getCourseController();
  const categoryController = CategoryController.getCategoryController();

  // Create data
  courseId = await courseController.createCourse("Kurs", "Fach");
  for (let i = 0; i < 6; i++) {
    studentIds.push(await studentController.createStudent("Student", `${i + 1}`));
    await courseController.addStudentToCourse(courseId, studentIds[i]);
  }
  sessionId = (await sessionController.createSession(courseId, undefined, "Sitzung"))!;
  session = sessionController.getSession(sessionId)!;
  await categoryController.createRatedCategory("Bewertete Kategorie");
  await categoryController.createCategory("Kategorie");
  category = categoryController.getAllCategories().find(category => category.name === "Kategorie")!;
  ratedCategoryThree = categoryController.getCategoryWithQuality("Bewertete Kategorie", Quality.THREE_STAR)!;
  ratedCategoryFour = categoryController.getCategoryWithQuality("Bewertete Kategorie", Quality.FOUR_STAR)!;
  disturbance = categoryController.getAllCategories().find(category => category.name === "Störung")!;

  const teacher = courseController.getTeacher();
  await sessionController.createInteraction(sessionId, studentIds[0], studentIds[1], ratedCategoryThree.getId);
  await sessionController.createInteraction(sessionId, studentIds[0], studentIds[1], ratedCategoryFour.getId);
  await sessionController.createInteraction(sessionId, studentIds[0], studentIds[1], disturbance.getId);
  await sessionController.createInteraction(sessionId, studentIds[0], studentIds[1], disturbance.getId);
  await sessionController.createInteraction(sessionId, studentIds[2], studentIds[3], disturbance.getId);
  await sessionController.createInteraction(sessionId, studentIds[4], studentIds[3], disturbance.getId);
  await sessionController.createInteraction(sessionId, studentIds[5], studentIds[1], category.getId);
  await sessionController.createInteraction(sessionId, teacher.getId, studentIds[5], category.getId);
});

afterAll(async () => {
  await afterEachTest();
});

test("Get student stats", () => {
  statsController.getStudentStats("24");
  const stats = statsController.getStudentStats(studentIds[0])!;
  const map = stats[0] as Map<string, number>;

  expect(map.get(ratedCategoryThree.name)).toBe(2);
  expect(map.get(disturbance.name)).toBe(2);
  expect(stats[1]).toBe(3.5);
});

test("Get course stats", () => {
  statsController.getCourseStats("24");
  const stats = statsController.getCourseStats(courseId)!;
  const topStudents: any[] = stats[0];
  const topDisturber: any[] = stats[4];
  const map = stats[5] as Map<string, number>;
  const participationRate = stats[6] as Map<string, number>;

  expect(topDisturber.length).toBe(5);
  expect(topDisturber).toContainEqual([studentIds[0], 2]);
  expect(topDisturber).toContainEqual([studentIds[1], 2]);
  expect(topDisturber).toContainEqual([studentIds[2], 1]);
  expect(topStudents.length).toBe(2);
  expect(topStudents).toContainEqual([studentIds[0], 2]);
  expect(topStudents).toContainEqual([studentIds[5], 1]);
  expect(map.get(ratedCategoryThree.name)).toBe(2);
  expect(map.get(category.name)).toBe(1);
  expect(map.get(disturbance.name)).toBe(4);
  expect(participationRate.get(session.date)).toBe(33);
});

test("Get session stats", () => {
  statsController.getSessionStats("24");
  const stats = statsController.getSessionStats(sessionId)!;
  const topStudents: any[] = stats[0];
  const topDisturber: any[] = stats[4];
  const map = stats[5] as Map<string, number>;
  const participationRate: number = stats[6];

  expect(topStudents.length).toBe(2);
  expect(topDisturber.length).toBe(5);
  expect(topStudents).toContainEqual([studentIds[0], 2]);
  expect(topStudents).toContainEqual([studentIds[5], 1]);
  expect(topDisturber).toContainEqual([studentIds[0], 2]);
  expect(topDisturber).toContainEqual([studentIds[1], 2]);
  expect(topDisturber).toContainEqual([studentIds[2], 1]);
  expect(map.get(ratedCategoryThree.name)).toBe(2);
  expect(map.get(category.name)).toBe(1);
  expect(map.get(disturbance.name)).toBe(4);
  expect(participationRate).toBe(33);
});
