import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Session} from "@/model/userdata/courses/Session";
import {SessionDto} from "@/dto/userdata/courses/SessionDto";
import {UserController} from "@/controller/UserController";
import {CourseService} from "@/service/CourseService";
import {SeatArrangementService} from "@/service/SeatArrangementService";

export class SessionMapper implements IModelDtoMapper<Session, SessionDto> {

  private static mapper: SessionMapper = new SessionMapper();
  private userController = UserController.getUserController();
  private courseService = new CourseService();
  private arrangementService = new SeatArrangementService();

  private constructor() {
  }

  static getMapper(): SessionMapper {
    return SessionMapper.mapper;
  }

  modelToDto(e: Session): SessionDto {
    return undefined;
  }

  dtoToModel(d: SessionDto): Session {
    return undefined;
  }
}
