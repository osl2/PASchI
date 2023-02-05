import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";

export class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto> {

  private static mapper: ParticipantMapper = new ParticipantMapper();

  private constructor() {
  }

  static getMapper(): ParticipantMapper {
    return ParticipantMapper.mapper;
  }

  dtoToModel(d: ParticipantDto): Participant {
    return undefined;
  }

  modelToDto(e: Participant): ParticipantDto {
    return undefined;
  }

}
