export class InteractionDto {

  id: string;
  userId: string;
  timeStamp: string;
  sessionId: string;
  toParticipantId: string;
  fromParticipantId: string;
  categoryId: string;

  constructor(id: string, userId: string, timeStamp: string, sessionId: string, toParticipantId: string, fromParticipantId: string, categoryId: string) {
    this.id = id;
    this.userId = userId;
    this.timeStamp = timeStamp;
    this.sessionId = sessionId;
    this.toParticipantId = toParticipantId;
    this.fromParticipantId = fromParticipantId;
    this.categoryId = categoryId;
  }
}
