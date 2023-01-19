import {Student} from "@/model/userdata/interactions/Student";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {useStudentStore} from "@/store/StudentStore";
import {UserController} from "@/controller/UserController";
import {CourseController} from "@/controller/CourseController";
import {SessionController} from "@/controller/SessionController";

export class StudentController {

  private static controller: StudentController = new StudentController();
  private studentStore = useStudentStore();
  private userController = UserController.getUserController();
  private courseController = CourseController.getCourseController();
  private sessionController = SessionController.getSessionController();

  private constructor() {
  }

  static getStudentConroller(): StudentController {
    return StudentController.controller;
  }

  createStudent(firstName: string, lastName: string): string {
    let localId = this.studentStore.getId();
    let student = new Student(undefined, localId, this.userController.getUser(), firstName, lastName)
    this.studentStore.addStudent(student);

    return student.getId;
  }

  updateStudent(id: string, firstName: string, lastName: string) {
    let student = this.studentStore.getStudent(id);
    if (student !== undefined) {
      student.firstName = firstName;
      student.lastName = lastName;
    }
  }

  deleteStudent(id: string) {
    let student = this.studentStore.getStudent(id);
    if (student !== undefined) {
      student.courses.forEach((course: Course) => {
        course.removeParticipant(id);
      });
      this.studentStore.deleteStudent(id);
    }
  }

  getStudent(id: string): Student | undefined {
    return this.studentStore.getStudent(id);
  }

  getAllStudents(): Student[] {
    return this.studentStore.getAllStudents();
  }

  getCoursesOfStudent(studentId: string): Course[] | undefined {
    let student = this.studentStore.getStudent(studentId);
    if (student == undefined) {
      return undefined;
    }

    return student.courses;
  }

  addCourseToStudent(studentId: string, courseId: string) {
    let student = this.studentStore.getStudent(studentId);
    let course = this.courseController.getCourse(courseId);
    if (student !== undefined && course !== undefined) {
      student.addCourse(course);
      course.addParticipant(student);
    }
  }

  removeCourseFromStudent(studentId: string, courseId: string) {
    let student = this.studentStore.getStudent(studentId);
    let course = this.courseController.getCourse(courseId);
    if (student !== undefined && course !== undefined) {
      student.removeCourse(courseId);
      course.removeParticipant(studentId);
    }
  }

  getInteractionsOfStudent(studentId: string): Interaction[] | undefined {
    let student = this.studentStore.getStudent(studentId);
    if (student == undefined) {
      return undefined;
    }

    return student.interactions;
  }

  addInteraction(studentId: string, sessionId: string, interactionId: string) {
    let student = this.studentStore.getStudent(studentId);
    let session = this.sessionController.getSession(sessionId);
    if (student !== undefined && session !== undefined) {
      let interaction = session.getInteraction(interactionId);
      if (interaction !== undefined) {
        student.addInteraction(interaction);
      }
    }
  }

  removeInteraction(studentId: string, interactionId: string) {
    let student = this.studentStore.getStudent(studentId);
    if (student !== undefined) {
      student.removeInteraction(interactionId);
    }
  }
}
