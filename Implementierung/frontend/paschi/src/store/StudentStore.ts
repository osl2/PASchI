import {defineStore} from "pinia";
import {Student} from "@/model/userdata/interactions/Student";
import {Participant} from "@/model/userdata/interactions/Participant";

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [] as Student[],
    nextId: 0
  }),
  actions: {
    addStudent(student: Student): string {
      this.students.push(student);
      return student.getId;
    },
    deleteStudent(id: string) {
      this.students.forEach((element, index) => {
        if (element.id === id) {
          this.students.splice(index, 1);
        }
      });
    },
    getStudent(id: string): Student | undefined {
      let student: Student
      this.students.forEach((element) => {
        if (element.getId === id) {
          // @ts-ignore
          student = element;
        }
      });
      // @ts-ignore
      if (student !== undefined) {
        return student
      }
      return undefined;
    },
    getAllStudents(): Student[] {
      return this.students;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
