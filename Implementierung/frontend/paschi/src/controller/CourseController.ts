import {Course} from "@/model/userdata/courses/Course";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";

export class CourseController {

  private static controller: CourseController = new CourseController();

  private constructor() {
  }

  static getCourseController(): CourseController {
    return CourseController.controller;
  }

  createCourse(name: string, subject: string): number {
    return 0;
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
