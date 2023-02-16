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
  undoInteractions: Interaction[];
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
    this.undoInteractions = [];
  }

  addInteraction(interaction: Interaction) {
    this.interactions.push(interaction);
  }

  removeInteraction(interactionId: string) {
    this.interactions.forEach((element: Interaction, index: number) => {
      if (element.getId === interactionId) {
        this.interactions.splice(index, 1);
      }
    });
  }

  undoInteraction() {
    let interaction = this.interactions.pop();
    if (interaction !== undefined) {
      this.undoInteractions.push(interaction);
    }
  }

  redoInteraction(): Interaction | undefined {
    let interaction = this.undoInteractions.pop();
    if (interaction !== undefined) {
      this.interactions.push(interaction);
      return interaction;
    }
    return undefined;
  }

  hasRedo(): boolean {
    return this.undoInteractions.length != 0;
  }

  hasUndo(): boolean {
    return this.interactions.length != 0;
  }

  getInteraction(interactionId: string): Interaction | undefined {
    for (let i = 0; i < this.interactions.length; i++) {
      if (this.interactions.at(i)?.getId === interactionId) {
        return this.interactions.at(i);
      }
    }

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
