import {BaseService} from "@/service/BaseService";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";
import {SessionMapper} from "@/dto/mapper/courses/SessionMapper";
import axios from "axios";

// TODO: URL
const SESSION_BASE_URL: string = '';

export class SessionService extends BaseService<Session, SessionDto> {

  private static sessionService: SessionService = new SessionService();

  private constructor() {
    super(SessionMapper.getMapper());
  }

  static getService(): SessionService {
    return this.sessionService;
  }

  add(session: Session) {
    const sessionDto = this.getMapper().modelToDto(session);
    axios.post(SESSION_BASE_URL + '', sessionDto).then((response) => {
      // irgendwas
    });
  }

  update(session: Session) {
    const sessionDto = this.getMapper().modelToDto(session);
    axios.post(SESSION_BASE_URL + '', sessionDto).then((response) => {
      // irgendwas
    });
  }

  async getById(id: string): Promise<Session | undefined> {
    let session;
    await axios.get(SESSION_BASE_URL + '').then((response) => {
      session = this.getMapper().dtoToModel(response.data);
    });

    if (session != undefined) {
      return session;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Session[]> {
    let sessions: Session[] = [];
    axios.get(SESSION_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        sessions.push(this.getMapper().dtoToModel(course));
      });
    });

    return sessions;
  }

  delete(id: string) {
    axios.post(SESSION_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }
}
