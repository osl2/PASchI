import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {UserController} from "@/controller/UserController";
import {Session} from "@/model/userdata/courses/Session";
import {useRoomStore} from "@/store/RoomStore";
import {useCourseStore} from "@/store/CourseStore";
import {useSessionStore} from "@/store/SessionStore";
import {useStudentStore} from "@/store/StudentStore";
import {Participant} from "@/model/userdata/interactions/Participant";
import {SeatArrangementService} from "@/service/SeatArrangementService";
import {CourseService} from "@/service/CourseService";
import {SessionService} from "@/service/SessionService";
import {RoomController} from "@/controller/RoomController";
import {RoomObjectUtilities} from "@/components/room/RoomObjectUtilities";
import {Chair} from "@/model/userdata/rooms/Chair";

/**
 * Steuert den Kontrollfluss für die Sitzordnungsveraltung
 */
export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();
  private userController = UserController.getUserController();
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
    let room = useRoomStore().getRoom(roomId);
    let course = useCourseStore().getCourse(courseId);
    if (room == undefined || course == undefined) {
      return undefined;
    }

    let arrangement = new SeatArrangement(
      undefined,
      useSeatArrangementStore().getNextId(),
      this.userController.getUser(),
      name,
      course,
      room
    );
    await this.arrangementService.add(arrangement);
    course.addSeatArrangement(arrangement);
    CourseService.getService().update(course).then();

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
    const interval = 2 * Math.PI / students.length + 1;

    for (let i = 0; i < students.length + 1; i++) {
      const x = center.x + radius * Math.cos(interval * i);
      const y = center.y + radius * Math.sin(interval * i);
      await roomController.addChair(roomId, x, y, 0);
    }
    // TODO: Entfernen wenn Backend richtige IDs übergibt
    await roomController.updateRoom(roomId);

    let arrangement = new SeatArrangement(
      undefined,
      useSeatArrangementStore().getNextId(),
      this.userController.getUser(),
      name,
      course,
      room
    );

    const chairs = roomController.getRoomObjects(roomId)?.filter((roomObject) => roomObject instanceof Chair);
    for (let i = 0; i < students.length; i++) {
      arrangement.setSeat(chairs![i], students[i]);
    }
    // TODO: Macht statistik kaputt
    //arrangement.setSeat(chairs![students.length], CourseController.getCourseController().getTeacher());

    await this.arrangementService.add(arrangement);
    return useSeatArrangementStore().addSeatArrangement(arrangement);
  }

  /**
   * Löscht eine Sitzordnung.
   *
   * @param id ID der Sitzordnung
   */
  async deleteSeatArrangement(id: string) {
    let arrangement = useSeatArrangementStore().getSeatArrangement(id);
    if (arrangement !== undefined) {
      arrangement.course.removeSeatArrangement(id);
      useSessionStore().getAllSessions().forEach((session: Session) => {
        if (session.seatArrangement !== undefined && session.seatArrangement.getId === id) {
          // TODO: copy
          session.seatArrangement = undefined;
          SessionService.getService().update(session);
        }
      });
      await this.arrangementService.delete(id);
      useSeatArrangementStore().deleteSeatArrangement(id);
      if (!arrangement.room.visible) {
        RoomController.getRoomController().deleteRoom(arrangement.room.getId).then();
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
    const arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement == undefined) {
      return undefined;
    }
    return arrangement.getAllStudents();
  }

  /**
   * Gibt alle Schüler zurück, die noch nicht in Sitzordnung zugewiesen sind.
   *
   * @param arrangementId ID der Sitzordnung
   */
  getStudentsNotAssigned(arrangementId: string): Participant[] | undefined {
    const arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement == undefined) {
      return undefined;
    }
    return arrangement.getStudentsNotAssigned();
  }

  /**
   * Mappt einen Teilnehmer auf einen Stuhl.
   *
   * @param arrangementId ID der Sitzordnung
   * @param chairId ID des Stuhls
   * @param participantId ID des Teilnehmers
   */
  addMapping(arrangementId: string, chairId: string, participantId: string) {
    let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    let participant = useStudentStore().getParticipant(participantId);
    if (arrangement == undefined || participant == undefined) {
      return undefined;
    }
    let chair = arrangement.room.getRoomObject(chairId);
    if (chair == undefined) {
      return undefined;
    }

    arrangement.setSeat(chair, participant);
    this.arrangementService.update(arrangement).then();
  }

  /**
   * Löscht eine Zuordnung von Schüler auf Stuhl.
   *
   * @param arrangementId ID der Sitzordnung
   * @param chairId ID des Stuhls
   */
  deleteMapping(arrangementId: string, chairId: string) {
    let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement !== undefined) {
      let chair = arrangement.room.getRoomObject(chairId);
      if (chair !== undefined) {
        arrangement.removeSeat(chair);
        this.arrangementService.update(arrangement).then();
      }
    }
  }
}
