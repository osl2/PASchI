import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Participant} from "@/model/userdata/interactions/Participant";
import {ParticipantDto} from "@/dto/userdata/interactions/ParticipantDto";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {UserController} from "@/controller/UserController";
import {ParticipantTypeDto} from "@/dto/userdata/interactions/ParticipantTypeDto";
import {CourseService} from "@/service/CourseService";
import {useCourseStore} from "@/store/CourseStore";
import {useInteractionStore} from "@/store/InteractionStore";

export class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto> {

  private static mapper: ParticipantMapper = new ParticipantMapper();
  private userController = UserController.getUserController();
  private courseService = CourseService.getService();
  private courseStore = useCourseStore();

  private constructor() {
  }

  static getMapper(): ParticipantMapper {
    return ParticipantMapper.mapper;
  }

  modelToDto(participant: Participant): ParticipantDto {
    const courseIds: string[] = [];
    const interactionIds: string[] = [];
    let particpantType;

    participant.courses.forEach((course: Course) => {courseIds.push(course.getId)});
    participant.interactions.forEach((interaction: Interaction) => {interactionIds.push(interaction.getId)});

    if (participant.isTeacher()) {
      particpantType = ParticipantTypeDto.TEACHER;
    } else {
      particpantType = ParticipantTypeDto.STUDENT;
    }

    return new ParticipantDto(
      participant.getId,
      this.userController.getUser().getId,
      participant.createdAt,
      participant.updatedAt,
      participant.firstName,
      participant.lastName,
      particpantType,
      courseIds,
      interactionIds
    );
  }

  dtoToModel(participantDto: ParticipantDto): Participant {
    const courses: Course[] = [];
    const interactions: Interaction[] = [];

    participantDto.courseIds.forEach((id: string) => {
      let course = this.courseStore.getCourse(id);
      if (course == undefined) {
        course = new Course(id, 0, this.userController.getUser(), "", "");
      }
      courses.push(course);
    });

    participantDto.interactionIds.forEach((interactionId: string) => {
      courses.forEach((course: Course) => {

      });
    });
  }
}
