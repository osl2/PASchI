import {defineStore} from "pinia";
import {Student} from "@/model/userdata/interactions/Student";

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [] as Student[]
  }),
  actions: {
    addStudent(student: Student) {
      this.students.push(student);
    },
    deleteStudent(id: string) {
      this.students.forEach((element, index) => {
        if (element.id === id) {
          this.students.splice(index, 1);
        }
      });
    },
    getStudent(id: string): Student | undefined {
      this.students.forEach((element) => {
        if (element.id === id) {
          return element;
        }
      });
      return undefined;
    },
    getAllStudents(): Student[] {
      return this.students;
    }
  }
})
