import {Session} from "@/model/userdata/courses/Session";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Category} from "@/model/userdata/interactions/Category";
import {useSessionStore} from "@/store/SessionStore";
import {UserController} from "@/controller/UserController";
import {CourseController} from "@/controller/CourseController";
import {SeatArrangementController} from "@/controller/SeatArrangementController";

// TODO: Backend Service einbinden
export class SessionController {

  private static controller: SessionController = new SessionController();
  private sessionStore = useSessionStore();
  private userController = UserController.getUserController();
  private courseController = CourseController.getCourseController();
  private seatArrangementController = SeatArrangementController.getSeatArrangementController();

  private constructor() {
  }

  static getSessionController(): SessionController {
    return SessionController.controller;
  }

  createSession(courseId: string, seatArrangementId: string, name: string): string | undefined {
    let course = this.courseController.getCourse(courseId);
    let arrangement = this.seatArrangementController.getSeatArrangement(seatArrangementId);
    if (course == undefined || arrangement == undefined) {
      return undefined
    }

    let currentDate = new Date();
    let date = currentDate.getDay() + '.' + currentDate.getMonth() + '.' + currentDate.getFullYear();
    let session = new Session(undefined, this.sessionStore.getNextId(), this.userController.getUser(), name,
      date, course, arrangement);
    this.sessionStore.addSession(session);

    return session.getId;
  }

  updateSession(id: string, name: string) {

  }

  deleteSession(id: string) {

  }

  getAllSessions(): Session[] {
    return [];
  }

  getSession(id: string): Session | undefined {
    return undefined;
  }

  getCourseOfSession(sessionId: string): Course | undefined {
    // undefined entfernen nachdem implementiert
    return undefined;
  }

  getInteractionsOfSession(sessionId: string): Interaction[] {
    return [];
  }

  createInteraction(sessionId: string, fromParticipant: Participant, toParticipant: Participant,
                    categoryId: Category): string {
    return "";
  }

  deleteInteraction(sesisonId: string, interactionId: string) {

  }

  setSeatArrangementOfSession(sessionId: string, arrangementId: string) {

  }

  getSeatArrangementOfSession(sessionId: string) {

  }
}
