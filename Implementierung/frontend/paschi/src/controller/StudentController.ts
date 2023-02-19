import {Student} from "@/model/userdata/interactions/Student";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {useStudentStore} from "@/store/StudentStore";
import {UserController} from "@/controller/UserController";
import {useCourseStore} from "@/store/CourseStore";
import {useSessionStore} from "@/store/SessionStore";
import {CourseController} from "@/controller/CourseController";
//import {ParticipantService} from "@/service/ParticipantService";

// TODO: Backend Service einbinden
export class StudentController {

  private static controller: StudentController = new StudentController();
  private userController = UserController.getUserController();
  //private studentService = ParticipantService.getService();
  private studentStore = useStudentStore();
  private courseStore = useCourseStore();
  private sessionStore = useSessionStore();

  private constructor() {
  }

  static getStudentConroller(): StudentController {
    return this.controller;
  }

  createStudent(firstName: string, lastName: string): string {
    const student = new Student(
      undefined,
      this.studentStore.getNextId(),
      this.userController.getUser(),
      firstName,
      lastName
    );
    //this.studentService.add(student);
    return this.studentStore.addStudent(student);
  }

  updateStudent(id: string, firstName: string, lastName: string) {
    let student = this.studentStore.getStudent(id);
    if (student !== undefined) {
      student.firstName = firstName;
      student.lastName = lastName;
      //this.studentService.update(student);
    }
  }

  deleteStudent(id: string) {
    let student = this.studentStore.getStudent(id);
    if (student !== undefined) {
      student.courses.forEach((course: Course) => {
        CourseController.getCourseController().removeStudentFromCourse(course.getId, id);
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

  getInteractionsOfStudent(studentId: string): Interaction[] | undefined {
    let student = this.studentStore.getStudent(studentId);
    if (student == undefined) {
      return undefined;
    }

    return student.interactions;
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
    let student = this.studentStore.getStudent(studentId);
    if (student !== undefined) {
      student.removeInteraction(interactionId);
    }
  }
}
