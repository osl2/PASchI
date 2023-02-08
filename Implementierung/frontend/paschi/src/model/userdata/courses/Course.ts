import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {User} from "@/model/User";

export class Course extends DataObject {

  private readonly _user: User
  private _name: string;
  private _subject: string;
  private readonly _participants: Participant[];
  private readonly _sessions: Session[];
  private readonly _seatArrangements: SeatArrangement[];

  constructor(id: string | undefined, localId: number, user: User, name: string, subject: string) {
    super(id, localId);
    this._user = user;
    this._name = name;
    this._subject = subject;
    this._participants = [];
    this._sessions = [];
    this._seatArrangements = [];
  }

  addParticipant(participant: Participant) {
    if (this.getParticipant(participant.getId) == undefined) {
      this._participants.push(participant);
    }
    this.update();
  }

  removeParticipant(participantId: string) {
    this._participants.forEach((element: Participant, index: number) => {
      if (element.getId === participantId) {
        this._participants.splice(index, 1)
      }
    });
    this.update();
  }

  getParticipant(participantId: string): Participant | undefined {
    for (let i = 0; i < this._participants.length; i++) {
      if (this._participants.at(i)?.getId === participantId) {
        return this._participants.at(i);
      }
    });

    return undefined;
  }

  addSession(session: Session) {
    if (this.getSession(session.getId) == undefined) {
      this._sessions.push(session);
    }
    this.update();
  }

  removeSession(sessionId: string) {
    this._sessions.forEach((element: Session, index: number) => {
      if (element.getId === sessionId) {
        this._sessions.splice(index, 1);
      }
    });
    this.update();
  }

  getSession(sessionId: string): Session | undefined {
    for (let i = 0; i < this._sessions.length; i++) {
      if (this._sessions.at(i)?.getId === sessionId) {
        return this._sessions.at(i);
      }
    }

    return undefined;
  }

  addSeatArrangement(seatArrangement: SeatArrangement) {
    if (this.getSeatArrangement(seatArrangement.getId) == undefined) {
      this._seatArrangements.push(seatArrangement);
    }
    this.update();
  }

  removeSeatArrangement(arrangementId: string) {
    this.seatArrangements.forEach((element: SeatArrangement, index: number) => {
      if (element.getId === arrangementId) {
        this._seatArrangements.splice(index, 1);
      }
    });
    this.update();
  }

  get user(): User {
    return this._user;
  }

  get name(): string {
    return this._name;
  }

  getSeatArrangement(arrangementId: string): SeatArrangement | undefined {
    for (let i = 0; i < this._seatArrangements.length; i++) {
      if (this._seatArrangements.at(i)?.getId === arrangementId) {
        return this._seatArrangements.at(i);
      }
    }

    return undefined;
  }

  get subject(): string {
    return this._subject;
  }

  get participants(): Participant[] {
    return this._participants;
  }

  get sessions(): Session[] {
    return this._sessions;
  }

  get seatArrangements(): SeatArrangement[] {
    return this._seatArrangements;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }

  set subject(value: string) {
    this._subject = value;
    this.update();
  }
}
