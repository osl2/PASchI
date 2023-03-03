import {BASE_URL, BaseService} from "@/service/BaseService";
import { Session } from "@/model/userdata/courses/Session";
import { SessionDto } from "@/dto/userdata/courses/SessionDto";
import { SessionMapper } from "@/dto/mapper/courses/SessionMapper";
import axios, { AxiosResponse } from "axios";
import { useUserStore } from "@/store/UserStore";

const SESSION_BASE_URL: string = BASE_URL + "/api/session";

export class SessionService extends BaseService<Session, SessionDto> {

  private static sessionService: SessionService = new SessionService();

  private constructor() {
    super(SessionMapper.getMapper());
  }

  static getService(): SessionService {
    return this.sessionService;
  }

  async add(session: Session) {
    const token = useUserStore().getUser()?.token;
    const sessionDto = this.getMapper().modelToDto(session);
    await axios
      .post(SESSION_BASE_URL, sessionDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<SessionDto>) => {
        session.setId = response.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async update(session: Session) {
    const token = useUserStore().getUser()?.token;
    const sessionDto = this.getMapper().modelToDto(session);
    await axios
      .put(SESSION_BASE_URL, sessionDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<SessionDto>) => {
        await this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getById(id: string): Promise<Session | undefined> {
    const token = useUserStore().getUser()?.token;
    let session;
    await axios
      .get(SESSION_BASE_URL + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<SessionDto>) => {
        session = await this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    if (session != undefined) {
      return session;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Session[]> {
    const token = useUserStore().getUser()?.token;
    let sessions: Session[] = [];
    await axios
      .get(SESSION_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<SessionDto[]>) => {
        for (const sessionDto of response.data) {
          sessions.push(await this.getMapper().dtoToModel(sessionDto));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return sessions;
  }

  async delete(id: string) {
    const token = useUserStore().getUser()?.token;
    await axios
      .delete(SESSION_BASE_URL, {
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
