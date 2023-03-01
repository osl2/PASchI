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
import {SessionService} from "@/service/SessionService";
import {CourseService} from "@/service/CourseService";
import {ParticipantService} from "@/service/ParticipantService";
import {SeatArrangementController} from "@/controller/SeatArrangementController";

/**
 * Steuert den Kontrollfluss für die Sitzungsverwaltung
 */
export class SessionController {

  private static controller: SessionController = new SessionController();
  private userController = UserController.getUserController();
  private sessionService = SessionService.getService();

  private constructor() {
  }

  static getSessionController(): SessionController {
    return this.controller;
  }

  /**
   * Erstellt eine neue Sitzung.
   *
   * @param courseId ID des Kurses
   * @param seatArrangementId ID der Sitzordnung
   * @param name Name der Sitzung
   */
  async createSession(courseId: string, seatArrangementId: string | undefined, name: string):
    Promise<string | undefined> {

    let course = useCourseStore().getCourse(courseId);
    let arrangement = undefined;
    if (seatArrangementId != undefined) {
      arrangement = useSeatArrangementStore().getSeatArrangement(seatArrangementId);
      if (arrangement == undefined) {
        return undefined;
      }
    }
    if (course == undefined) {
      return undefined
    }

    let currentDate = new Date();
    let date = currentDate.getDate().toString() + '.' + (currentDate.getMonth() + 1).toString() + '.' +
      currentDate.getFullYear().toString();
    let session = new Session(
      undefined,
      useSessionStore().getNextId(),
      this.userController.getUser(),
      name,
      date,
      course,
      arrangement
    );

    await this.sessionService.add(session);
    course.addSession(session);
    CourseService.getService().update(course).then();

    return useSessionStore().addSession(session);
  }

  /**
   * Löscht eine Sitzung.
   *
   * @param id ID der Sitzung
   */
  async deleteSession(id: string) {
    let session = useSessionStore().getSession(id);
    if (session !== undefined) {
      session.course.removeSession(id);
      CourseService.getService().update(session.course).then();

      session.interactions.forEach((interaction: Interaction) => {
        interaction.fromParticipant.removeInteraction(interaction.getId);
        interaction.toParticipant.removeInteraction(interaction.getId);
        ParticipantService.getService().update(interaction.toParticipant);
        ParticipantService.getService().update(interaction.fromParticipant);
        useInteractionStore().deleteInteraction(interaction.getId);
      });

      await this.sessionService.delete(id);
      useSessionStore().deleteSession(id);
      if (!session.seatArrangement?.room.visible) {
        const arrangementController = SeatArrangementController.getSeatArrangementController();
        await arrangementController.deleteSeatArrangement(session.seatArrangement!.getId);
      }
    }
  }

  /**
   * Gibt alle Sitzungen zurück.
   */
  getAllSessions(): Session[] {
    this.sessionService.getAll().then();
    return useSessionStore().getAllSessions();
  }

  /**
   * Gibt die Sitzung mit der übergebenen ID zurück.
   *
   * @param id ID der Sitzung
   */
  getSession(id: string): Session | undefined {
    let session = useSessionStore().getSession(id);
    if (session == undefined) {
      return undefined
    }

    return session;
  }

  /**
   * Gibt die letzten 5 Sitzungen zurück.
   */
  getRecentSessions(): Session[] {
    const allSessions = useSessionStore().getAllSessions();
    allSessions.sort((a: Session, b: Session) => {
      return (a.createdAt <= b.createdAt) ? 1 : -1;
    });
    const sessions = [];
    const max = allSessions.length < 5 ? allSessions.length : 5;
    for (let i = 0; i < max; i++) {
      sessions.push(allSessions[i]);
    }

    return sessions;
  }

  /**
   * Gibt den Kurs der SItzung zurück.
   *
   * @param sessionId ID der Sitzung
   */
  getCourseOfSession(sessionId: string): Course | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.course;
  }

  /**
   * Gibt die Interactionen der Sitzung zurück.
   *
   * @param sessionId ID der Sitzung
   */
  getInteractionsOfSession(sessionId: string): Interaction[] | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.interactions;
  }

  /**
   * Erstellt eine neue Interaktion.
   *
   * @param sessionId ID der Sitzung
   * @param fromParticipantId ID des Teilnehmers
   * @param toParticipantId ID des Teilnehmers
   * @param categoryId ID der Kategorie
   */
  async createInteraction(sessionId: string, fromParticipantId: string, toParticipantId: string,
                          categoryId: string): Promise<string | undefined> {
    let session = useSessionStore().getSession(sessionId);
    let category = useCategoryStore().getCategory(categoryId);
    let fromParticipant = useStudentStore().getParticipant(fromParticipantId);
    let toParticipant = useStudentStore().getParticipant(toParticipantId);

    if (session == undefined || category == undefined || fromParticipant == undefined || toParticipant == undefined) {
      return undefined;
    }

    let date = new Date();
    let interaction = new Interaction(
      undefined,
      useInteractionStore().getNextId(),
      this.userController.getUser(),
      date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
      session,
      fromParticipant,
      toParticipant,
      category
    );
    useInteractionStore().addInteraction(interaction);
    session.addInteraction(interaction);
    await this.sessionService.update(session).then();

    fromParticipant.addInteraction(interaction);
    toParticipant.addInteraction(interaction);
    ParticipantService.getService().update(toParticipant).then();
    ParticipantService.getService().update(fromParticipant).then();
    return interaction.getId;
  }

  /**
   * Macht die letzte Interaktion rückgängig.
   *
   * @param sessionId ID der Sitzung.
   */
  undoInteraction(sessionId: string) {
    let session = useSessionStore().getSession(sessionId);
    if (session !== undefined) {
      const interaction = session.undoInteraction();
      this.sessionService.update(session).then();
      if (interaction !== undefined) {
        interaction.fromParticipant.removeInteraction(interaction.getId);
        interaction.toParticipant.removeInteraction(interaction.getId);
        ParticipantService.getService().update(interaction.toParticipant).then();
        ParticipantService.getService().update(interaction.fromParticipant).then();
        useInteractionStore().deleteInteraction(interaction.getId);
      }
    }
  }

  /**
   * Wiederherstellen einer rückgängig gemachten Interaktion.
   *
   * @param sessionId ID der Interaktion
   */
  redoInteraction(sessionId: string): string | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    let interaction = session.redoInteraction();
    this.sessionService.update(session).then();
    if (interaction == undefined) {
      return undefined;
    }
    useInteractionStore().addInteraction(interaction);
    interaction.fromParticipant.addInteraction(interaction);
    interaction.toParticipant.addInteraction(interaction);
    ParticipantService.getService().update(interaction.toParticipant).then();
    ParticipantService.getService().update(interaction.fromParticipant).then();
    return interaction.getId;
  }

  /**
   * Gibt zurück, ob Interaktionen rückgängig gemacht wurden.
   *
   * @param sessionId ID der Sitzung
   */
  hasRedo(sessionId: string): boolean | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    return session.hasRedo();
  }

  /**
   * Gibt zurück, ob undo möglich ist.
   *
   * @param sessionId ID der Sitzung
   */
  hasUndo(sessionId: string): boolean | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    return session.hasUndo();
  }

  /**
   * Gibt die Sitzordnung der Session zurück.
   *
   * @param sessionId ID der Sitzung
   */
  getSeatArrangementOfSession(sessionId: string) {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.seatArrangement;
  }

  /**
   * Gibt die Interaktionen eines Schülers in der übergebenen Sitzung zurück.
   *
   * @param sessionId ID der Sitzung
   * @param participantId ID des Schülers
   */
  getInteractionsOfParticipant(sessionId: string, participantId: string): Interaction[] | undefined {
    const participant = useStudentStore().getParticipant(participantId);
    const session = useSessionStore().getSession(sessionId);
    if (participant == undefined || session == undefined) {
      return undefined;
    }

    const interactions: Interaction[] = [];
    session.interactions.forEach((interaction: Interaction) => {
      if (interaction.fromParticipant.getId === participantId || interaction.toParticipant.getId === participantId) {
        interactions.push(interaction);
      }
    });

    return interactions;
  }
}
