import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {InteractionDto} from "@/dto/userdata/interactions/InteractionDto";

export class InteractionMapper implements IModelDtoMapper<Interaction, InteractionDto> {

  private static mapper: InteractionMapper = new InteractionMapper();

  private constructor() {
  }

  static getMapper(): InteractionMapper {
    return InteractionMapper.mapper;
  }

  dtoToModel(d: InteractionDto): Interaction {
    return undefined;
  }

  modelToDto(e: Interaction): InteractionDto {
    return undefined;
  }

}
