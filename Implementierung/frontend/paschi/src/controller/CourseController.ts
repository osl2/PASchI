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

  updateCourse(courseId: number, name: string, subject: string) {

  }

  deleteCourse(id: number) {

  }

  getCourse(id: number): Course | undefined {
    return undefined;
  }

  getAllCourses(): Course[] {
    return [];
  }

  getStudents(courseId: number): Participant[] {
    return [];
  }

  addStudentToCourse(courseId: number, studentId: number) {

  }

  removeStudentFromCourse(courseId: number, studentId: number) {

  }

  getSessions(courseId: number): Session[] {
    return [];
  }

  addSessionToCourse(courseId: number, sessionId: number) {

  }

  deleteSession(courseId: number, sessionId: number) {

  }

  getSeatArrangements(courseId: number): SeatArrangement[] {
    return [];
  }

  addSeatArrangementToCourse(courseId: number, arrangementId: number) {

  }

  deleteSeatArrangement(courseId: number, arrangementId: number) {

  }
}
