import {User} from "@/model/User";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Category} from "@/model/userdata/interactions/Category";
import {DataObject} from "@/model/DataObject";

export class Interaction extends DataObject {

  user: User;
  timeStamp: string;
  fromParticipant: Participant;
  toParticipant: Participant;
  category: Category;

  constructor(id: string | undefined, localId: number, user: User, timeStamp: string, fromParticipant: Participant,
              toParticipant: Participant, category: Category) {
    super(id, localId);
    this.user = user;
    this.timeStamp = timeStamp;
    this.fromParticipant = fromParticipant;
    this.toParticipant = toParticipant;
    this.category = category;
  }
}
