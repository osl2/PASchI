import {ParticipantTypeDto} from "@/dto/userdata/interactions/ParticipantTypeDto";

export class ParticipantDto {

  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  participantType: ParticipantTypeDto;
  courseIds: string[];
  interactionIds: string[];

  constructor(id: string, userId: string, firstName: string, lastName: string, participantType: ParticipantTypeDto,
              courseIds: string[], interactionIds: string[]) {
    this.id = id;
    this.userId = userId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.participantType = participantType;
    this.courseIds = courseIds;
    this.interactionIds = interactionIds;
  }
}
