import {BaseService} from "@/service/BaseService";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";

export class CourseService extends BaseService<Course, CourseDto> {

  private readonly COURSE_BASE_URL: string;

  constructor(base_url: string, COURSE_BASE_URL: string) {
    super(base_url);
    this.COURSE_BASE_URL = COURSE_BASE_URL;
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
