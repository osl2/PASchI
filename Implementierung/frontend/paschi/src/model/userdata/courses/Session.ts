import {User} from "@/model/User";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {Course} from "@/model/userdata/courses/Course";
import {SeatArrangement} from "@/model/userdata/courses/SeatArrangement";
import {DataObject} from "@/model/DataObject";

export class Session extends DataObject {

  private readonly _user: User;
  private _name: string;
  private _date: string;
  private readonly _course: Course;
  private _interactions: Interaction[];
  private _undoInteractions: Interaction[];
  private _seatArrangement: SeatArrangement;

  constructor(id: string | undefined, localId: number, user: User, name: string, date: string, course: Course,
              seatArrangement: SeatArrangement) {
    super(id, localId);
    this._user = user;
    this._date = date;
    this._name = name;
    this._course = course;
    this._seatArrangement = seatArrangement;
    this._interactions = [];
    this._undoInteractions = [];
  }

  addInteraction(interaction: Interaction) {
    if (this.getInteraction(interaction.getId) == undefined) {
      this._interactions.push(interaction);
      this._undoInteractions = [];
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

  undoInteraction(): Interaction | undefined {
    const interaction = this.interactions.pop();
    if (interaction) {
      this._undoInteractions.push(interaction);
      this.update();
      return interaction;
    }

    return undefined;
  }

  redoInteraction(): Interaction | undefined {
    const interaction = this._undoInteractions.pop();
    if (interaction) {
      this.interactions.push(interaction);
      this.update();
      return interaction;
    }
    return undefined;
  }

  hasRedo(): boolean {
    return this._undoInteractions.length != 0;
  }

  hasUndo(): boolean {
    return this.interactions.length != 0;
  }

  getInteraction(interactionId: string): Interaction | undefined {
    for (const interaction of this._interactions) {
      if (interaction.getId === interactionId) {
        return interaction;
      }
    }
    return undefined;
  }

  get user(): User {
    return this._user;
  }

  get course(): Course {
    return this._course;
  }

  get name(): string {
    return this._name;
  }

  set name(value: string) {
    this._name = value;
    this.update();
  }

  get date(): string {
    return this._date;
  }

  set date(value: string) {
    this._date = value;
    this.update();
  }

  get interactions(): Interaction[] {
    return this._interactions;
  }

  set interactions(value: Interaction[]) {
    this._interactions = value;
    this.update();
  }

  get seatArrangement(): SeatArrangement {
    return this._seatArrangement;
  }

  set seatArrangement(value: SeatArrangement) {
    this._seatArrangement = value;
    this.update();
  }
}
