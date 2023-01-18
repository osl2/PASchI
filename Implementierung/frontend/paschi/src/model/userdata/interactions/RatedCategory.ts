import {Category} from "@/model/userdata/interactions/Category";
import {Quality} from "@/model/userdata/interactions/Quality";
import {User} from "@/model/User";

export class RatedCategory extends Category {

  quality: Quality;

  constructor(id: string, user: User, name: string, quality: Quality) {
    super(id, user, name);
    this.quality = quality;
  }
}
