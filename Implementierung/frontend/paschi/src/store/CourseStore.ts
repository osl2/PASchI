import {defineStore} from "pinia";
import {Course} from "@/model/userdata/courses/Course";

export const useCourseStore = defineStore('courses', {
  state: () => ({
    courses: [] as Course[]
  }),
  actions: {
    addCourse(course: Course) {
      this.courses.push(course);
    },
    deleteCourse(id: string) {
      this.courses.forEach((element, index) => {
        if (element.id === id) {
          this.courses.splice(index, 1);
        }
      });
    },
    getCourse(id: string): Course | undefined {
      this.courses.forEach((element) => {
        if (element.id === id) {
          return element;
        }
      });
      return undefined;
    },
    getAllCourses(): Course[] {
      return this.courses;
    }
  }
})
