import {Student} from "@/model/userdata/interactions/Student";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";

export class StudentController {

  private static controller: StudentController = new StudentController();

  private constructor() {
  }

  static getStudentConroller(): StudentController {
    return StudentController.controller;
  }

  createStudent(firstName: string, lastName: string): number {
    return 0;
  }

  updateStudent(id: string, firstName: string, lastName: string) {

  }

  deleteStudent(id: string) {

  }

  getStudent(id: string): Student | undefined {
    return undefined;
  }

  getAllStudents(): Student[] {
    return [];
  }

  getCoursesOfStudent(studentId: string): Course[] {
    return [];
  }

  addCourseToStudent(studentId: string, courseId: string) {

  }

  removeCourseFromStudent(studentId: string, courseId: string) {

  }

  getInteractionsOfStudent(studentId: string): Interaction[] {
    return [];
  }

  addInteraction(studentId: string, interactionId: string) {

  }

  removeInteraction(studentId: string, interactionId: string) {

  }
}
