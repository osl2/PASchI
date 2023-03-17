import {defineStore} from "pinia";
import {Course} from "@/model/userdata/courses/Course";

export const useCourseStore = defineStore('courses', {
  state: () => ({
    courses: [] as Course[],
    nextId: 0
  }),
  actions: {
    addCourse(course: Course): string {
      this.courses.push(course);
      return course.getId;
    },
    deleteCourse(id: string) {
      this.courses.forEach((element, index) => {
        if (element.getId === id) {
          this.courses.splice(index, 1);
        }
      });
    },
    getCourse(id: string): Course | undefined {
      for (const course of this.courses) {
        if (course.getId === id) {
          return <Course>course;
        }
      }
      return undefined;
    },
    getAllCourses(): Course[] {
      return <Course[]>this.courses;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
