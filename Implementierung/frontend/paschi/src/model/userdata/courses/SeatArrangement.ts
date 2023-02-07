import {User} from "@/model/User";
import {RoomObject} from "@/model/userdata/rooms/RoomObject";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Course} from "@/model/userdata/courses/Course";
import {Room} from "@/model/userdata/rooms/Room";
import {DataObject} from "@/model/DataObject";

export class SeatArrangement extends DataObject {

  private readonly _user: User
  private _name: string;
  private readonly _seatMap: Map<RoomObject, Participant>;
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
}
