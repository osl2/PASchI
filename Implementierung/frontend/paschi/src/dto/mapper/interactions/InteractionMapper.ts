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

  modelToDto(interaction: Interaction): InteractionDto {
    const sessionId = interaction.session.getId;
    const toParticipantId = interaction.toParticipant.getId;
    const fromParticipantId = interaction.fromParticipant.getId;
    const categoryId = interaction.category.getId;

    return new InteractionDto(
      interaction.getId,
      interaction.user.getId,
      interaction.createdAt,
      interaction.updatedAt,
      interaction.timeStamp,
      sessionId,
      toParticipantId,
      fromParticipantId,
      categoryId
    );
  }

  dtoToModel(interactionDto: InteractionDto): Interaction {
    return undefined;
  }
}
