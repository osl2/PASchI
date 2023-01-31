export class CourseDto {

  id: string;
  userId: string;
  name: string;
  subject: string;
  sessionIds: string[];
  participantIds: string[];
  seatArrangementIds: string[];

  constructor(id: string, userId: string, name: string, subject: string, sessionIds: string[],
              participantIds: string[], seatArrangementIds: string[]) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.subject = subject;
    this.sessionIds = sessionIds;
    this.participantIds = participantIds;
    this.seatArrangementIds = seatArrangementIds;
  }
}
