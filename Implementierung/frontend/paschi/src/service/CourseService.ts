import {BaseService} from "@/service/BaseService";
import {Course} from "@/model/userdata/courses/Course";
import {CourseDto} from "@/dto/userdata/courses/CourseDto";
import {CourseMapper} from "@/dto/mapper/courses/CourseMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const COURSE_BASE_URL: string = 'http://193.196.37.141/api/course';

export class CourseService extends BaseService<Course, CourseDto> {

  private static courseService: CourseService = new CourseService();

  private constructor() {
    super(CourseMapper.getMapper());
  }

  static getService(): CourseService {
    return this.courseService;
  }

  add(course: Course) {
    const token = useUserStore().getUser()?.token;
    const courseDto = this.getMapper().modelToDto(course);
    axios.post(COURSE_BASE_URL, courseDto, {
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  update(course: Course) {
    const token = useUserStore().getUser()?.token;
    const courseDto = this.getMapper().modelToDto(course);
    axios.put(COURSE_BASE_URL, courseDto, {
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<Course | undefined> {
    const token = useUserStore().getUser()?.token;
    let course;
    await axios.get(COURSE_BASE_URL + `/${id}`, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<CourseDto>) => {
      course = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (course != undefined) {
      return course;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Course[]> {
    const token = useUserStore().getUser()?.token;
    let courses: Course[] = [];
    await axios.get(COURSE_BASE_URL, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<CourseDto[]>) => {
      response.data.forEach((courseDto: CourseDto) => {
        courses.push(this.getMapper().dtoToModel(courseDto));
      });
    }).catch((error) => {
      console.log(error);
    });

    return courses;
  }

  delete(id: string) {
    const token = useUserStore().getUser()?.token;
    axios.delete(COURSE_BASE_URL, {
      params: {
        id
      },
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
