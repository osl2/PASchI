import {Category} from "@/model/userdata/interactions/Category";
import {Quality} from "@/model/userdata/interactions/Quality";
import {User} from "@/model/User";

export class RatedCategory extends Category {

  quality: Quality;

  constructor(id: string | undefined, localId: number, user: User, name: string, quality: Quality) {
    super(id, localId, user, name);
    this.quality = quality;
  }

  hasQuality(): boolean {
    return true;
  }

  set setQuality(quality: Quality) {
    this.quality = quality;
  }
}
