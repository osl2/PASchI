import {Category} from "@/model/userdata/interactions/Category";
import {Quality} from "@/model/userdata/interactions/Quality";
import {User} from "@/model/User";

export class RatedCategory extends Category {

  private _quality: Quality;

  constructor(id: string | undefined, localId: number, user: User, name: string, quality: Quality) {
    super(id, localId, user, name);
    this._quality = quality;
  }

  hasQuality(): boolean {
    return true;
  }

  getQuality(): Quality | undefined {
    return this._quality;
  }

  set setQuality(quality: Quality) {
    this._quality = quality;
    this.update();
  }
}
