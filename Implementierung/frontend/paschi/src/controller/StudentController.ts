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

  updateStudent(id: number, firstName: string, lastName: string) {

  }

  deleteStudent(id: string) {

  }

  getStudent(id: number): Student | undefined {
    return undefined;
  }

  getAllStudents(): Student[] {
    return [];
  }

  getCoursesOfStudent(studentId: number): Course[] {
    return [];
  }

  addCourseToStudent(studentId: number, courseId: number) {

  }

  removeCourseFromStudent(studentId: number, courseId: number) {

  }

  getInteractionsOfStudent(studentId: number): Interaction[] {
    return [];
  }

  addInteraction(studentId: number, interactionId: number) {

  }

  removeInteraction(studentId: number, interactionId: number) {

  }
}
