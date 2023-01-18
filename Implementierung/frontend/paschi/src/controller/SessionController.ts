import {Session} from "@/model/userdata/courses/Session";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Category} from "@/model/userdata/interactions/Category";

export class SessionController {

  private static controller: SessionController = new SessionController();

  private constructor() {
  }

  static getSessionController(): SessionController {
    return SessionController.controller;
  }

  createSession(courseId: number, name: string): number {
    return 0;
  }

  updateSession(id: number, name: string) {

  }

  deleteSession(id: number) {

  }

  getAllSessions(): Session[] {
    return [];
  }

  getSession(id: number): Session | undefined {
    return undefined;
  }

  getCourseOfSession(sessionId: number): Course | undefined {
    // undefined entfernen nachdem implementiert
    return undefined;
  }

  getInteractionsOfSession(sessionId: number): Interaction[] {
    return [];
  }

  createInteraction(sessionId: number, fromParticipant: Participant, toParticipant: Participant,
                    categoryId: Category): number {
    return 0;
  }

  deleteInteraction(sesisonId: number, interactionId: number) {

  }

  setSeatArrangementOfSession(sessionId: number, arrangementId: number) {

  }

  getSeatArrangementOfSession(sessionId: number) {

  }
}
