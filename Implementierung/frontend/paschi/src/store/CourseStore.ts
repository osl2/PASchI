import {defineStore} from "pinia";
import {Course} from "@/model/userdata/courses/Course";

export const useCourseStore = defineStore('courses', {
  state: () => ({
    courses: [] as Course[]
  }),
  actions: {
    addCourse(course: Course) {

    },
    deleteCourse(id: string) {

    },
    getCourse(id: string): Course {

    },
    getAllCourses(): Course[] {

    }
  }
})
