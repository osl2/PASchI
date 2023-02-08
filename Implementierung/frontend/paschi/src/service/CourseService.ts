import {BaseService} from "@/service/BaseService";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";
import {CourseMapper} from "@/dto/mapper/courses/CourseMapper";
import axios from "axios";

// TODO: URL
const COURSE_BASE_URL: string = '';

export class CourseService extends BaseService<Course, CourseDto> {

  constructor() {
    super(CourseMapper.getMapper());
  }

  add(course: Course) {
    const courseDto = this.getMapper().modelToDto(course);
    axios.post(COURSE_BASE_URL + '', courseDto).then((response) => {
      // irgendwas
    });
  }

  update(course: Course) {
    const courseDto = this.getMapper().modelToDto(course);
    axios.put(COURSE_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }

  getById(id: string): Course | undefined {
    let courseDto;
    axios.get(COURSE_BASE_URL + '').then((response) => {
      courseDto = new CourseDto(
        response.data.id,
        response.data.userId,
        response.data.createdAt,
        response.data.updatedAt,
        response.data.name,
        response.data.subject,
        response.data.sessionIds,
        response.data.participantIds,
        response.data.seatArrangementIds
      );
    });

    if (courseDto != undefined) {
      return this.getMapper().dtoToModel(courseDto);
    }
    return undefined;
  }

  getAll(): Course[] {
    let courseDtos: CourseDto[] = [];
    let courses: Course[] = [];
    axios.get(COURSE_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        const courseDto = new CourseDto(
          course.id,
          course.userId,
          response.data.createdAt,
          response.data.updatedAt,
          course.name,
          course.subject,
          course.sessionIds,
          course.participantIds,
          course.seatArrangementIds
        );
        courseDtos.push(courseDto);
      });
    });

    courseDtos.forEach((courseDto: CourseDto) => {
      courses.push(this.getMapper().dtoToModel(courseDto));
    });

    return courses;
  }

  delete(id: string) {
    axios.delete(COURSE_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }
}
