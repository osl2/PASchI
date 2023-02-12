import {BaseService} from "@/service/BaseService";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";
import {CourseMapper} from "@/dto/mapper/courses/CourseMapper";
import axios from "axios";

// TODO: URL
const COURSE_BASE_URL: string = 'https://mocki.io/v1/9089aaa5-4243-4866-9e62-67d5763347e1';

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

  async getById(id: string): Promise<Course | undefined> {
    let course;
    await axios.get(COURSE_BASE_URL + '').then((response) => {
      course = this.getMapper().dtoToModel(response.data);
    });

    if (course != undefined) {
      return course;
    } else {
      return undefined;
    }
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
