import {Course} from "@/model/userdata/courses/Course";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useCourseStore} from "@/store/CourseStore";
import {UserController} from "@/controller/UserController";
import {StudentController} from "@/controller/StudentController";
import {SessionController} from "@/controller/SessionController";
import {SeatArrangementController} from "@/controller/SeatArrangementController";

// TODO: Backend Service einbinden
export class CourseController {

  private static controller: CourseController = new CourseController();
  private courseStore = useCourseStore();
  private userController = UserController.getUserController();
  private studentController = StudentController.getStudentConroller();
  private sessionController = SessionController.getSessionController();
  private seatArrangementController = SeatArrangementController.getSeatArrangementController();

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
    let course = this.courseStore.getCourse(courseId);
    if (course !== undefined) {
      course.name = name;
      course.subject = subject;
    }
  }

  deleteCourse(id: string) {
    let course = this.courseStore.getCourse(id);
    if (course !== undefined) {
      course.participants.forEach((student: Participant) => {
        student.removeCourse(id);
      });
    }
    this.courseStore.deleteCourse(id);
  }

  getCourse(id: string): Course | undefined {
    return this.courseStore.getCourse(id);
  }

  getAllCourses(): Course[] {
    return this.courseStore.getAllCourses();
  }

  getStudentsOfCourse(courseId: string): Participant[] | undefined {
    let course = this.courseStore.getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    return course.participants;
  }

  addStudentToCourse(courseId: string, studentId: string) {
    let course = this.courseStore.getCourse(courseId);
    let student = this.studentController.getStudent(studentId);
    if (course !== undefined && student !== undefined) {
      course.addParticipant(student);
      student.addCourse(course);
    }
  }

  removeStudentFromCourse(courseId: string, studentId: string) {
    let course = this.courseStore.getCourse(courseId);
    let student = this.studentController.getStudent(studentId);
    if (course !== undefined && student !== undefined) {
      course.removeParticipant(studentId);
      student.removeCourse(courseId);
    }
  }

  getSessions(courseId: string): Session[] | undefined {
    let course = this.courseStore.getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    return course.sessions;
  }

  addSessionToCourse(courseId: string, sessionId: string) {
    let course = this.courseStore.getCourse(courseId);
    let session = this.sessionController.getSession(sessionId);
    if (course !== undefined && session !== undefined && session.course.getId === courseId) {
      course.addSession(session);
    }
  }

  deleteSession(courseId: string, sessionId: string) {
    let course = this.courseStore.getCourse(courseId);
    if (course !== undefined) {
      course.removeSession(sessionId);
    }
  }

  getSeatArrangements(courseId: string): SeatArrangement[] | undefined {
    let course = this.courseStore.getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    return course.seatArrangements;
  }

  addSeatArrangementToCourse(courseId: string, arrangementId: string) {
    let course = this.courseStore.getCourse(courseId);
    let arrrangement = this.seatArrangementController.getSeatArrangement(arrangementId);
    if (course !== undefined && arrrangement !== undefined) {
      course.addSeatArrangement(arrrangement);
      arrrangement.course = course;
    }
  }

  deleteSeatArrangement(courseId: string, arrangementId: string) {
    let course = this.courseStore.getCourse(courseId);
    let arrrangement = this.seatArrangementController.getSeatArrangement(arrangementId);
    if (course !== undefined && arrrangement !== undefined) {
      course.removeSeatArrangement(arrangementId);
      this.seatArrangementController.deleteSeatArrangement(arrangementId);
    }
  }
}
