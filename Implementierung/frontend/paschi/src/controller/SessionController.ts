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

  createSession(courseId: string, name: string): string {
    return "";
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
