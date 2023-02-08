import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Course} from "@/model/userdata/courses/Course";
import {Room} from "@/model/userdata/rooms/Room";

export class SeatArrangement {

  private id: string | undefined;
  private localId: number;
  user: User
  name: string;
  seatMap: Map<RoomObject, Participant>;
  course: Course;
  room: Room;

  constructor(id: string | undefined, localId: number, user: User, name: string, course: Course, room: Room) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.name = name;
    this.seatMap = new Map<RoomObject, Participant>();
    this.course = course;
    this.room = room;
  }

  getParticipantForSeat(seat: RoomObject): Participant | undefined {
    return this.seatMap.get(seat);
  }

  setSeat(seat: RoomObject, participant: Participant) {
    this.seatMap.set(seat, participant);
  }

  removeSeat(seat: RoomObject) {
    this.seatMap.delete(seat);
  }

  getAllStudents(): Participant[] {
    return this.course.participants;
  }

  getStudentsNotAssigned(): Participant[] {
    const students: Participant[] = [];
    this.getAllStudents().forEach((participant: Participant) => {
      let isAssigned = false;
      this.seatMap.forEach((student: Participant) => {
        if (participant.getId === student.getId) {
          isAssigned = true;
        }
      });

      if (!isAssigned) {
        students.push(participant);
      }
    });

    return students;
  }

  get getId(): string {
    if (this.id == undefined) {
      return this.localId.toString();
    }
    return this.id;
  }

  set setId(id: string) {
    this.id = id;
  }
}
