import {User} from "@/model/User";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {DataObject} from "@/model/DataObject";

export abstract class Participant extends DataObject {

  private readonly _user: User;
  private _firstName: string;
  private _lastName: string;
  private readonly _courses: Course[];
  private readonly _interactions: Interaction[];

  protected constructor(id: string | undefined, localId: number, user: User, firstName: string, lastName: string) {
    super(id, localId);
    this._user = user;
    this._firstName = firstName;
    this._lastName = lastName;
    this._courses = [];
    this._interactions = [];
  }

  addCourse(course: Course) {
    this._courses.push(course);
    this.update();
  }

  removeCourse(courseId: string) {
    this._courses.forEach((element, index) => {
      if (element.getId === courseId) {
        this._courses.splice(index, 1);
      }
    });
    this.update();
  }

  addInteraction(interaction: Interaction) {
    this._interactions.push(interaction);
    this.update();
  }

  removeInteraction(interactionId: string) {
    this._interactions.forEach((element, index) => {
      if (element.getId === interactionId) {
        this._interactions.splice(index, 1);
      }
    });
    this.update();
  }

  get user(): User {
    return this._user;
  }

  get firstName(): string {
    return this._firstName;
  }

  get lastName(): string {
    return this._lastName;
  }

  get courses(): Course[] {
    return this._courses;
  }

  get interactions(): Interaction[] {
    return this._interactions;
  }

  set firstName(value: string) {
    this._firstName = value;
    this.update();
  }

  set lastName(value: string) {
    this._lastName = value;
    this.update();
  }
}
