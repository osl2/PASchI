import {BaseService} from "@/service/BaseService";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";

const PARTICIPANT_BASE_URL: string = "";

export class ParticipantService extends BaseService<Participant, ParticipantDto> {

  constructor() {
    super(PARTICIPANT_BASE_URL);
  }

  add(e: Participant) {
    super.add(e);
  }

  update(e: Participant) {
    super.update(e);
  }

  getById(id: string) {
    super.getById(id);
  }

  getAll() {
    super.getAll();
  }

  delete(id: string) {
    super.delete(id);
  }
}
