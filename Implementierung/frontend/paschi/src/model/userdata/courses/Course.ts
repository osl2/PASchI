import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {User} from "@/model/User";
import {DataObject} from "@/model/DataObject";

/**
 * Diese Klasse beschreibt einen Kurs
 *
 * @author uekai
 * @version 1.0
 */
export class Course extends DataObject {

  private readonly _user: User
  private _name: string;
  private _subject: string;
  private _participants: Participant[];
  private _sessions: Session[];
  private _seatArrangements: SeatArrangement[];
  private _defaultArrangement: SeatArrangement | undefined;

  /**
   * Konstruktor
   *
   * @param id Die ID
   * @param localId Lokale ID
   * @param user Der Benutzer, dem der Kurs gehört
   * @param name Name des Kurses
   * @param subject Fach des Kurses
   */
  constructor(id: string | undefined, localId: number, user: User, name: string, subject: string) {
    super(id, localId);
    this._user = user;
    this._name = name;
    this._subject = subject;
    this._participants = [];
    this._sessions = [];
    this._seatArrangements = [];
  }

  /**
   * Fügt einen Teilnehmer zum Kurs hinzu.
   *
   * @param participant Teilnehmer
   */
  addParticipant(participant: Participant) {
    if (this.getParticipant(participant.getId) == undefined) {
      this._participants.push(participant);
      if (this._defaultArrangement) {
        this.removeSeatArrangement(this._defaultArrangement.getId);
      }
    }
    this.update();
  }

  /**
   * Entfernt einen Teilnehmer aus dem Kurs.
   *
   * @param participantId ID des Teilnehmers
   */
  removeParticipant(participantId: string) {
    this._participants.forEach((element: Participant, index: number) => {
      if (element.getId === participantId) {
        this._participants.splice(index, 1)
        if (this._defaultArrangement) {
          this.removeSeatArrangement(this._defaultArrangement.getId);
        }
      }
    });
    this.update();
  }

  /**
   * Gibt den Teilnehmer mit der übergebenen ID zurück.
   * Gibt undefined zurück, wenn der Teilnehmer im Kurs nicht gefunden wurde.
   *
   * @param participantId ID des Teilnehmers
   */
  getParticipant(participantId: string): Participant | undefined {
    for (const participant of this._participants) {
      if (participant.getId === participantId) {
        return participant;
      }
    }
    return undefined;
  }

  /**
   * Fügt eine Sitzung zum Kurs hinzu.
   *
   * @param session Sitzung
   */
  addSession(session: Session) {
    if (this.getSession(session.getId) == undefined) {
      this._sessions.push(session);
    }
    this.update();
  }

  /**
   * Entfernt eine Sitzung aus dem Kurs.
   *
   * @param sessionId ID der Sitzung
   */
  removeSession(sessionId: string) {
    this._sessions.forEach((element: Session, index: number) => {
      if (element.getId === sessionId) {
        this._sessions.splice(index, 1);
      }
    });
    this.update();
  }

  /**
   * Gibt die Sitzung mit der übergebenen ID zurück.
   * Gibt undefined zurück, wenn die Sitzung im Kurs nicht gefunden wurde.
   *
   * @param sessionId ID der Sitzung
   */
  getSession(sessionId: string): Session | undefined {
    for (const session of this._sessions) {
      if (session.getId === sessionId) {
        return session;
      }
    }
    return undefined;
  }

  /**
   * Fügt eine Sitzordnung zum Kurs hinzu.
   *
   * @param seatArrangement Sitzordnung
   */
  addSeatArrangement(seatArrangement: SeatArrangement) {
    if (this.getSeatArrangement(seatArrangement.getId) == undefined) {
      this._seatArrangements.push(seatArrangement);
      if (!seatArrangement.isVisible()) {
        this._defaultArrangement = seatArrangement;
      }
    }
    this.update();
  }

  /**
   * Entfernt eine SItzordnung aus dem Kurs.
   *
   * @param arrangementId ID der Sitzordnung
   */
  removeSeatArrangement(arrangementId: string) {
    this.seatArrangements.forEach((element: SeatArrangement, index: number) => {
      if (element.getId === arrangementId) {
        this._seatArrangements.splice(index, 1);
        if (!element.isVisible()) {
          this._defaultArrangement = undefined;
        }
      }
    });
    this.update();
  }

  defaultArrangementIsUsed(id: string): boolean {
    return this._sessions.find(session => session.seatArrangement.getId === id) !== undefined;
  }

  hasArrangement(arrangementId: string): boolean {
    return this._seatArrangements.find(arr => arr.getId === arrangementId) !== undefined;
  }

  /**
   * Gibt die Sitzungordnung mit der übergebenen ID zurück.
   * Gibt undefined zurück, wenn die Sitzungordnung im Kurs nicht gefunden wurde.
   *
   * @param arrangementId ID der Sitzungordnung
   */
  getSeatArrangement(arrangementId: string): SeatArrangement | undefined {
    for (const arrangement of this._seatArrangements) {
      if (arrangement.getId === arrangementId) {
        return arrangement;
      }
    }
    return undefined;
  }

  get user(): User {
    return this._user;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }

  get subject(): string {
    return this._subject;
  }

  set subject(value: string) {
    this._subject = value;
    this.update();
  }

  get participants(): Participant[] {
    return this._participants;
  }

  set participants(value: Participant[]) {
    this._participants = value;
    this.update();
  }

  get sessions(): Session[] {
    return this._sessions;
  }

  set sessions(value: Session[]) {
    this._sessions = value;
    this.update();
  }

  get seatArrangements(): SeatArrangement[] {
    return this._seatArrangements;
  }

  set seatArrangements(value: SeatArrangement[]) {
    this._seatArrangements = value;
    this.update();
  }

  get defaultArrangement(): SeatArrangement | undefined {
    return this._defaultArrangement;
  }

  set defaultArrangement(value: SeatArrangement | undefined) {
    this._defaultArrangement = value;
    this.update();
  }
}
