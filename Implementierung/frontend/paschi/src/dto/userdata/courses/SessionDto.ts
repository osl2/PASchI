export class SessionDto {

  id: string;
  userId: string;
  name: string;
  date: string;
  courseId: string;
  seatArrangementId: string;

  constructor(id: string, userId: string, name: string, date: string, courseId: string, seatArrangementId: string) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.date = date;
    this.courseId = courseId;
    this.seatArrangementId = seatArrangementId;
  }
}
