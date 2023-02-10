import {User} from "@/model/User";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Course} from "@/model/userdata/courses/Course";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {DataObject} from "@/model/DataObject";

export class Session extends DataObject {

  private readonly _user: User;
  private _name: string;
  private _date: string;
  private readonly _interactions: Interaction[];
  undoInteractions: Interaction[];
  private readonly _course: Course;
  private _seatArrangement: SeatArrangement | undefined;

  constructor(id: string | undefined, localId: number, user: User, name: string, date: string, course: Course,
              seatArrangement: SeatArrangement | undefined) {
    super(id, localId);
    this._user = user;
    this._date = date;
    this._name = name;
    this._course = course;
    this._seatArrangement = seatArrangement;
    this._interactions = [];
    this.undoInteractions = [];
  }

  addInteraction(interaction: Interaction) {
    if (this.getInteraction(interaction.getId) == undefined) {
      this._interactions.push(interaction);
    }
    this.update();
  }

  removeInteraction(interactionId: string) {
    this._interactions.forEach((element: Interaction, index: number) => {
      if (element.getId === interactionId) {
        this._interactions.splice(index, 1);
      }
    });
    this.update();
  }

  undoInteraction() {
    let interaction = this.interactions.pop();
    if (interaction !== undefined) {
      this.undoInteractions.push();
    }
    this.update();
  }

  redoInteraction(): Interaction | undefined {
    let interaction = this.undoInteractions.pop();
    if (interaction !== undefined) {
      this.interactions.push(interaction);
      return interaction;
    }
    this.update();
    return undefined;
  }

  hasRedo(): boolean {
    return this.undoInteractions.length != 0;
  }

  hasUndo(): boolean {
    return this.interactions.length != 0;
  }

  getInteraction(interactionId: string): Interaction | undefined {
    for (let i = 0; i < this._interactions.length; i++) {
      if (this._interactions.at(i)?.getId === interactionId) {
        return this._interactions.at(i);
      }
    }

    return undefined;
  }

  get user(): User {
    return this._user;
  }

  get name(): string {
    return this._name;
  }

  get date(): string {
    return this._date;
  }

  get interactions(): Interaction[] {
    return this._interactions;
  }

  get course(): Course {
    return this._course;
  }

  get seatArrangement(): SeatArrangement | undefined {
    return this._seatArrangement;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }

  set date(value: string) {
    this._date = value;
    this.update();
  }

  set seatArrangement(value: SeatArrangement | undefined) {
    this._seatArrangement = value;
    this.update();
  }
}
