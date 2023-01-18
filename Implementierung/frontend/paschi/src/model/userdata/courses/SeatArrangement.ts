import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Course} from "@/model/userdata/courses/Course";
import {Room} from "@/model/userdata/rooms/Room";

export class SeatArrangement {

  id: number
  user: User
  name: string;
  seatMap: Map<RoomObject, Participant>;
  course: Course;
  room: Room;

  constructor(id: number, user: User, name: string, seatMap: Map<RoomObject, Participant>, course: Course, room: Room) {
    this.id = id;
    this.user = user;
    this.name = name;
    this.seatMap = seatMap;
    this.course = course;
    this.room = room;
  }

  getParticipantForSeat(seat: RoomObject): Participant | undefined {
    return this.seatMap.get(seat);
  }

  setSeat(seat: RoomObject, participant: Participant): void {
    this.seatMap.set(seat, participant);
  }
}
