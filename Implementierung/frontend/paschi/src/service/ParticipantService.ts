import {BaseService} from "@/service/BaseService";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";

const PARTICIPANT_BASE_URL: string = '';

export class ParticipantService extends BaseService<Participant, ParticipantDto> {

  constructor() {
    super(ParticipantMapper.getMapper());
  }

  add(e: Participant) {
  }

  update(e: Participant) {
  }

  getById(id: string): Participant {
  }

  getAll(): Participant[] {
  }

  delete(id: string) {
  }
}
