import {defineStore} from "pinia";
import {Student} from "@/model/userdata/interactions/Student";
import {Teacher} from "@/model/userdata/interactions/Teacher";
import {Participant} from "@/model/userdata/interactions/Participant";

export const useStudentStore = defineStore('students', {
  state: () => ({
    students: [] as Student[],
    teacher: undefined as Teacher | undefined,
    nextId: 0
  }),
  actions: {
    addStudent(student: Student): string {
      this.students.push(student);
      return student.getId;
    },
    deleteStudent(id: string) {
      this.students.forEach((element, index) => {
        if (element.getId === id) {
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
    getParticipant(id: string): Participant | undefined {
      if (this.teacher !== undefined && this.teacher.getId === id) {
        return <Participant> this.teacher;
      }

      return this.getStudent(id);
    },
    getAllStudents(): Student[] {
      // @ts-ignore
      return this.students;
    },
    getTeacher(): Teacher | undefined {
      // @ts-ignore
      return this.teacher;
    },
    setTeacher(teacher: Teacher) {
      this.teacher = teacher;
    },
    getNextId(): number {
      return this.nextId++;
    }
  }
})
