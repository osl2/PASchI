import {Category} from "@/model/userdata/interactions/Category";
import {Quality} from "@/model/userdata/interactions/Quality";

export class RatedCategory extends Category {

  quality: Quality;

  constructor(id: number, user: number, name: string, quality: Quality) {
    super(id, user, name);
    this.quality = quality;
  }
}
