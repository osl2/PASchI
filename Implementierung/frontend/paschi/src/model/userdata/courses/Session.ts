import {User} from "@/model/User";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Course} from "@/model/userdata/courses/Course";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";

export class Session {

  private id: string | undefined;
  private localId: number;
  user: User;
  name: string;
  date: string;
  interactions: Interaction[];
  course: Course;
  seatArrangement: SeatArrangement | undefined;

  constructor(id: string | undefined, localId: number, user: User, name: string, date: string, course: Course,
              seatArrangement: SeatArrangement | undefined) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.date = date;
    this.name = name;
    this.course = course;
    this.seatArrangement = seatArrangement;
    this.interactions = [];
  }

  addInteraction(interaction: Interaction) {
    this.interactions.push(interaction);
  }

  removeInteraction(interactionId: string) {
    this.interactions.forEach((element, index) => {
      if (element.getId == interactionId) {
        this.interactions.splice(index, 1);
      }
    });
  }

  getInteraction(interactionId: string): Interaction | undefined {
    this.interactions.forEach((element: Interaction) => {
      if (element.getId == interactionId) {
        return element;
      }
    });

    return undefined;
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
