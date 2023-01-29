import {Student} from "@/model/userdata/interactions/Student";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {useStudentStore} from "@/store/StudentStore";
import {UserController} from "@/controller/UserController";
import {useCourseStore} from "@/store/CourseStore";
import {useSessionStore} from "@/store/SessionStore";

// TODO: Backend Service einbinden
export class StudentController {

  private static controller: StudentController = new StudentController();
  private userController = UserController.getUserController();
  private studentStore = useStudentStore();
  private courseStore = useCourseStore();
  private sessionStore = useSessionStore();

  private constructor() {
  }

  static getStudentConroller(): StudentController {
    return StudentController.controller;
  }

  createStudent(firstName: string, lastName: string): string {
    return this.studentStore.addStudent(new Student(
      undefined,
      this.studentStore.getNextId(),
      this.userController.getUser()!,
      firstName,
      lastName
    ));
  }

  updateStudent(id: string, firstName: string, lastName: string) {

  }

  deleteStudent(id: string) {
    let student = this.studentStore.getStudent(id);
    if (student !== undefined) {
      student.courses.forEach((course: Course) => course.removeParticipant(id));
      this.studentStore.deleteStudent(id);
    }
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
    let student = this.studentStore.getStudent(studentId);
    let course = this.courseStore.getCourse(courseId);
    if (student !== undefined && course !== undefined) {
      student.addCourse(course);
      course.addParticipant(student);
    }
  }

  removeCourseFromStudent(studentId: string, courseId: string) {
    let student = this.studentStore.getStudent(studentId);
    let course = this.courseStore.getCourse(courseId);
    if (student !== undefined && course !== undefined) {
      student.removeCourse(courseId);
      course.removeParticipant(studentId);
    }
  }

  getInteractionsOfStudent(studentId: string): Interaction[] {
    return [];
  }

  addInteraction(studentId: string, sessionId: string, interactionId: string) {
    let student = this.studentStore.getStudent(studentId);
    let session = this.sessionStore.getSession(sessionId);
    if (student !== undefined && session !== undefined) {
      let interaction = session.getInteraction(interactionId);
      if (interaction !== undefined) {
        student.addInteraction(interaction);
      }
    }
  }

  removeInteraction(studentId: string, interactionId: string) {

  }
}
