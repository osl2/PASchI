import {ParticipantTypeDto} from "@/dto/userdata/interactions/ParticipantTypeDto";

export class ParticipantDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  firstName: string;
  lastName: string;
  participantType: ParticipantTypeDto;
  courseIds: string[];
  interactionIds: string[];
  visible: boolean;

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, firstName: string, lastName: string,
              participantType: ParticipantTypeDto, courseIds: string[], interactionIds: string[], visible: boolean) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantType = participantType;
    this.courseIds = courseIds;
    this.interactionIds = interactionIds;
    this.visible = visible;
  }
}
