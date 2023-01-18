import {defineStore} from "pinia";
import {Student} from "@/model/userdata/interactions/Student";

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [] as Student[]
  }),
  actions: {
    addStudent(student: Student) {

    },
    deleteStudent(id: string) {

    },
    getStudent(id: string): Student {

    },
    getAllStudents(): Student[] {

    }
  }
})
