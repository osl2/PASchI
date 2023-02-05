import {BaseService} from "@/service/BaseService";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";
import {CourseMapper} from "@/dto/mapper/courses/CourseMapper";

const COURSE_BASE_URL: string = '';

export class CourseService extends BaseService<Course, CourseDto> {

  constructor() {
    super(CourseMapper.getMapper());
  }

  add(e: Course) {
  }

  update(e: Course) {
  }

  getById(id: string): Course {
  }

  getAll(): Course[] {
  }

  delete(id: string) {
  }
}
