import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {UserController} from "@/controller/UserController";
import {RoomController} from "@/controller/RoomController";
import {CourseController} from "@/controller/CourseController";
import {SessionController} from "@/controller/SessionController";
import {Session} from "@/model/userdata/courses/Session";
import {StudentController} from "@/controller/StudentController";

// TODO: Backend Service einbinden
// TODO: Standard Sitzordnung
export class SeatArrangementController {

  private static controller: SeatArrangementController = new SeatArrangementController();
  private seatArrangementStore = useSeatArrangementStore();
  private userController = UserController.getUserController();
  private roomController = RoomController.getRoomController();
  private courseController = CourseController.getCourseController();
  private sessionController = SessionController.getSessionController();
  private studentController = StudentController.getStudentConroller();

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return SeatArrangementController.controller;
  }

  createSeatArrangement(name: string, roomId: string, courseId: string): string | undefined {
    let room = this.roomController.getRoom(roomId);
    let course = this.courseController.getCourse(courseId);
    if (room == undefined || course == undefined) {
      return undefined;
    }

    let arrangement = new SeatArrangement(undefined, this.seatArrangementStore.getNextId(),
      this.userController.getUser(), name, course, room);
    this.seatArrangementStore.addSeatArrangement(arrangement);

    return arrangement.getId;
  }

  deleteSeatArrangement(id: string) {
    let arrangement = this.seatArrangementStore.getSeatArrangement(id);
    if (arrangement !== undefined) {
      arrangement.course.removeSeatArrangement(id);
      this.sessionController.getAllSessions().forEach((session: Session) => {
        if (session.seatArrangement !== undefined && session.seatArrangement.getId === id) {
          session.seatArrangement = undefined;
        }
      });
    }
  }

  getSeatArrangement(id: string): SeatArrangement | undefined {
    return this.seatArrangementStore.getSeatArrangement(id);
  }

  getAllArrangements(): SeatArrangement[] {
    return this.seatArrangementStore.getAllSeatArrangements();
  }

  addMapping(arrangementId: string, chairId: string, studentId: string) {
    let arrangement = this.seatArrangementStore.getSeatArrangement(arrangementId);
    let student = this.studentController.getStudent(studentId);
    if (arrangement == undefined || student == undefined) {
      return undefined;
    }
    let chair = this.roomController.getRoomObject(arrangement.room.getId, chairId);
    if (chair == undefined) {
      return undefined;
    }

    arrangement.setSeat(chair, student);
  }

  deleteMapping(arrangementId: string, chairId: string) {
    let arrangement = this.seatArrangementStore.getSeatArrangement(arrangementId);
    if (arrangement !== undefined) {
      let chair = this.roomController.getRoomObject(arrangement.room.getId, chairId);
      if (chair !== undefined) {
        arrangement.removeSeat(chair);
      }
    }
  }
}
