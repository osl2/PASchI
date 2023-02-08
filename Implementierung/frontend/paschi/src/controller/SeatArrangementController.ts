import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {useSeatArrangementStore} from "@/store/SeatArrangementStore";
import {UserController} from "@/controller/UserController";
import {Session} from "@/model/userdata/courses/Session";
import {useRoomStore} from "@/store/RoomStore";
import {useCourseStore} from "@/store/CourseStore";
import {useSessionStore} from "@/store/SessionStore";
import {useStudentStore} from "@/store/StudentStore";
import {Participant} from "@/model/userdata/interactions/Participant";

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
    return SeatArrangementController.controller;
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

  deleteSeatArrangement(id: string) {
    let arrangement = this.seatArrangementStore.getSeatArrangement(id);
    if (arrangement !== undefined) {
      arrangement.course.removeSeatArrangement(id);
      this.sessionStore.getAllSessions().forEach((session: Session) => {
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
