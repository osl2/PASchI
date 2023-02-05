import {BaseService} from "@/service/BaseService";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";

const SESSION_BASE_URL: string = "";

export class SessionService extends BaseService<Session, SessionDto> {

  constructor() {
    super(SESSION_BASE_URL);
  }

  add(e: Session) {
    super.add(e);
  }

  update(e: Session) {
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
