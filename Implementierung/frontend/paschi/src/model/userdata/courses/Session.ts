import {User} from "@/model/User";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Course} from "@/model/userdata/courses/Course";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";

export class Session {

  id: string;
  user: User;
  date: string;
  interactions: Interaction[];
  course: Course;
  seatArrangement: SeatArrangement;

  constructor(id: string, user: User, date: string, course: Course, seatArrangement: SeatArrangement) {
    this.id = id;
    this.user = user;
    this.date = date;
    this.course = course;
    this.seatArrangement = seatArrangement;
    this.interactions = [];
  }

  addInteraction(interaction: Interaction) {
    this.interactions.push(interaction);
  }

  removeInteraction(interactionId: string) {
    this.interactions.forEach((element, index) => {
      if (element.id == interactionId) {
        this.interactions.splice(index, 1);
      }
    });
  }

  getInteraction(interactionId: string): Interaction | undefined {
    this.interactions.forEach((element, index) => {
      if (element.id == interactionId) {
        return element;
      }
    });

    return undefined;
  }
}
