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
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {SessionController} from "@/controller/SessionController";
import {SeatArrangementController} from "@/controller/SeatArrangementController";
import {CourseService} from "@/service/CourseService";
import {ParticipantService} from "@/service/ParticipantService";
import {SeatArrangementService} from "@/service/SeatArrangementService";

export class CourseController {

  private static controller: CourseController = new CourseController();
  private userController = UserController.getUserController();
  private sessionController = SessionController.getSessionController();
  private arrangementController = SeatArrangementController.getSeatArrangementController();
  private courseService = CourseService.getService();

  private constructor() {
  }

  static getCourseController(): CourseController {
    return this.controller;
  }

  async createCourse(name: string, subject: string): Promise<string> {
    const course = new Course(
      undefined,
      useCourseStore().getNextId(),
      this.userController.getUser(),
      name,
      subject
    );

    await this.courseService.add(course);
    return useCourseStore().addCourse(course);
  }

  async updateCourse(courseId: string, name: string, subject: string) {
    let course = useCourseStore().getCourse(courseId);
    if (course !== undefined) {
      course.name = name;
      course.subject = subject;
      await this.courseService.update(course).then();
    }
  }

  async deleteCourse(id: string) {
    let course = useCourseStore().getCourse(id);
    if (course !== undefined) {
      course.participants.forEach((student: Participant) => {
        student.removeCourse(id);
        ParticipantService.getService().update(student);
      });
      course.sessions.forEach((session: Session) => {
        this.sessionController.deleteSession(session.getId);
      });
      course.seatArrangements.forEach((arrangement: SeatArrangement) => {
        this.arrangementController.deleteSeatArrangement(arrangement.getId);
      });
      await this.courseService.delete(id);
      useCourseStore().deleteCourse(id);
    }
  }

  getCourse(id: string): Course | undefined {
    return useCourseStore().getCourse(id);
  }

  getAllCourses(): Course[] {
    this.courseService.getAll().then();
    return useCourseStore().getAllCourses();
  }

  getStudentsOfCourse(courseId: string): Participant[] | undefined {
    let course = useCourseStore().getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    return course.participants;
  }

  getStudentsNotInCourse(courseId: string): Participant[] | undefined {
    let course = useCourseStore().getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    let allStudents = useStudentStore().getAllStudents();
    let students: Participant[] = [];
    allStudents.forEach((student: Participant) => {
      if (course!.getParticipant(student.getId) == undefined) {
        students.push(student);
      }
    });

    return students;
  }

  addStudentToCourse(courseId: string, studentId: string) {
    let course = useCourseStore().getCourse(courseId);
    let student = useStudentStore().getStudent(studentId);
    if (course !== undefined && student !== undefined) {
      course.addParticipant(student);
      student.addCourse(course);
      ParticipantService.getService().update(student).then();
      this.courseService.update(course).then();
    }
  }

  removeStudentFromCourse(courseId: string, studentId: string) {
    let course = useCourseStore().getCourse(courseId);
    let student = useStudentStore().getStudent(studentId);
    if (course !== undefined && student !== undefined) {
      course.removeParticipant(studentId);
      student.removeCourse(courseId);
      ParticipantService.getService().update(student).then();
      course.seatArrangements.forEach((arrangement: SeatArrangement) => {
        arrangement.seatMap.forEach((student: Participant, chair: RoomObject) => {
          if (student.getId === studentId) {
            arrangement.removeSeat(chair);
            SeatArrangementService.getService().update(arrangement).then();
          }
        });
      });
      this.courseService.update(course).then();
    }
  }

  getSessions(courseId: string): Session[] | undefined {
    let course = useCourseStore().getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    return course.sessions;
  }

  // addSessionToCourse(courseId: string, sessionId: string) {
  //   let course = useCourseStore().getCourse(courseId);
  //   let session = useSessionStore().getSession(sessionId);
  //   if (course !== undefined && session !== undefined && session.course.getId === courseId) {
  //     course.addSession(session);
  //   }
  // }

  // TODO
  deleteSession(courseId: string, sessionId: string) {
    this.sessionController.deleteSession(sessionId);
  }

  getSeatArrangements(courseId: string): SeatArrangement[] | undefined {
    let course = useCourseStore().getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    return course.seatArrangements;
  }

  // addSeatArrangementToCourse(courseId: string, arrangementId: string) {
  //   let course = useCourseStore().getCourse(courseId);
  //   let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
  //   if (course !== undefined && arrangement !== undefined) {
  //     course.addSeatArrangement(arrangement);
  //     arrangement.course = course;
  //   }
  // }

  // deleteSeatArrangement(courseId: string, arrangementId: string) {
  //   let course = useCourseStore().getCourse(courseId);
  //   let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
  //   if (course !== undefined && arrangement !== undefined) {
  //     course.removeSeatArrangement(arrangementId);
  //     useSeatArrangementStore().deleteSeatArrangement(arrangementId);
  //   }
  // }
  //
  // getInteractionsOfStudent(courseId: string, studentId: string): Interaction[] | undefined {
  //   const student = useStudentStore().getStudent(studentId);
  //   const course = useCourseStore().getCourse(courseId);
  //   if (student == undefined || course == undefined) {
  //     return undefined;
  //   }
  //
  //   const interactions: Interaction[] = [];
  //   course.sessions.forEach((session: Session) => {
  //     session.interactions.forEach((interaction: Interaction) => {
  //       if (interaction.fromParticipant.getId === studentId || interaction.toParticipant.getId === studentId) {
  //         interactions.push(interaction);
  //       }
  //     });
  //   });
  //
  //   return interactions;
  // }
}
