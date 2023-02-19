import {BaseService} from "@/service/BaseService";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";
import {ParticipantMapper} from "@/dto/mapper/interactions/ParticipantMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const PARTICIPANT_BASE_URL: string = 'http://193.196.37.141/api/participant';

export class ParticipantService extends BaseService<Participant, ParticipantDto> {

  private static participantService: ParticipantService = new ParticipantService();

  private constructor() {
    super(ParticipantMapper.getMapper());
  }

  static getService(): ParticipantService {
    return this.participantService;
  }

  add(participant: Participant) {
    const token = useUserStore().getUser()?.token;
    const participantDto = this.getMapper().modelToDto(participant);
    axios.post(PARTICIPANT_BASE_URL, participantDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  update(participant: Participant) {
    const token = useUserStore().getUser()?.token;
    const participantDto = this.getMapper().modelToDto(participant);
    axios.put(PARTICIPANT_BASE_URL, participantDto, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<Participant | undefined> {
    const token = useUserStore().getUser()?.token;
    let participant;
    await axios.get(PARTICIPANT_BASE_URL + `/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response: AxiosResponse<ParticipantDto>) => {
      participant = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (participant != undefined) {
      return participant;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Participant[]> {
    const token = useUserStore().getUser()?.token;
    let participants: Participant[] = [];
    await axios.get(PARTICIPANT_BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then((response: AxiosResponse<ParticipantDto[]>) => {
      response.data.forEach((participantDto: ParticipantDto) => {
        participants.push(this.getMapper().dtoToModel(participantDto));
      });
    }).catch((error) => {
      console.log(error);
    });

    return participants;
  }

  delete(id: string) {
    const token = useUserStore().getUser()?.token;
    axios.delete(PARTICIPANT_BASE_URL, {
      params: {
        id
      },
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
