import {Participant} from "@/model/userdata/interactions/Participant";
import {User} from "@/model/User";

export class Teacher extends Participant {

  constructor(id: string, user: User, firstName: string, lastName: string) {
    super(id, user, firstName, lastName);
  }
}
