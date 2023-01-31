export class SeatArrangementDto {

  id: string;
  userId: string;
  name: string;
  seatMap: Map<string, string>;
  roomId: string;
  courseId: string;

  constructor(id: string, userId: string, name: string, seatMap: Map<string, string>, roomId: string, courseId: string) {
    this.id = id;
    this.userId = userId;
    this.name = name;
    this.seatMap = seatMap;
    this.roomId = roomId;
    this.courseId = courseId;
  }
}
