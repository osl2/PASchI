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
import {SessionService} from "@/service/SessionService";
import {CourseService} from "@/service/CourseService";
import {ParticipantService} from "@/service/ParticipantService";

export class SessionController {

  private static controller: SessionController = new SessionController();
  private userController = UserController.getUserController();
  private sessionService = SessionService.getService();

  private constructor() {
  }

  static getSessionController(): SessionController {
    return this.controller;
  }

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
    let date = currentDate.getDay() + '.' + currentDate.getMonth() + '.' + currentDate.getFullYear();
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

  // updateSession(id: string, name: string) {
  //   let session = useSessionStore().getSession(id);
  //   if (session !== undefined) {
  //     session.name = name;
  //   }
  // }

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

      await this.sessionService.update(session).then();
      useSessionStore().deleteSession(id);
    }
  }

  getAllSessions(): Session[] {
    this.sessionService.getAll().then();
    return useSessionStore().getAllSessions();
  }

  getSession(id: string): Session | undefined {
    let session = useSessionStore().getSession(id);
    if (session == undefined) {
      return undefined
    }

    return session;
  }

  getCourseOfSession(sessionId: string): Course | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.course;
  }

  getInteractionsOfSession(sessionId: string): Interaction[] | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.interactions;
  }

  createInteraction(sessionId: string, fromParticipantId: string, toParticipantId: string,
                    categoryId: string): string | undefined {
    let session = useSessionStore().getSession(sessionId);
    let category = useCategoryStore().getCategory(categoryId);
    let fromParticipant = useStudentStore().getStudent(fromParticipantId);
    let toParticipant = useStudentStore().getStudent(toParticipantId);
    if (session == undefined || category == undefined || fromParticipant == undefined || toParticipant == undefined) {
      return undefined;
    }

    let date = new Date();
    let interaction = new Interaction(
      undefined,
      useInteractionStore().getNextId(),
      this.userController.getUser(),
      date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds(),
      session,
      fromParticipant,
      toParticipant,
      category
    );
    useInteractionStore().addInteraction(interaction);
    session.addInteraction(interaction);
    fromParticipant.addInteraction(interaction);
    toParticipant.addInteraction(interaction);

    this.sessionService.update(session).then();
    ParticipantService.getService().update(toParticipant).then();
    ParticipantService.getService().update(fromParticipant).then();
    return interaction.getId;
  }

  // deleteInteraction(sessionId: string, interactionId: string) {
  //   let session = useSessionStore().getSession(sessionId);
  //   if (session !== undefined) {
  //     session.removeInteraction(interactionId);
  //     useInteractionStore().deleteInteraction(interactionId);
  //   }
  // }

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

  hasRedo(sessionId: string): boolean | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    return session.hasRedo();
  }

  hasUndo(sessionId: string): boolean | undefined {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }
    return session.hasUndo();
  }

  // setSeatArrangementOfSession(sessionId: string, arrangementId: string) {
  //   let session = useSessionStore().getSession(sessionId);
  //   let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
  //   if (session !== undefined && arrangement !== undefined) {
  //     session.seatArrangement = arrangement;
  //   }
  // }

  getSeatArrangementOfSession(sessionId: string) {
    let session = useSessionStore().getSession(sessionId);
    if (session == undefined) {
      return undefined;
    }

    return session.seatArrangement;
  }

  getTeacher(): Teacher {
    return Teacher.getTeacher();
  }

  getInteractionsOfStudent(sessionId: string, studentId: string): Interaction[] | undefined {
    const student = useStudentStore().getStudent(studentId);
    const session = useSessionStore().getSession(sessionId);
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
