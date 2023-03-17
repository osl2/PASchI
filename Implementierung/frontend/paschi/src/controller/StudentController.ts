import {Student} from "@/model/userdata/interactions/Student";
import {useStudentStore} from "@/store/ParticipantStore";
import {UserController} from "@/controller/UserController";
import {CourseController} from "@/controller/CourseController";
import {ParticipantService} from "@/service/ParticipantService";

/**
 * Steuert den Kontrollfluss für die Schülerverwaltung
 */
export class StudentController {

  private static controller: StudentController = new StudentController();
  private studentService = ParticipantService.getService();

  private constructor() {
  }

  static getStudentConroller(): StudentController {
    return this.controller;
  }

  /**
   * Erstellt einen neuen Schüler.
   *
   * @param firstName Vorname
   * @param lastName Nachname
   */
  async createStudent(firstName: string, lastName: string): Promise<string> {
    const student = new Student(
      undefined,
      useStudentStore().getNextId(),
      UserController.getUserController().getUser(),
      firstName,
      lastName
    );
    await this.studentService.add(student)
    return useStudentStore().addStudent(student);
  }

  /**
   * Aktualisiert die Daten eines Schüler.
   *
   * @param id ID des Schülers
   * @param firstName Vorname
   * @param lastName Nachname
   */
  async updateStudent(id: string, firstName: string, lastName: string) {
    const student = useStudentStore().getStudent(id);
    if (student) {
      student.firstName = firstName;
      student.lastName = lastName;
      await this.studentService.update(student);
    }
  }

  /**
   * Löscht einen Schüler.
   *
   * @param id ID des Schülers
   */
  async deleteStudent(id: string) {
    const student = useStudentStore().getStudent(id);
    if (student) {
      const courses = Array.from(student.courses);
      for (const course of courses) {
        await CourseController.getCourseController().removeStudentFromCourse(course.getId, id);
      }
      await this.studentService.delete(id);
      await this.studentService.getById(id);
    }
  }

  /**
   * Gibt den Schüler mit der übergebenen ID zurück.
   *
   * @param id ID des Schülers
   */
  getStudent(id: string): Student | undefined {
    return useStudentStore().getStudent(id);
  }

  /**
   * Gibt alle Schüler des Benutzers zurück.
   */
  getAllStudents(): Student[] {
    this.studentService.getAll().then();
    return useStudentStore().getAllStudents().filter(student => student.visible);
  }
}
