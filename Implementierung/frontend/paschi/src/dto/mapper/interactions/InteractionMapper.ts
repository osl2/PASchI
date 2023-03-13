import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {InteractionDto} from "@/dto/userdata/interactions/InteractionDto";
import {useInteractionStore} from "@/store/InteractionStore";
import {UserController} from "@/controller/UserController";
import {SessionService} from "@/service/SessionService";
import {ParticipantService} from "@/service/ParticipantService";
import {useSessionStore} from "@/store/SessionStore";
import {useStudentStore} from "@/store/ParticipantStore";
import {useCategoryStore} from "@/store/CategoryStore";
import {CategoryService} from "@/service/CategoryService";

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

  async dtoToModel(interactionDto: InteractionDto): Promise<Interaction> {
    const userController = UserController.getUserController();
    const sessionService = SessionService.getService();
    const participantService = ParticipantService.getService();
    const categoryService = CategoryService.getService();

    let session = useSessionStore().getSession(interactionDto.sessionId);
    let toParticipant = useStudentStore().getParticipant(interactionDto.toParticipantId);
    let fromParticipant = useStudentStore().getParticipant(interactionDto.fromParticipantId);
    let category = useCategoryStore().getCategory(interactionDto.categoryId);

    if (session === undefined) {
      session = await sessionService.getById(interactionDto.sessionId);
    }
    if (toParticipant === undefined) {
      toParticipant = await participantService.getById(interactionDto.toParticipantId);
    }
    if (fromParticipant === undefined) {
      fromParticipant = await participantService.getById(interactionDto.fromParticipantId);
    }
    if (category === undefined) {
      category = await categoryService.getById(interactionDto.categoryId);
    }

    let interaction = useInteractionStore().getInteractionByTimeCreatedAndSession(interactionDto.createdAt,
      interactionDto.sessionId);
    if (interaction == undefined) {
      interaction = new Interaction(
        interactionDto.id,
        0,
        userController.getUser(),
        interactionDto.timeStamp,
        session!,
        fromParticipant!,
        toParticipant!,
        category!
      );
      interaction.updatedAt = interactionDto.updatedAt;
      interaction.createdAt = interactionDto.createdAt;
      useInteractionStore().addInteraction(interaction);
    }

    interaction.setId = interactionDto.id;
    interaction.fromParticipant = fromParticipant!;
    interaction.toParticipant = toParticipant!;
    interaction.category = category!;
    return interaction;
  }
}
