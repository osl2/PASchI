import {Participant} from "@/model/userdata/interactions/Participant";
import {User} from "@/model/User";

export class Student extends Participant {

  constructor(id: string | undefined, localId: number, user: User, firstName: string, lastName: string) {
    super(id, localId, user, firstName, lastName);
  }
}
