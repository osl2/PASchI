import {Course} from "@/model/userdata/courses/Course";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useCourseStore} from "@/store/CourseStore";
import {UserController} from "@/controller/UserController";
import {useStudentStore} from "@/store/StudentStore";
import {createPinia} from "pinia";
import {useSessionStore} from "@/store/SessionStore";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";

// TODO: Backend Service einbinden
export class CourseController {

  private static controller: CourseController = new CourseController();
  private userController = UserController.getUserController();
  private courseStore = useCourseStore();
  private studentStore = useStudentStore(createPinia());
  private sessionStore = useSessionStore(createPinia());
  private arrangementStore = useSeatArrangementStore(createPinia());

  private constructor() {
  }

  static getCourseController(): CourseController {
    return CourseController.controller;
  }

  createCourse(name: string, subject: string): string {
    return this.courseStore.addCourse(new Course(
      undefined,
      this.courseStore.nextId,
      this.userController.getUser(),
      name,
      subject
    ));
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

  getStudentsNotInCourse(courseId: string): Participant[] | undefined {
    let course = this.courseStore.getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    let allStudents = this.studentStore.getAllStudents();
    let students: Participant[] = [];
    allStudents.forEach((student: Participant) => {
      if (course!.getParticipant(student.getId) == undefined) {
        students.push(student);
      }
    });

    return students;
  }

  addStudentToCourse(courseId: string, studentId: string) {
    let course = this.courseStore.getCourse(courseId);
    let student = this.studentStore.getStudent(studentId);
    if (course !== undefined && student !== undefined) {
      course.addParticipant(student);
      student.addCourse(course);
    }
  }

  removeStudentFromCourse(courseId: string, studentId: string) {
    let course = this.courseStore.getCourse(courseId);
    let student = this.studentStore.getStudent(studentId);
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
    let session = this.sessionStore.getSession(sessionId);
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
    let arrrangement = this.arrangementStore.getSeatArrangement(arrangementId);
    if (course !== undefined && arrrangement !== undefined) {
      course.addSeatArrangement(arrrangement);
      arrrangement.course = course;
    }
  }

  deleteSeatArrangement(courseId: string, arrangementId: string) {
    let course = this.courseStore.getCourse(courseId);
    let arrrangement = this.arrangementStore.getSeatArrangement(arrangementId);
    if (course !== undefined && arrrangement !== undefined) {
      course.removeSeatArrangement(arrangementId);
      this.arrangementStore.deleteSeatArrangement(arrangementId);
    }
  }
}
