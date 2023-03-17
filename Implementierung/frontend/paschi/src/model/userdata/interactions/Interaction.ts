import {User} from "@/model/User";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Category} from "@/model/userdata/interactions/Category";
import {DataObject} from "@/model/DataObject";
import {Session} from "@/model/userdata/courses/Session";

export class Interaction extends DataObject {

  private readonly _user: User;
  private readonly _timeStamp: string;
  private readonly _session: Session;
  private _fromParticipant: Participant;
  private _toParticipant: Participant;
  private _category: Category;

  constructor(id: string | undefined, localId: number, user: User, timeStamp: string, session: Session,
              fromParticipant: Participant, toParticipant: Participant, category: Category) {
    super(id, localId);
    this._user = user;
    this._timeStamp = timeStamp;
    this._session = session;
    this._fromParticipant = fromParticipant;
    this._toParticipant = toParticipant;
    this._category = category;
  }

  get user(): User {
    return this._user;
  }

  get timeStamp(): string {
    return this._timeStamp;
  }

  get session(): Session {
    return this._session;
  }

  get fromParticipant(): Participant {
    return this._fromParticipant;
  }

  set fromParticipant(value: Participant) {
    this._fromParticipant = value;
    this.update();
  }

  get toParticipant(): Participant {
    return this._toParticipant;
  }

  set toParticipant(value: Participant) {
    this._toParticipant = value;
    this.update();
  }

  get category(): Category {
    return this._category;
  }

  set category(value: Category) {
    this._category = value;
    this.update();
  }
}
