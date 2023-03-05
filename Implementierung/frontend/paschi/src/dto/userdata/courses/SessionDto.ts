import {InteractionDto} from "@/dto/userdata/interactions/InteractionDto";

export class SessionDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  date: string;
  courseId: string;
  seatArrangementId: string;
  interactions: InteractionDto[];

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, name: string, date: string,
              courseId: string, seatArrangementId: string, interactionsDtos: InteractionDto[]) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
    this.date = date;
    this.courseId = courseId;
    this.seatArrangementId = seatArrangementId;
    this.interactions = interactionsDtos;
  }
}
