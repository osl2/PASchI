import {Course} from "@/model/userdata/courses/Course";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useCourseStore} from "@/store/CourseStore";
import {UserController} from "@/controller/UserController";
import {useStudentStore} from "@/store/StudentStore";
import {useSessionStore} from "@/store/SessionStore";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";

// TODO: Backend Service einbinden
export class CourseController {

  private static controller: CourseController = new CourseController();
  private userController = UserController.getUserController();
  private courseStore = useCourseStore();
  private studentStore = useStudentStore();
  private sessionStore = useSessionStore();
  private arrangementStore = useSeatArrangementStore();

  private constructor() {
  }

  static getCourseController(): CourseController {
    return this.controller;
  }

  createCourse(name: string, subject: string): string {
    return this.courseStore.addCourse(new Course(
      undefined,
      this.courseStore.getNextId(),
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
      course.seatArrangements.forEach((arrangement: SeatArrangement) => {
        arrangement.seatMap.forEach((student: Participant, chair: RoomObject) => {
          if (student.getId === studentId) {
            arrangement.removeSeat(chair);
          }
        });
      });
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

  // addSeatArrangementToCourse(courseId: string, arrangementId: string) {
  //   let course = this.courseStore.getCourse(courseId);
  //   let arrangement = this.arrangementStore.getSeatArrangement(arrangementId);
  //   if (course !== undefined && arrangement !== undefined) {
  //     course.addSeatArrangement(arrangement);
  //     arrangement.course = course;
  //   }
  // }

  deleteSeatArrangement(courseId: string, arrangementId: string) {
    let course = this.courseStore.getCourse(courseId);
    let arrangement = this.arrangementStore.getSeatArrangement(arrangementId);
    if (course !== undefined && arrangement !== undefined) {
      course.removeSeatArrangement(arrangementId);
      this.arrangementStore.deleteSeatArrangement(arrangementId);
    }
  }
}
