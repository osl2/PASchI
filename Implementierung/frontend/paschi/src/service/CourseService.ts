import {BASE_URL, BaseService} from "@/service/BaseService";
import { Course } from "@/model/userdata/courses/Course";
import { CourseDto } from "@/dto/userdata/courses/CourseDto";
import { CourseMapper } from "@/dto/mapper/courses/CourseMapper";
import axios, { AxiosResponse } from "axios";
import { useUserStore } from "@/store/UserStore";

const COURSE_BASE_URL: string = BASE_URL + "/api/course";

export class CourseService extends BaseService<Course, CourseDto> {

  private static courseService: CourseService = new CourseService();

  private constructor() {
    super(CourseMapper.getMapper());
  }

  static getService(): CourseService {
    return this.courseService;
  }

  async add(course: Course) {
    const token = useUserStore().getUser()?.token;
    const courseDto = this.getMapper().modelToDto(course);
    await axios
      .post(COURSE_BASE_URL, courseDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<CourseDto>) => {
        course.setId = response.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async update(course: Course) {
    const token = useUserStore().getUser()?.token;
    const courseDto = this.getMapper().modelToDto(course);
    await axios
      .put(COURSE_BASE_URL, courseDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getById(id: string): Promise<Course | undefined> {
    const token = useUserStore().getUser()?.token;
    let course;
    await axios
      .get(COURSE_BASE_URL + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<CourseDto>) => {
        course = this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
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
    await axios
      .get(COURSE_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<CourseDto[]>) => {
        response.data.forEach(async (courseDto: CourseDto) => {
          courses.push(await this.getMapper().dtoToModel(courseDto));
        });
      })
      .catch((error) => {
        console.log(error);
      });

    return courses;
  }

  async delete(id: string) {
    const token = useUserStore().getUser()?.token;
    await axios
      .delete(COURSE_BASE_URL, {
        params: {
          id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
