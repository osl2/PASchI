import {Course} from "@/model/userdata/courses/Course";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useCourseStore} from "@/store/CourseStore";
import {UserController} from "@/controller/UserController";

// TODO: Backend Service einbinden
export class CourseController {

  private static controller: CourseController = new CourseController();
  private courseStore = useCourseStore();
  private userController = UserController.getUserController();

  private constructor() {
  }

  static getCourseController(): CourseController {
    return CourseController.controller;
  }

  createCourse(name: string, subject: string): string {
    let course = new Course(undefined, this.courseStore.nextId, this.userController.getUser(), name, subject);
    this.courseStore.addCourse(course);

    return course.getId;
  }

  updateCourse(courseId: string, name: string, subject: string) {

  }

  deleteCourse(id: string) {

  }

  getCourse(id: string): Course | undefined {
    return undefined;
  }

  getAllCourses(): Course[] {
    return [];
  }

  getStudents(courseId: string): Participant[] {
    return [];
  }

  addStudentToCourse(courseId: string, studentId: string) {

  }

  removeStudentFromCourse(courseId: string, studentId: string) {

  }

  getSessions(courseId: string): Session[] {
    return [];
  }

  addSessionToCourse(courseId: string, sessionId: string) {

  }

  deleteSession(courseId: string, sessionId: string) {

  }

  getSeatArrangements(courseId: string): SeatArrangement[] {
    return [];
  }

  addSeatArrangementToCourse(courseId: string, arrangementId: string) {

  }

  deleteSeatArrangement(courseId: string, arrangementId: string) {

  }
}
