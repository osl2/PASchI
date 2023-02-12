import {BaseService} from "@/service/BaseService";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";
import {ParticipantMapper} from "@/dto/mapper/interactions/ParticipantMapper";
import axios from "axios";

// TODO: URL
const PARTICIPANT_BASE_URL: string = '';

export class ParticipantService extends BaseService<Participant, ParticipantDto> {

  constructor() {
    super(ParticipantMapper.getMapper());
  }

  add(participant: Participant) {
    const participantDto = this.getMapper().modelToDto(participant);
    axios.post(PARTICIPANT_BASE_URL + '', participantDto).then((response) => {
      // irgendwas
    });
  }

  update(participant: Participant) {
    const participantDto = this.getMapper().modelToDto(participant);
    axios.post(PARTICIPANT_BASE_URL + '', participantDto).then((response) => {
      // irgendwas
    });
  }

  async getById(id: string): Promise<Participant | undefined> {
    let participant;
    await axios.get(PARTICIPANT_BASE_URL + '').then((response) => {
      participant = this.getMapper().dtoToModel(response.data);
    });

    if (participant != undefined) {
      return participant;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Participant[]> {
    let participants: Participant[] = [];
    axios.get(PARTICIPANT_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        participants.push(this.getMapper().dtoToModel(course));
      });
    });

    return participants;
  }

  delete(id: string) {
    axios.delete(PARTICIPANT_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }
}
