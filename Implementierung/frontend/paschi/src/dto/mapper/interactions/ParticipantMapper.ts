import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {UserController} from "@/controller/UserController";
import {ParticipantTypeDto} from "@/dto/userdata/interactions/ParticipantTypeDto";
import {useCourseStore} from "@/store/CourseStore";
import {useInteractionStore} from "@/store/InteractionStore";
import {useStudentStore} from "@/store/StudentStore";
import {Student} from "@/model/userdata/interactions/Student";
import {CourseService} from "@/service/CourseService";

export class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto> {

  private static mapper: ParticipantMapper = new ParticipantMapper();
  private userController = UserController.getUserController();
  private courseSerivce = CourseService.getService();

  private constructor() {
  }

  static getMapper(): ParticipantMapper {
    return ParticipantMapper.mapper;
  }

  modelToDto(participant: Participant): ParticipantDto {
    const courseIds: string[] = [];
    const interactionIds: string[] = [];
    let particpantType = participant.isTeacher() ? ParticipantTypeDto.TEACHER : ParticipantTypeDto.STUDENT;

    participant.courses.forEach((course: Course) => {
      courseIds.push(course.getId)
    });
    participant.interactions.forEach((interaction: Interaction) => {
      interactionIds.push(interaction.getId)
    });

    return new ParticipantDto(
      participant.getId,
      participant.user.getId,
      participant.createdAt,
      participant.updatedAt,
      participant.firstName,
      participant.lastName,
      particpantType,
      courseIds,
      interactionIds
    );
  }

  async dtoToModel(participantDto: ParticipantDto): Promise<Participant> {
    let participant = useStudentStore().getStudent(participantDto.id);
    if (participant == undefined) {
      participant = new Student(
        participantDto.id,
        0,
        this.userController.getUser(),
        participantDto.firstName,
        participantDto.lastName
      );
      participant.createdAt = participantDto.createdAt;
      participant.updatedAt = participantDto.updatedAt;
      useStudentStore().addStudent(participant);
    } else if (participant.updatedAt === participantDto.updatedAt) {
      return participant;
    } else {
      participant.firstName = participantDto.firstName;
      participant.lastName = participantDto.lastName;
    }

    const courses: Course[] = [];
    const interactions: Interaction[] = [];

    for (const id of participantDto.courseIds) {
      let course = useCourseStore().getCourse(id);
      if (course == undefined) {
        course = await this.courseSerivce.getById(id);
      }
      if (course !== undefined) {
        courses.push(course);
      }
    }

    for (const id of participantDto.interactionIds) {
      let interaction = useInteractionStore().getInteraction(id);
      if (interaction !== undefined) {
        interactions.push(interaction);
      }
    }

    participant.courses = courses;
    participant.interactions = interactions;

    return participant;
  }
}
