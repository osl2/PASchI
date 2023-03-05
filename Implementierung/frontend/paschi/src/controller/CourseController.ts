import {Course} from "@/model/userdata/courses/Course";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Session} from "@/model/userdata/courses/Session";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useCourseStore} from "@/store/CourseStore";
import {UserController} from "@/controller/UserController";
import {useStudentStore} from "@/store/StudentStore";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {SessionController} from "@/controller/SessionController";
import {SeatArrangementController} from "@/controller/SeatArrangementController";
import {CourseService} from "@/service/CourseService";
import {ParticipantService} from "@/service/ParticipantService";
import {SeatArrangementService} from "@/service/SeatArrangementService";
import {Teacher} from "@/model/userdata/interactions/Teacher";

export class CourseController {

  private static controller: CourseController = new CourseController();
  private courseService = CourseService.getService();

  private constructor() {
  }

  /**
   * Gibt eine Instanz des Kurscontrollers zurück.
   */
  static getCourseController(): CourseController {
    return this.controller;
  }

  /**
   * Erstellt einen neuen Kurs.
   *
   * @param name Name des Kurses.
   * @param subject Bezeichnung des Kursfachs.
   */
  async createCourse(name: string, subject: string): Promise<string> {
    const course = new Course(
      undefined,
      useCourseStore().getNextId(),
      UserController.getUserController().getUser(),
      name,
      subject
    );

    await this.courseService.add(course);
    return useCourseStore().addCourse(course);
  }

  /**
   * Aktualisiert die Kursdaten mit den eingegebenen Daten.
   *
   * @param courseId Id des zu aktualisierenden Kurses
   * @param name Neuer Kursname.
   * @param subject Neuer Kursfachname.
   */
  async updateCourse(courseId: string, name: string, subject: string) {
    const course = useCourseStore().getCourse(courseId);
    if (course) {
      course.name = name;
      course.subject = subject;
      await this.courseService.update(course).then();
    }
  }

  /**
   * Löscht einen Kurs.
   *
   * @param id Die id des zu löschenden Kurses.
   */
  async deleteCourse(id: string) {
    const course = useCourseStore().getCourse(id);
    if (course) {
      course.participants.forEach((student: Participant) => {
        student.removeCourse(id);
        ParticipantService.getService().update(student);
      });
      course.sessions.forEach((session: Session) => {
        SessionController.getSessionController().deleteSession(session.getId);
      });
      course.seatArrangements.forEach((arrangement: SeatArrangement) => {
        SeatArrangementController.getSeatArrangementController().deleteSeatArrangement(arrangement.getId);
      });
      await this.courseService.delete(id);
      useCourseStore().deleteCourse(id);
    }
  }

  /**
   * Gibt den zur id gehörenden Kurs zurück.
   *
   * @param id Id des Kurses.
   */
  getCourse(id: string): Course | undefined {
    return useCourseStore().getCourse(id);
  }

  /**
   * Gibt alle Kurse des Benutzers zurück.
   */
  getAllCourses(): Course[] {
    this.courseService.getAll().then();
    return useCourseStore().getAllCourses();
  }

  /**
   * Gibt die aktuellsten Kurse zurück.
   */
  getRecentCourses(): Course[] {
    const allCourses = useCourseStore().getAllCourses().sort((a: Course, b: Course) => {
      return (a.updatedAt <= b.updatedAt) ? 1 : -1;
    });

    const courses = [];
    const max = allCourses.length < 5 ? allCourses.length : 5;
    for (let i = 0; i < max; i++) {
      courses.push(allCourses[i]);
    }

    return courses;
  }

  /**
   * Gibt Schüler des Kurses zurück.
   *
   * @param courseId Id des Kurses.
   */
  getStudentsOfCourse(courseId: string): Participant[] | undefined {
    return useCourseStore().getCourse(courseId)?.participants;
  }

  /**
   * Gibt alle Schüler eines Benutzers zurück, die nicht in dem Kurs sind.
   *
   * @param courseId Die Kurs Id.
   */
  getStudentsNotInCourse(courseId: string): Participant[] | undefined {
    const course = useCourseStore().getCourse(courseId);
    if (course == undefined) {
      return undefined;
    }

    return useStudentStore().getAllStudents().filter(student => student.visible &&
      course?.getParticipant(student.getId) == undefined);
  }

  /**
   * Fügt einen Schüler zu einem Kurs hinzu.
   *
   * @param courseId Die Id des Kurses zurück.
   * @param studentId Die Id des Schülers.
   */
  addStudentToCourse(courseId: string, studentId: string) {
    const course = useCourseStore().getCourse(courseId);
    const student = useStudentStore().getStudent(studentId);
    if (course && student) {
      course.addParticipant(student);
      student.addCourse(course);
      ParticipantService.getService().update(student).then();
      this.courseService.update(course).then();
    }
  }

  /**
   * Entfernt Schüler aus dem Kurs.
   *
   * @param courseId Die Id des Kurses.
   * @param studentId Die Id des Schülers.
   */
  removeStudentFromCourse(courseId: string, studentId: string) {
    const course = useCourseStore().getCourse(courseId);
    const student = useStudentStore().getStudent(studentId);
    if (course && student) {
      course.removeParticipant(studentId);
      student.removeCourse(courseId);
      ParticipantService.getService().update(student).then();
      for (const arrangement of course.seatArrangements.filter(arrangement => arrangement.room.visible)) {
        arrangement.seatMap.forEach((student: Participant, chair: RoomObject) => {
          if (student.getId === studentId) {
            arrangement.removeSeat(chair);
            SeatArrangementService.getService().update(arrangement).then();
          }
        });
      }
      this.courseService.update(course).then();
    }
  }

  /**
   * Gibt Sessions eines Kurses zurück.
   *
   * @param courseId Die Id der Session.
   */
  getSessions(courseId: string): Session[] | undefined {
    return useCourseStore().getCourse(courseId)?.sessions;
  }

  /**
   * Löscht eine Session.
   *
   * @param courseId Die Id des Kurses.
   * @param sessionId Die Id der Session.
   */
  async deleteSession(courseId: string, sessionId: string) {
    await SessionController.getSessionController().deleteSession(sessionId);
  }

  /**
   * Gibt die Sitzordnungen eines Kurses zurück.
   *
   * @param courseId Die Id des Kurses.
   */
  getSeatArrangements(courseId: string): SeatArrangement[] | undefined {
    return useCourseStore().getCourse(courseId)?.seatArrangements.filter(arrangement => arrangement.room.visible);
  }

  /**
   * Gibt den Lehrer zurück.
   */
  getTeacher(): Teacher {
    return useStudentStore().getTeacher()!;
  }
}
