import {User} from "@/model/User";
import {Participant} from "@/model/userdata/interactions/Participant";
import {Category} from "@/model/userdata/interactions/Category";

export class Interaction {

  private id: string | undefined;
  private localId: number;
  user: User;
  timeStamp: string;
  fromParticipant: Participant;
  toParticipant: Participant;
  category: Category;

  constructor(id: string | undefined, localId: number, user: User, timeStamp: string, fromParticipant: Participant,
              toParticipant: Participant, category: Category) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.timeStamp = timeStamp;
    this.fromParticipant = fromParticipant;
    this.toParticipant = toParticipant;
    this.category = category;
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
}
