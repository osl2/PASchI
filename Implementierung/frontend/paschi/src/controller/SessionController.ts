import {Session} from "@/model/userdata/courses/Session";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Participant} from "@/model/userdata/interactions/Participant";
import {useSessionStore} from "@/store/SessionStore";
import {UserController} from "@/controller/UserController";
import {useInteractionStore} from "@/store/InteractionStore";
import {useCourseStore} from "@/store/CourseStore";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {useCategoryStore} from "@/store/CategoryStore";

// TODO: Backend Service einbinden
// TODO: Standard Sitzordnung
export class SessionController {

  private static controller: SessionController = new SessionController();
  private userController = UserController.getUserController();
  private sessionStore = useSessionStore();
  private courseStore = useCourseStore();
  private arrangementStore = useSeatArrangementStore();
  private categoryStore = useCategoryStore();

  private constructor() {
  }

  static getSessionController(): SessionController {
    return SessionController.controller;
  }

  createSession(courseId: string, seatArrangementId: string, name: string): string | undefined {
    let course = this.courseStore.getCourse(courseId);
    let arrangement = this.arrangementStore.getSeatArrangement(seatArrangementId);
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
    let session = this.sessionStore.getSession(id);
    if (session !== undefined) {
      session.name = name;
    }
  }

  deleteSession(id: string) {
    let session = this.sessionStore.getSession(id);
    if (session !== undefined) {
      session.course.removeSession(id);
      this.sessionStore.deleteSession(id);
    }
  }

  getAllSessions(): Session[] {
    return this.sessionStore.getAllSessions();
  }

  getSession(id: string): Session | undefined {
    let session = this.sessionStore.getSession(id);
    if (session == undefined) {
      return undefined
    }

    return session;
  }

  getCourseOfSession(sessionId: string): Course | undefined {
    let session = this.sessionStore.getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.course;
  }

  getInteractionsOfSession(sessionId: string): Interaction[] | undefined {
    let session = this.sessionStore.getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.interactions;
  }

  createInteraction(sessionId: string, fromParticipant: Participant, toParticipant: Participant,
                    categoryId: string): string | undefined {
    let session = this.sessionStore.getSession(sessionId);
    let category = this.categoryStore.getCategory(categoryId);
    if (session == undefined || category == undefined) {
      return undefined;
    }

    let date = new Date();
    let interaction = new Interaction(
      undefined,
      useInteractionStore().getNextId(),
      this.userController.getUser(),
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
      fromParticipant,
      toParticipant,
      category
    );
    session.addInteraction(interaction);
    return interaction.getId;
  }

  deleteInteraction(sesisonId: string, interactionId: string) {
    let session = this.sessionStore.getSession(sesisonId);
    if (session !== undefined) {
      session.removeInteraction(interactionId);
    }
  }

  setSeatArrangementOfSession(sessionId: string, arrangementId: string) {
    let session = this.sessionStore.getSession(sessionId);
    let arrangement = this.arrangementStore.getSeatArrangement(arrangementId);
    if (session !== undefined && arrangement !== undefined) {
      session.seatArrangement = arrangement;
    }
  }

  getSeatArrangementOfSession(sessionId: string) {
    let session = this.sessionStore.getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.seatArrangement;
  }
}
