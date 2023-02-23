import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {UserController} from "@/controller/UserController";
import {Session} from "@/model/userdata/courses/Session";
import {useRoomStore} from "@/store/RoomStore";
import {useCourseStore} from "@/store/CourseStore";
import {useSessionStore} from "@/store/SessionStore";
import {useStudentStore} from "@/store/StudentStore";
import {Participant} from "@/model/userdata/interactions/Participant";
import {RoomController} from "@/controller/RoomController";
import {CourseController} from "@/controller/CourseController";
import {RoomObjectUtilities} from "@/components/room/RoomObjectUtilities";
import {Chair} from "@/model/userdata/rooms/Chair";

// TODO: Backend Service einbinden
// TODO: Standard Sitzordnung
export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();
  private userController = UserController.getUserController();
  private seatArrangementStore = useSeatArrangementStore();
  private roomStore = useRoomStore();
  private courseStore = useCourseStore();
  private sessionStore = useSessionStore();
  private studentStore = useStudentStore();

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return this.controller;
  }

  createSeatArrangement(name: string, roomId: string, courseId: string): string | undefined {
    let room = this.roomStore.getRoom(roomId);
    let course = this.courseStore.getCourse(courseId);
    if (room == undefined || course == undefined) {
      return undefined;
    }

    let arrangement = new SeatArrangement(undefined, this.seatArrangementStore.getNextId(),
      this.userController.getUser(), name, course, room);
    this.seatArrangementStore.addSeatArrangement(arrangement);
    course.addSeatArrangement(arrangement);

    return arrangement.getId;
  }

  createAutomaticSeatArrangement(name: string, courseId: string): string | undefined {
    const roomController = RoomController.getRoomController();
    const roomObjectUtilities = RoomObjectUtilities.getRoomObjectUtilities();
    let roomId = roomController.createRoom(name);
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
      roomController.addChair(roomId, x, y,0);
    }

    let arrangement = new SeatArrangement(undefined, this.seatArrangementStore.getNextId(),
      this.userController.getUser(), name, course, room);
    this.seatArrangementStore.addSeatArrangement(arrangement);
    course.addSeatArrangement(arrangement);

    const seatArrangementId = arrangement.getId;

    const chairs = roomController.getRoomObjects(roomId)?.filter((roomObject) =>  roomObject instanceof Chair);

    for (let i = 0; i < students.length; i++) {
      arrangement.setSeat(chairs![i], students[i]);
    }

    return seatArrangementId;
  }

  deleteSeatArrangement(id: string) {
    let arrangement = this.seatArrangementStore.getSeatArrangement(id);
    if (arrangement !== undefined) {
      arrangement.course.removeSeatArrangement(id);
      this.sessionStore.getAllSessions().forEach((session: Session) => {
        if (session.seatArrangement !== undefined && session.seatArrangement.getId === id) {
          session.seatArrangement = arrangement?.copy();
        }
      });
      this.seatArrangementStore.deleteSeatArrangement(id);
    }
  }

  getSeatArrangement(id: string): SeatArrangement | undefined {
    return this.seatArrangementStore.getSeatArrangement(id);
  }

  getAllArrangements(): SeatArrangement[] {
    return this.seatArrangementStore.getAllSeatArrangements();
  }

  getAllStudents(arrangementId: string): Participant[] | undefined {
    const arrangement = this.seatArrangementStore.getSeatArrangement(arrangementId);
    if (arrangement == undefined) {
      return undefined;
    }
    return arrangement.getAllStudents();
  }

  getStudentsNotAssigned(arrangementId: string): Participant[] | undefined {
    const arrangement = this.seatArrangementStore.getSeatArrangement(arrangementId);
    if (arrangement == undefined) {
      return undefined;
    }
    return arrangement.getStudentsNotAssigned();
  }

  addMapping(arrangementId: string, chairId: string, studentId: string) {
    let arrangement = this.seatArrangementStore.getSeatArrangement(arrangementId);
    let student = this.studentStore.getStudent(studentId);
    if (arrangement == undefined || student == undefined) {
      return undefined;
    }
    let chair = arrangement.room.getRoomObject(chairId);
    if (chair == undefined) {
      return undefined;
    }

    arrangement.setSeat(chair, student);
  }

  deleteMapping(arrangementId: string, chairId: string) {
    let arrangement = this.seatArrangementStore.getSeatArrangement(arrangementId);
    if (arrangement !== undefined) {
      let chair = arrangement.room.getRoomObject(chairId);
      if (chair !== undefined) {
        arrangement.removeSeat(chair);
      }
    }
  }
}
