import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {UserController} from "@/controller/UserController";
import {useRoomStore} from "@/store/RoomStore";
import {useCourseStore} from "@/store/CourseStore";
import {useStudentStore} from "@/store/ParticipantStore";
import {Participant} from "@/model/userdata/interactions/Participant";
import {SeatArrangementService} from "@/service/SeatArrangementService";
import {CourseService} from "@/service/CourseService";
import {RoomController} from "@/controller/RoomController";
import {RoomObjectUtilities} from "@/components/room/RoomObjectUtilities";
import {Chair} from "@/model/userdata/rooms/Chair";
import {CourseController} from "@/controller/CourseController";
import {SessionService} from "@/service/SessionService";
import {useSessionStore} from "@/store/SessionStore";

/**
 * Steuert den Kontrollfluss für die Sitzordnungsveraltung
 */
export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();
  private arrangementService = SeatArrangementService.getService();

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return this.controller;
  }

  /**
   * Erstellt eine neue Sitzordnung.
   *
   * @param name Name
   * @param roomId ID des Raums
   * @param courseId ID des Kurses
   */
  async createSeatArrangement(name: string, roomId: string, courseId: string): Promise<string | undefined> {
    const room = useRoomStore().getRoom(roomId);
    const course = useCourseStore().getCourse(courseId);
    if (room == undefined || course == undefined) {
      return undefined;
    }

    const arrangement = new SeatArrangement(
      undefined,
      useSeatArrangementStore().getNextId(),
      UserController.getUserController().getUser(),
      name,
      course,
      room
    );
    await this.arrangementService.add(arrangement);
    course.addSeatArrangement(arrangement);
    await CourseService.getService().update(course);

    return useSeatArrangementStore().addSeatArrangement(arrangement);
  }

  /**
   * Erstellt die Standardsitzordnung.
   *
   * @param name Name
   * @param courseId ID des Kurses
   */
  async createAutomaticSeatArrangement(name: string, courseId: string): Promise<string | undefined> {
    const roomController = RoomController.getRoomController();
    const roomObjectUtilities = RoomObjectUtilities.getRoomObjectUtilities();

    const roomId = await roomController.createInvisibleRoom(name);
    const room = roomController.getRoom(roomId);
    const course = useCourseStore().getCourse(courseId);
    if (room == undefined || course == undefined) {
      return undefined;
    }

    const students = course.participants;

    const center = {x: roomObjectUtilities.roomWidth / 2, y: roomObjectUtilities.roomHeight / 2};
    const radius = roomObjectUtilities.roomHeight / 3;
    const interval = 2 * Math.PI / (students.length + 1);

    for (let i = 0; i < students.length + 1; i++) {
      const x = center.x + radius * Math.cos(interval * i);
      const y = center.y + radius * Math.sin(interval * i);
      roomController.addChair(roomId, x, y, 0);
    }
    await roomController.saveRoom(roomId);

    let arrangement = new SeatArrangement(
      undefined,
      useSeatArrangementStore().getNextId(),
      UserController.getUserController().getUser(),
      name,
      course,
      room
    );

    const chairs = roomController.getRoomObjects(roomId)?.filter((roomObject) => roomObject instanceof Chair);
    for (let i = 0; i < students.length; i++) {
      arrangement.setSeat(chairs![i], students[i]);
    }
    arrangement.setSeat(chairs![students.length], CourseController.getCourseController().getTeacher());

    await this.arrangementService.add(arrangement);
    course.addSeatArrangement(arrangement);
    await CourseService.getService().update(course);
    return useSeatArrangementStore().addSeatArrangement(arrangement);
  }

  /**
   * Löscht eine Sitzordnung.
   *
   * @param id ID der Sitzordnung
   */
  async deleteSeatArrangement(id: string) {
    const arrangement = useSeatArrangementStore().getSeatArrangement(id);
    if (arrangement) {
      arrangement.course.removeSeatArrangement(id);
      await CourseService.getService().update(arrangement.course);
      await this.arrangementService.delete(id);
      useSeatArrangementStore().deleteSeatArrangement(id);
      if (!arrangement.isVisible()) {
        await RoomController.getRoomController().deleteRoom(arrangement.room.getId);
      }
    }
  }

  /**
   * Gibt eine Sitzordnung zurück.
   *
   * @param id ID der Sitzordnung
   */
  getSeatArrangement(id: string): SeatArrangement | undefined {
    return useSeatArrangementStore().getSeatArrangement(id);
  }

  /**
   * Gibt alle Sitzordnungen zurück.
   */
  getAllArrangements(): SeatArrangement[] {
    return useSeatArrangementStore().getAllSeatArrangements();
  }

  /**
   * Gibt alle Schüler einer Sitzordnung zurück.
   *
   * @param arrangementId ID der Sitzordnung
   */
  getAllStudents(arrangementId: string): Participant[] | undefined {
    return useSeatArrangementStore().getSeatArrangement(arrangementId)?.getAllStudents();
  }

  /**
   * Gibt alle Schüler zurück, die noch nicht in Sitzordnung zugewiesen sind.
   *
   * @param arrangementId ID der Sitzordnung
   */
  getStudentsNotAssigned(arrangementId: string): Participant[] | undefined {
    return useSeatArrangementStore().getSeatArrangement(arrangementId)?.getStudentsNotAssigned();
  }

  teacherAssigned(arrangementId: string): boolean | undefined {
    const arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement == undefined) {
      return undefined;
    }
    for (const value of arrangement.seatMap) {
      if (value[1].isTeacher()) {
        return true;
      }
    }
    return false;
  }

  /**
   * Mappt einen Teilnehmer auf einen Stuhl.
   *
   * @param arrangementId ID der Sitzordnung
   * @param chairId ID des Stuhls
   * @param participantId ID des Teilnehmers
   */
  async addMapping(arrangementId: string, chairId: string, participantId: string) {
    const arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    const participant = useStudentStore().getParticipant(participantId);
    if (arrangement == undefined || participant == undefined) {
      return undefined;
    }
    const chair = arrangement.room.getRoomObject(chairId);
    if (chair == undefined) {
      return undefined;
    }

    await this.replaceSeatArrangement(arrangement);
    arrangement.setSeat(chair, participant);
    await this.arrangementService.update(arrangement);
  }

  /**
   * Löscht eine Zuordnung von Schüler auf Stuhl.
   *
   * @param arrangementId ID der Sitzordnung
   * @param chairId ID des Stuhls
   */
  async deleteMapping(arrangementId: string, chairId: string) {
    const arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement) {
      const chair = arrangement.room.getRoomObject(chairId);
      if (chair) {
        await this.replaceSeatArrangement(arrangement);
        arrangement.removeSeat(chair);
        await this.arrangementService.update(arrangement);
      }
    }
  }

  isUsed(id: string): boolean {
    return useSessionStore().getAllSessions().filter(session => session.seatArrangement.getId === id).length != 0;
  }

  private async replaceSeatArrangement(arr: SeatArrangement) {
    let newArrangement: SeatArrangement | undefined;
    const sessions = arr.course.sessions.filter(session => session.seatArrangement.getId === arr.getId);
    for (const session of sessions) {
      if (newArrangement == undefined) {
        newArrangement = await this.copySeatArrangement(arr);
      }
      if (newArrangement) {
        session.seatArrangement = newArrangement;
        await SessionService.getService().update(session);
      }
    }
  }

  async copySeatArrangement(arr: SeatArrangement): Promise<SeatArrangement> {
    const newArrangement = new SeatArrangement(
      undefined,
      useSeatArrangementStore().getNextId(),
      arr.user,
      arr.name,
      arr.course,
      arr.room
    );

    for (const value of arr.seatMap) {
      newArrangement.seatMap.set(value[0], value[1]);
    }

    await this.arrangementService.add(newArrangement);
    useSeatArrangementStore().addSeatArrangement(newArrangement);

    return newArrangement;
  }
}
