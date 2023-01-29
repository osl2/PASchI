import {User} from "@/model/User";
import {Quality} from "@/model/userdata/interactions/Quality";

export class Category {

  private id: string | undefined;
  private localId: number;
  user: User;
  name: string;

  constructor(id: string | undefined, localId: number, user: User, name: string) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.name = name;
  }

  hasQuality(): boolean {
    return false;
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

  set setQuality(quality: Quality) {
  }
}
