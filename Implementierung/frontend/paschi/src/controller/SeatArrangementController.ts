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
import {CourseController} from "@/controller/CourseController";
import {Chair} from "@/model/userdata/rooms/Chair";

export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();
  private userController = UserController.getUserController();
  private arrangementService = SeatArrangementService.getService();

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return this.controller;
  }

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

  async createAutomaticSeatArrangement(name: string, courseId: string): Promise<string | undefined> {
    const roomController = RoomController.getRoomController();
    const roomObjectUtilities = RoomObjectUtilities.getRoomObjectUtilities();
    let roomId = await roomController.createRoom(name);
    const room = roomController.getRoom(roomId);
    const course = CourseController.getCourseController().getCourse(courseId);
    if(room == undefined || course == undefined) {
      return undefined;
    }

    const students = CourseController.getCourseController().getStudentsOfCourse(courseId);

    if(!students) {
      return undefined;
    }

    const center = {x: roomObjectUtilities.roomWidth / 2, y: roomObjectUtilities.roomHeight / 2};
    const radius = roomObjectUtilities.roomHeight / 3;

    const interval = 2 * Math.PI / students.length;

    for (let i = 0; i < students.length; i++) {
      const x = center.x + radius * Math.cos(interval * i);
      const y = center.y + radius * Math.sin(interval * i);
      roomController.addChair(roomId, x, y,0).then();
    }

    let arrangement = new SeatArrangement(undefined, useSeatArrangementStore().getNextId(),
      this.userController.getUser(), name, course, room);
    useSeatArrangementStore().addSeatArrangement(arrangement);
    course.addSeatArrangement(arrangement);

    const seatArrangementId = arrangement.getId;

    const chairs = roomController.getRoomObjects(roomId)?.filter((roomObject) =>  roomObject instanceof Chair);

    for (let i = 0; i < students.length; i++) {
      arrangement.setSeat(chairs![i], students[i]);
    }

    return seatArrangementId;
  }

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
      useSeatArrangementStore().deleteSeatArrangement(id);
      await this.arrangementService.delete(id);
    }
  }

  getSeatArrangement(id: string): SeatArrangement | undefined {
    return useSeatArrangementStore().getSeatArrangement(id);
  }

  getAllArrangements(): SeatArrangement[] {
    return useSeatArrangementStore().getAllSeatArrangements();
  }

  getAllStudents(arrangementId: string): Participant[] | undefined {
    const arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement == undefined) {
      return undefined;
    }
    return arrangement.getAllStudents();
  }

  getStudentsNotAssigned(arrangementId: string): Participant[] | undefined {
    const arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement == undefined) {
      return undefined;
    }
    return arrangement.getStudentsNotAssigned();
  }

  addMapping(arrangementId: string, chairId: string, studentId: string) {
    let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    let student = useStudentStore().getStudent(studentId);
    if (arrangement == undefined || student == undefined) {
      return undefined;
    }
    let chair = arrangement.room.getRoomObject(chairId);
    if (chair == undefined) {
      return undefined;
    }

    arrangement.setSeat(chair, student);
    this.arrangementService.update(arrangement).then();
  }

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
