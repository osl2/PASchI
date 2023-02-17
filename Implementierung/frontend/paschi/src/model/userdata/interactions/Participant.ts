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

  abstract isTeacher(): boolean;

  addCourse(course: Course) {
    if (this.getCourse(course.getId) == undefined) {
      this.courses.push(course);
    }
    this.update();
  }

  removeCourse(courseId: string) {
    this._courses.forEach((element: Course, index: number) => {
      if (element.getId === courseId) {
        this._courses.splice(index, 1);
      }
    });
    this.update();
  }

  getCourse(courseId: string): Course | undefined {
    for (let i = 0; i < this._courses.length; i++) {
      if (this._courses.at(i)?.getId === courseId) {
        return this._courses.at(i);
      }
    }

    return undefined;
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
