import {Session} from "@/model/userdata/courses/Session";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {useSessionStore} from "@/store/SessionStore";
import {UserController} from "@/controller/UserController";
import {useInteractionStore} from "@/store/InteractionStore";
import {useCourseStore} from "@/store/CourseStore";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {useStudentStore} from "@/store/ParticipantStore";
import {SessionService} from "@/service/SessionService";
import {CourseService} from "@/service/CourseService";
import {ParticipantService} from "@/service/ParticipantService";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {SeatArrangementController} from "@/controller/SeatArrangementController";

/**
 * Steuert den Kontrollfluss für die Sitzungsverwaltung
 */
export class SessionController {

  private static controller: SessionController = new SessionController();
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

    const arrangementController = SeatArrangementController.getSeatArrangementController();

    const course = useCourseStore().getCourse(courseId);
    if (course == undefined) {
      return undefined
    }

    let arrangement: SeatArrangement | undefined;
    if (!seatArrangementId) {
      if (course.defaultArrangement) {
        arrangement = course.defaultArrangement;
      } else {
        seatArrangementId = await arrangementController.createAutomaticSeatArrangement("Default", courseId);
        if (seatArrangementId == undefined) {
          return undefined;
        }
        arrangement = useSeatArrangementStore().getSeatArrangement(seatArrangementId);
      }
    } else {
      arrangement = await useSeatArrangementStore().getSeatArrangement(seatArrangementId);
    }
    if (arrangement == undefined) {
      return undefined;
    }

    const currentDate = new Date();
    const date = currentDate.getDate().toString() + '.' + (currentDate.getMonth() + 1).toString() + '.' +
      currentDate.getFullYear().toString();
    const session = new Session(
      undefined,
      useSessionStore().getNextId(),
      UserController.getUserController().getUser(),
      name,
      date,
      course,
      arrangement
    );

    await this.sessionService.add(session);
    course.addSession(session);
    await CourseService.getService().update(course);

    return useSessionStore().addSession(session);
  }

  /**
   * Aktualisiert den Namen der Sitzung.
   *
   * @param id ID der Sitzung
   * @param name Neuer Name
   */
  async updateSession(id: string, name: string) {
    const session = useSessionStore().getSession(id);
    if (session) {
      session.name = name;
      await this.sessionService.update(session);
    }
  }

  /**
   * Löscht eine Sitzung.
   *
   * @param id ID der Sitzung
   */
  async deleteSession(id: string) {
    const session = useSessionStore().getSession(id);
    if (session) {
      session.course.removeSession(id);
      await CourseService.getService().update(session.course);

      for (const interaction of session.interactions) {
        interaction.fromParticipant.removeInteraction(interaction.getId);
        interaction.toParticipant.removeInteraction(interaction.getId);
        await ParticipantService.getService().update(interaction.toParticipant);
        await ParticipantService.getService().update(interaction.fromParticipant);
        useInteractionStore().deleteInteraction(interaction.getId);
      }

      await this.sessionService.delete(id);
      useSessionStore().deleteSession(id);
      const arrangementController = SeatArrangementController.getSeatArrangementController();
      const arrangement = session.seatArrangement;
      if (!arrangement.isVisible()) {
        if (!session.course.defaultArrangementIsUsed(arrangement.getId)) {
          await arrangementController.deleteSeatArrangement(arrangement.getId);
        }
      } else {
        await arrangementController.deleteSeatArrangement(arrangement.getId);
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
    return useSessionStore().getSession(id);
  }

  /**
   * Gibt die letzten 5 Sitzungen zurück.
   */
  getRecentSessions(): Session[] {
    const allSessions = useSessionStore().getAllSessions().sort((a: Session, b: Session) => {
      return (a.updatedAt <= b.updatedAt) ? 1 : -1;
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
    return useSessionStore().getSession(sessionId)?.course;
  }

  /**
   * Gibt die Interaktionen der Sitzung zurück.
   *
   * @param sessionId ID der Sitzung
   */
  getInteractionsOfSession(sessionId: string): Interaction[] | undefined {
    return useSessionStore().getSession(sessionId)?.interactions;
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
    const session = useSessionStore().getSession(sessionId);
    const category = useCategoryStore().getCategory(categoryId);
    const fromParticipant = useStudentStore().getParticipant(fromParticipantId);
    const toParticipant = useStudentStore().getParticipant(toParticipantId);

    if (session == undefined || category == undefined || fromParticipant == undefined || toParticipant == undefined) {
      return undefined;
    }

    const date = new Date();
    const interaction = new Interaction(
      undefined,
      useInteractionStore().getNextId(),
      UserController.getUserController().getUser(),
      date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString(),
      session,
      fromParticipant,
      toParticipant,
      category
    );
    session.addInteraction(interaction);
    useInteractionStore().addInteraction(interaction);
    await this.sessionService.update(session);

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
    const session = useSessionStore().getSession(sessionId);
    if (session) {
      const interaction = session.undoInteraction();
      this.sessionService.update(session).then();
      if (interaction) {
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
    const session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    const interaction = session.redoInteraction();
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
    return useSessionStore().getSession(sessionId)?.hasRedo();
  }

  /**
   * Gibt zurück, ob undo möglich ist.
   *
   * @param sessionId ID der Sitzung
   */
  hasUndo(sessionId: string): boolean | undefined {
    return useSessionStore().getSession(sessionId)?.hasUndo();
  }

  /**
   * Gibt die Sitzordnung der Session zurück.
   *
   * @param sessionId ID der Sitzung
   */
  getSeatArrangementOfSession(sessionId: string): SeatArrangement | undefined {
    return useSessionStore().getSession(sessionId)?.seatArrangement;
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

    return session.interactions.filter(interaction =>
      interaction.fromParticipant.getId === participantId || interaction.toParticipant.getId === participantId
    );
  }
}
