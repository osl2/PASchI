export class SeatArrangementDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  seatMap: Map<string, string>;
  roomId: string;
  courseId: string;

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, name: string,
              seatMap: Map<string, string>, roomId: string, courseId: string) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.seatMap = seatMap;
    this.roomId = roomId;
    this.courseId = courseId;
  }
}
