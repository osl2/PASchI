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

  private constructor() {
  }

  static getSeatArrangementController(): SeatArrangementController {
    return this.controller;
  }

  createSeatArrangement(name: string, roomId: string, courseId: string): string | undefined {
    let room = useRoomStore().getRoom(roomId);
    let course = useCourseStore().getCourse(courseId);
    if (room == undefined || course == undefined) {
      return undefined;
    }

    let arrangement = new SeatArrangement(undefined, useSeatArrangementStore().getNextId(),
      this.userController.getUser(), name, course, room);
    useSeatArrangementStore().addSeatArrangement(arrangement);
    course.addSeatArrangement(arrangement);

    return arrangement.getId;
  }

  deleteSeatArrangement(id: string) {
    let arrangement = useSeatArrangementStore().getSeatArrangement(id);
    if (arrangement !== undefined) {
      arrangement.course.removeSeatArrangement(id);
      useSessionStore().getAllSessions().forEach((session: Session) => {
        if (session.seatArrangement !== undefined && session.seatArrangement.getId === id) {
          session.seatArrangement = arrangement?.copy();
        }
      });
      useSeatArrangementStore().deleteSeatArrangement(id);
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
  }

  deleteMapping(arrangementId: string, chairId: string) {
    let arrangement = useSeatArrangementStore().getSeatArrangement(arrangementId);
    if (arrangement !== undefined) {
      let chair = arrangement.room.getRoomObject(chairId);
      if (chair !== undefined) {
        arrangement.removeSeat(chair);
      }
    }
  }
}
