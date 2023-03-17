import {User} from "@/model/User";
import {Quality} from "@/model/userdata/interactions/Quality";
import {DataObject} from "@/model/DataObject";

export class Category extends DataObject {

  private readonly _user: User;
  private _name: string;

  constructor(id: string | undefined, localId: number, user: User, name: string) {
    super(id, localId);
    this._user = user;
    this._name = name;
  }

  hasQuality(): boolean {
    return false;
  }

  getQuality(): Quality | undefined {
    return undefined;
  }

  get user(): User {
    return this._user;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }
}
