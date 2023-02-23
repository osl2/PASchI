import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Course} from "@/model/userdata/courses/Course";
import {Room} from "@/model/userdata/rooms/Room";
import {DataObject} from "@/model/DataObject";

export class SeatArrangement extends DataObject {

  private readonly _user: User
  private _name: string;
  private _seatMap: Map<RoomObject, Participant>;
  private readonly _course: Course;
  private readonly _room: Room;

  constructor(id: string | undefined, localId: number, user: User, name: string, course: Course, room: Room) {
    super(id, localId);
    this._user = user;
    this._name = name;
    this._seatMap = new Map<RoomObject, Participant>();
    this._course = course;
    this._room = room;
  }

  getParticipantForSeat(seat: RoomObject): Participant | undefined {
    return this._seatMap.get(seat);
  }

  setSeat(seat: RoomObject, participant: Participant) {
    this._seatMap.set(seat, participant);
    this.update();
  }

  removeSeat(seat: RoomObject) {
    this._seatMap.delete(seat);
    this.update();
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

  get user(): User {
    return this._user;
  }

  get name(): string {
    return this._name;
  }

  get seatMap(): Map<RoomObject, Participant> {
    return this._seatMap;
  }

  get course(): Course {
    return this._course;
  }

  get room(): Room {
    return this._room;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }

  set seatMap(value: Map<RoomObject, Participant>) {
    this._seatMap = value;
  }

  copy(): SeatArrangement {
    const map: Map<RoomObject, Participant> = new Map<RoomObject, Participant>();
    this.seatMap.forEach((student: Participant, chair: RoomObject) => {
      map.set(chair.copy(), student);
    });

    const arr = new SeatArrangement(undefined, 0, this.user, this.name, this.course, this.room.copy());

    map.forEach((student: Participant, chair: RoomObject) => {
      arr.setSeat(chair, student);
      arr.room.addRoomObject(chair);
    });
    return arr;
  }
}
