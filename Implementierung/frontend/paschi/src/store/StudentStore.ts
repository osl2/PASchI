import {defineStore} from "pinia";
import {Student} from "@/model/userdata/interactions/Student";

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [] as Student[],
    id: 0
  }),
  actions: {
    addStudent(student: Student) {
      this.students.push(student);
    },
    deleteStudent(id: string) {
      this.students.forEach((element, index) => {
        if (element.getId === id) {
          this.students.splice(index, 1);
        }
      });
    },
    getStudent(id: string): Student | undefined {
      this.students.forEach((element) => {
        if (element.getId === id) {
          return element;
        }
      });
      return undefined;
    },
    getAllStudents(): Student[] {
      // @ts-ignore
      return this.students;
    },
    getId(): number {
      return this.id++;
    }
  }
})
