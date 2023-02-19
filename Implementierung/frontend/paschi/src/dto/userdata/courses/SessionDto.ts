export class SessionDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  date: string;
  interactionIds: string[]
  courseId: string;
  seatArrangementId: string | undefined;

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, name: string, date: string,
              intetactionIds: string[], courseId: string, seatArrangementId: string | undefined) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.date = date;
    this.interactionIds = intetactionIds;
    this.courseId = courseId;
    this.seatArrangementId = seatArrangementId;
  }
}
