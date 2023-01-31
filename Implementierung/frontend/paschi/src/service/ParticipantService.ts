import {BaseService} from "@/service/BaseService";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";

export class ParticipantService extends BaseService<Participant, ParticipantDto> {

  private static readonly PARTICIPANT_BASE_URL: string = "";

  constructor() {
    super(ParticipantService.PARTICIPANT_BASE_URL);
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
