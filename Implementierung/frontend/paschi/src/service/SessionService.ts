import {BaseService} from "@/service/BaseService";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";
import {SessionMapper} from "@/dto/mapper/courses/SessionMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const SESSION_BASE_URL: string = 'http://193.196.37.141/api/session';

export class SessionService extends BaseService<Session, SessionDto> {

  private static sessionService: SessionService = new SessionService();
  private userStore = useUserStore();

  private constructor() {
    super(SessionMapper.getMapper());
  }

  static getService(): SessionService {
    return this.sessionService;
  }

  add(session: Session) {
    const sessionDto = this.getMapper().modelToDto(session);
    axios.post(SESSION_BASE_URL + '', sessionDto).catch((error) => {
      console.log(error);
    });
  }

  update(session: Session) {
    const token = this.userStore.getUser()?.token;
    const sessionDto = this.getMapper().modelToDto(session);
    axios.post(SESSION_BASE_URL, sessionDto, {
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<Session | undefined> {
    const token = this.userStore.getUser()?.token;
    let session;
    await axios.get(SESSION_BASE_URL + `/${id}`, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<SessionDto>) => {
      session = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (session != undefined) {
      return session;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Session[]> {
    const token = this.userStore.getUser()?.token;
    let sessions: Session[] = [];
    axios.get(SESSION_BASE_URL, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<SessionDto[]>) => {
      response.data.forEach((sessionDto: SessionDto) => {
        sessions.push(this.getMapper().dtoToModel(sessionDto));
      });
    }).catch((error) => {
      console.log(error);
    });

    return sessions;
  }

  delete(id: string) {
    const token = this.userStore.getUser()?.token;
    axios.post(SESSION_BASE_URL, {
      params: {
        id
      },
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
