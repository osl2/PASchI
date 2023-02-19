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

export class ParticipantMapper implements IModelDtoMapper<Participant, ParticipantDto> {

  private static mapper: ParticipantMapper = new ParticipantMapper();
  private userController = UserController.getUserController();

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

  dtoToModel(participantDto: ParticipantDto): Participant {
    let participant = useStudentStore().getStudent(participantDto.id);
    if (participant == undefined) {
      participant = new Student(
        participantDto.id,
        0,
        this.userController.getUser(),
        participantDto.firstName,
        participantDto.lastName
      )
      useStudentStore().addStudent(participant);
    } else if (participantDto.updatedAt <= participant.updatedAt && participantDto.createdAt >= participant.createdAt) {
      return participant;
    } else {
      participant.firstName = participantDto.firstName;
      participant.lastName = participantDto.lastName;
    }
    if (participantDto.createdAt < participant.createdAt) {
      participant.createdAt = participantDto.createdAt;
    }

    const courses: Course[] = [];
    const interactions: Interaction[] = [];

    participantDto.courseIds.forEach((id: string) => {
      let course = useCourseStore().getCourse(id);
      // if (course == undefined) {
      //   course = new Course(id, 0, this.userController.getUser(), "", "");
      //   this.courseStore.addCourse(course);
      // }
      // courses.push(course);
      if (course !== undefined) {
        courses.push(course);
      }
    });
    participantDto.interactionIds.forEach((id: string) => {
      let interaction = useInteractionStore().getInteraction(id);
      if (interaction !== undefined) {
        interactions.push(interaction);
      }
    });
    participant.courses = courses;
    participant.interactions = interactions;

    return participant;
  }
}
