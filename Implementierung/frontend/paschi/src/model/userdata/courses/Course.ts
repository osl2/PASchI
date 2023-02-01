import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {User} from "@/model/User";

export class Course {

  private id: string | undefined;
  private localId: number;
  user: User
  name: string;
  subject: string;
  participants: Participant[];
  sessions: Session[];
  seatArrangements: SeatArrangement[];

  constructor(id: string | undefined, localId: number, user: User, name: string, subject: string) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.name = name;
    this.subject = subject;
    this.participants = [];
    this.sessions = [];
    this.seatArrangements = [];
  }

  addParticipant(participant: Participant) {
    if (this.getParticipant(participant.getId) == undefined) {
      this.participants.push(participant);
    }
  }

  removeParticipant(participantId: string) {
    this.participants.forEach((element: Participant, index: number) => {
      if (element.getId === participantId) {
        this.participants.splice(index, 1)
      }
    });
  }

  getParticipant(participantId: string): Participant | undefined {
    for (let i = 0; i < this.participants.length; i++) {
      if (this.participants.at(i)?.getId === participantId) {
        return this.participants.at(i);
      }
    }

    return undefined;
  }

  addSession(session: Session) {
    if (this.getSession(session.getId) == undefined) {
      this.sessions.push(session);
    }
  }

  removeSession(sessionId: string) {
    this.sessions.forEach((element: Session, index: number) => {
      if (element.getId === sessionId) {
        this.sessions.splice(index, 1);
      }
    });
  }

  getSession(sessionId: string): Session | undefined {
    for (let i = 0; i < this.sessions.length; i++) {
      if (this.sessions.at(i)?.getId === sessionId) {
        return this.sessions.at(i);
      }
    }

    return undefined;
  }

  addSeatArrangement(seatArrangement: SeatArrangement) {
    if (this.getSeatArrangement(seatArrangement.getId) == undefined) {
      this.seatArrangements.push(seatArrangement);
    }
  }

  removeSeatArrangement(arrangementId: string) {
    this.seatArrangements.forEach((element: SeatArrangement, index: number) => {
      if (element.getId === arrangementId) {
        this.seatArrangements.splice(index, 1);
      }
    });
  }

  getSeatArrangement(arrangementId: string): SeatArrangement | undefined {
    for (let i = 0; i < this.seatArrangements.length; i++) {
      if (this.seatArrangements.at(i)?.getId === arrangementId) {
        return this.seatArrangements.at(i);
      }
    }

    return undefined;
  }

  get getId(): string {
    if (this.id == undefined) {
      return this.localId.toString();
    }
    return this.id;
  }

  set setId(id: string) {
    this.id = id;
  }
}
