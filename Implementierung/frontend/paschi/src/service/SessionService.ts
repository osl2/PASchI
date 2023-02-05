import {BaseService} from "@/service/BaseService";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";

const SESSION_BASE_URL: string = '';

export class SessionService extends BaseService<Session, SessionDto> {

  constructor() {
    super(SessionMapper.getMapper());
  }

  add(e: Session) {
  }

  update(e: Session) {
  }

  getById(id: string): Session {
  }

  getAll(): Session[] {
  }

  delete(id: string) {
  }
}
