import {BaseService} from "@/service/BaseService";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";

const COURSE_BASE_URL: string = "";

export class CourseService extends BaseService<Course, CourseDto> {

  constructor() {
    super(COURSE_BASE_URL);
  }

  add(e: Course) {
    super.add(e);
  }

  update(e: Course) {
    super.update(e);
  }

  getById(id: string) {
    super.getById(id);
  }

  getAll() {
    super.getAll();
  }

  delete(id: string) {
    super.delete(id);
  }
}
