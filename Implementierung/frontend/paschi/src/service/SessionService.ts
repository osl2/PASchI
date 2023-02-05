import {BaseService} from "@/service/BaseService";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";
import {SessionMapper} from "@/dto/mapper/courses/SessionMapper";

const SESSION_BASE_URL: string = '';

export class SessionService extends BaseService<Session, SessionDto> {

  constructor() {
    super(SessionMapper.getMapper());
  }

  add(e: Session) {
  }

  update(e: Session) {
  }

  getById(id: string): Session | undefined {
  }

  getAll(): Session[] {
  }

  delete(id: string) {
  }
}
