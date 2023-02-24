import {Student} from "@/model/userdata/interactions/Student";
import {Course} from "@/model/userdata/courses/Course";
import {useStudentStore} from "@/store/StudentStore";
import {UserController} from "@/controller/UserController";
import {CourseController} from "@/controller/CourseController";
import {ParticipantService} from "@/service/ParticipantService";

export class StudentController {

  private static controller: StudentController = new StudentController();
  private userController = UserController.getUserController();
  private studentService = ParticipantService.getService();

  private constructor() {
  }

  static getStudentConroller(): StudentController {
    return this.controller;
  }

  async createStudent(firstName: string, lastName: string): Promise<string> {
    const student = new Student(
      undefined,
      useStudentStore().getNextId(),
      this.userController.getUser(),
      firstName,
      lastName
    );
    await this.studentService.add(student)
    return useStudentStore().addStudent(student);
  }

  async updateStudent(id: string, firstName: string, lastName: string) {
    let student = useStudentStore().getStudent(id);
    if (student !== undefined) {
      student.firstName = firstName;
      student.lastName = lastName;
      await this.studentService.update(student).then();
    }
  }

  async deleteStudent(id: string) {
    let student = useStudentStore().getStudent(id);
    if (student !== undefined) {
      student.courses.forEach((course: Course) => {
        CourseController.getCourseController().removeStudentFromCourse(course.getId, id);
      });
      await this.studentService.delete(id);
      useStudentStore().deleteStudent(id);
    }
  }

  getStudent(id: string): Student | undefined {
    return useStudentStore().getStudent(id);
  }

  getAllStudents(): Student[] {
    this.studentService.getAll().then();
    return useStudentStore().getAllStudents();
  }
}
