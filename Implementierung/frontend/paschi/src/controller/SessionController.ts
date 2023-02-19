import {Session} from "@/model/userdata/courses/Session";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {useSessionStore} from "@/store/SessionStore";
import {UserController} from "@/controller/UserController";
import {useInteractionStore} from "@/store/InteractionStore";
import {useCourseStore} from "@/store/CourseStore";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {useStudentStore} from "@/store/StudentStore";
import {Teacher} from "@/model/userdata/interactions/Teacher";

// TODO: Backend Service einbinden
// TODO: Standard Sitzordnung
export class SessionController {

  private static controller: SessionController = new SessionController();
  private userController = UserController.getUserController();
  private sessionStore = useSessionStore();
  private courseStore = useCourseStore();
  private arrangementStore = useSeatArrangementStore();
  private categoryStore = useCategoryStore();
  private studentStore = useStudentStore();
  private interactionStore = useInteractionStore();

  private constructor() {
  }

  static getSessionController(): SessionController {
    return this.controller;
  }

  createSession(courseId: string, seatArrangementId: string | undefined, name: string): string | undefined {
    let course = this.courseStore.getCourse(courseId);
    let arrangement = undefined;
    if (seatArrangementId != undefined) {
      arrangement = this.arrangementStore.getSeatArrangement(seatArrangementId);
      if (arrangement == undefined) {
        return undefined;
      }
    }
    if (course == undefined) {
      return undefined
    }

    let currentDate = new Date();
    let date = currentDate.getDay() + '.' + currentDate.getMonth() + '.' + currentDate.getFullYear();
    let session = new Session(
      undefined,
      this.sessionStore.getNextId(),
      this.userController.getUser(),
      name,
      date,
      course,
      arrangement
    );
    this.sessionStore.addSession(session);
    course.addSession(session);

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
      session.interactions.forEach((interaction: Interaction) => {
        interaction.fromParticipant.removeInteraction(interaction.getId);
        interaction.toParticipant.removeInteraction(interaction.getId);
        this.interactionStore.deleteInteraction(interaction.getId);
      });
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

  createInteraction(sessionId: string, fromParticipantId: string, toParticipantId: string,
                    categoryId: string): string | undefined {
    let session = this.sessionStore.getSession(sessionId);
    let category = this.categoryStore.getCategory(categoryId);
    let fromParticipant = this.studentStore.getStudent(fromParticipantId);
    let toParticipant = this.studentStore.getStudent(toParticipantId);
    if (session == undefined || category == undefined || fromParticipant == undefined || toParticipant == undefined) {
      return undefined;
    }

    let date = new Date();
    let interaction = new Interaction(
      undefined,
      this.interactionStore.getNextId(),
      this.userController.getUser(),
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
      session,
      fromParticipant,
      toParticipant,
      category
    );
    this.interactionStore.addInteraction(interaction);
    session.addInteraction(interaction);
    fromParticipant.addInteraction(interaction);
    toParticipant.addInteraction(interaction);
    return interaction.getId;
  }

  // deleteInteraction(sessionId: string, interactionId: string) {
  //   let session = this.sessionStore.getSession(sessionId);
  //   if (session !== undefined) {
  //     session.removeInteraction(interactionId);
  //     this.interactionStore.deleteInteraction(interactionId);
  //   }
  // }

  undoInteraction(sessionId: string) {
    let session = this.sessionStore.getSession(sessionId);
    if (session !== undefined) {
      const interaction = session.undoInteraction();
      if (interaction !== undefined) {
        interaction.fromParticipant.removeInteraction(interaction.getId);
        interaction.toParticipant.removeInteraction(interaction.getId);
        this.interactionStore.deleteInteraction(interaction.getId);
      }
    }
  }

  redoInteraction(sessionId: string): string | undefined {
    let session = this.sessionStore.getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    let interaction = session.redoInteraction();
    if (interaction == undefined) {
      return undefined;
    }
    this.interactionStore.addInteraction(interaction);
    interaction.fromParticipant.addInteraction(interaction);
    interaction.toParticipant.addInteraction(interaction);
    return interaction.getId;
  }

  hasRedo(sessionId: string): boolean | undefined {
    let session = this.sessionStore.getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    return session.hasRedo();
  }

  hasUndo(sessionId: string): boolean | undefined {
    let session = this.sessionStore.getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    return session.hasUndo();
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

  getTeacher(): Teacher {
    return Teacher.getTeacher();
  }

  getInteractionsOfStudent(sessionId: string, studentId: string): Interaction[] | undefined {
    const student = this.studentStore.getStudent(studentId);
    const session = this.sessionStore.getSession(sessionId);
    if (student == undefined || session == undefined) {
      return undefined;
    }

    const interactions: Interaction[] = [];
    session.interactions.forEach((interaction: Interaction) => {
      if (interaction.fromParticipant.getId === studentId || interaction.toParticipant.getId === studentId) {
        interactions.push(interaction);
      }
    });

    return interactions;
  }
}
