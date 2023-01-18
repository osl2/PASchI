import {User} from "@/model/User";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Category} from "@/model/userdata/interactions/Category";

export class Interaction {

  id: number;
  user: User;
  timeStamp: string;
  fromParticipant: Participant;
  toParticipant: Participant;
  category: Category;

  constructor(id: number, user: User, timeStamp: string, fromParticipant: Participant, toParticipant: Participant,
              category: Category) {
    this.id = id;
    this.user = user;
    this.timeStamp = timeStamp;
    this.fromParticipant = fromParticipant;
    this.toParticipant = toParticipant;
    this.category = category;
  }
}
