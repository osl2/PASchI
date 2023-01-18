import {User} from "@/model/User";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Course} from "@/model/userdata/courses/Course";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";

export class Session {

  id: number;
  user: User;
  date: string;
  interactions: Interaction[];
  course: Course;
  seatArrangement: SeatArrangement;

  constructor(id: number, user: User, date: string, course: Course, seatArrangement: SeatArrangement) {
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

  removeInteraction(interactionId: number) {
    this.interactions.forEach((element, index) => {
      if (element.id == interactionId) {
        this.interactions.splice(index, 1);
      }
    });
  }
}
