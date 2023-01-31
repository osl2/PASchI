export class CourseDto {

  id: string | undefined;
  userId: string;
  name: string;
  subject: string;
  sessiondIds: string[];
  participantIds: string[];
  seatArrangementIds: string[];

  constructor(id: string | undefined, userId: string, name: string, subject: string, sessiondIds: string[],
              participantIds: string[], seatArrangementIds: string[]) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.subject = subject;
    this.sessiondIds = sessiondIds;
    this.participantIds = participantIds;
    this.seatArrangementIds = seatArrangementIds;
  }
}
