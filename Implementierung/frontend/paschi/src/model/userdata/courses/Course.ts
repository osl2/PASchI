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
    this.participants.push(participant);
  }

  removeParticipant(participantId: string) {
    this.participants.forEach((element, index) => {
      if (element.getId == participantId) {
        this.participants.splice(index, 1)
      }
    });
  }

  getParticipant(participantId: string): Participant | undefined {
    this.participants.forEach((participant: Participant) => {
      if (participant.getId === participantId) {
        return participant;
      }
    });

    return undefined;
  }

  addSession(session: Session) {
    this.sessions.push(session);
  }

  removeSession(sessionId: string) {
    this.sessions.forEach((element, index) => {
      if (element.getId == sessionId) {
        this.sessions.splice(index, 1);
      }
    });
  }

  addSeatArrangement(seatArrangement: SeatArrangement) {
    this.seatArrangements.push(seatArrangement);
  }

  removeSeatArrangement(arrangementId: string) {
    this.seatArrangements.forEach((element, index) => {
      if (element.getId === arrangementId) {
        this.seatArrangements.splice(index, 1);
      }
    });
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
