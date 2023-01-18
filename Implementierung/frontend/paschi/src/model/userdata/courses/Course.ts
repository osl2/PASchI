import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {User} from "@/model/User";

export class Course {

  id: number;
  user: User
  name: string;
  subject: string;
  participants: Participant[];
  sessions: Session[];
  seatArrangements: SeatArrangement[];

  constructor(id: number, user: User, name: string, subject: string) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.subject = subject;
    this.participants = [];
    this.sessions = [];
    this.seatArrangements = [];
  }

  addParticipant(participant: Participant): void {
    this.participants.push(participant);
  }

  removeParticipant(participantId: number): void {
    this.participants.forEach((element, index) => {
      if (element.id == participantId) {
        this.participants.splice(index, 1)
      }
    });
  }

  addSession(session: Session): void {
    this.sessions.push(session);
  }

  removeSession(sessionId: number): void {
    this.sessions.forEach((element, index) => {
      if (element.id == sessionId) {
        this.sessions.splice(index, 1);
      }
    });
  }

  addSeatArrangement(seatArrangement: SeatArrangement): void {
    this.seatArrangements.push(seatArrangement);
  }

  removeSeatArrangement(arrangementId: number) {
    this.seatArrangements.forEach((element, index) => {
      if (element.id == arrangementId) {
        this.seatArrangements.splice(index, 1);
      }
    });
  }

}
