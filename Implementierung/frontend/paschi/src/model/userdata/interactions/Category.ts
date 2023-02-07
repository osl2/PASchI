import {User} from "@/model/User";
import {Quality} from "@/model/userdata/interactions/Quality";
import {DataObject} from "@/model/DataObject";

export class Category extends DataObject {

  user: User;
  name: string;

  constructor(id: string | undefined, localId: number, user: User, name: string) {
    super(id, localId);
    this.user = user;
    this.name = name;
  }

  hasQuality(): boolean {
    return false;
  }

  set setQuality(quality: Quality) {
  }

  getQuality(): Quality | undefined {
    return undefined;
  }
}
