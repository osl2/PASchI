import {BASE_URL, BaseService} from "@/service/BaseService";
import { Participant } from "@/model/userdata/interactions/Participant";
import { ParticipantDto } from "@/dto/userdata/interactions/ParticipantDto";
import { ParticipantMapper } from "@/dto/mapper/interactions/ParticipantMapper";
import axios, { AxiosResponse } from "axios";
import { useUserStore } from "@/store/UserStore";

const PARTICIPANT_BASE_URL: string = BASE_URL + "/api/participant";

export class ParticipantService extends BaseService<Participant, ParticipantDto> {

  private static participantService: ParticipantService = new ParticipantService();

  private constructor() {
    super(ParticipantMapper.getMapper());
  }

  static getService(): ParticipantService {
    return this.participantService;
  }

  async add(participant: Participant) {
    const token = useUserStore().getUser()?.token;
    const participantDto = this.getMapper().modelToDto(participant);
    await axios
      .post(PARTICIPANT_BASE_URL, participantDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<ParticipantDto>) => {
        participant.setId = response.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async update(participant: Participant) {
    const token = useUserStore().getUser()?.token;
    const participantDto = this.getMapper().modelToDto(participant);
    await axios
      .put(PARTICIPANT_BASE_URL, participantDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getById(id: string): Promise<Participant | undefined> {
    const token = useUserStore().getUser()?.token;
    let participant;
    await axios
      .get(PARTICIPANT_BASE_URL + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<ParticipantDto>) => {
        participant = await this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
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
    await axios
      .get(PARTICIPANT_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<ParticipantDto[]>) => {
        response.data.forEach(async (participantDto: ParticipantDto) => {
          participants.push(await this.getMapper().dtoToModel(participantDto));
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return participants;
  }

  async delete(id: string) {
    const token = useUserStore().getUser()?.token;
    await axios
      .delete(PARTICIPANT_BASE_URL, {
        params: {
          id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
