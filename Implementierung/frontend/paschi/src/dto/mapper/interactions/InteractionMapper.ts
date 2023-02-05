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

  dtoToModel(interactionDto: InteractionDto): Interaction {
    return undefined;
  }

  modelToDto(interaction: Interaction): InteractionDto {
    return undefined;
  }

}
