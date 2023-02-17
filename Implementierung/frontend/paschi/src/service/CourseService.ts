import {BaseService} from "@/service/BaseService";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";
import {CourseMapper} from "@/dto/mapper/courses/CourseMapper";
import axios from "axios";

// TODO: URL
const COURSE_BASE_URL: string = '';

export class CourseService extends BaseService<Course, CourseDto> {

  private static courseService: CourseService = new CourseService();

  private constructor() {
    super(CourseMapper.getMapper());
  }

  static getService(): CourseService {
    return this.courseService;
  }

  add(course: Course) {
    const courseDto = this.getMapper().modelToDto(course);
    axios.post(COURSE_BASE_URL + '', courseDto).then((response) => {
      // irgendwas
    });
  }

  update(course: Course) {
    const courseDto = this.getMapper().modelToDto(course);
    axios.put(COURSE_BASE_URL + '', courseDto).then((response) => {
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

  async getAll(): Promise<Course[]> {
    let courses: Course[] = [];
    axios.get(COURSE_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        courses.push(this.getMapper().dtoToModel(course));
      });
    });

    return courses;
  }

  delete(id: string) {
    axios.delete(COURSE_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }
}
