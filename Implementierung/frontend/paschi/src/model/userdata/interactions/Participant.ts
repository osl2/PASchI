import {User} from "@/model/User";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {DataObject} from "@/model/DataObject";

export abstract class Participant extends DataObject {

  private readonly _user: User;
  private _firstName: string;
  private _lastName: string;
  private _courses: Course[];
  private _interactions: Interaction[];
  private _visible: boolean = true;

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
    for (const course of this._courses) {
      if (course.getId === courseId) {
        return course;
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

  get visible(): boolean {
    return this._visible;
  }

  set firstName(value: string) {
    this._firstName = value;
    this.update();
  }

  set lastName(value: string) {
    this._lastName = value;
    this.update();
  }

  set courses(value: Course[]) {
    this._courses = value;
    this.update();
  }

  set interactions(value: Interaction[]) {
    this._interactions = value;
    this.update();
  }

  set visible(value: boolean) {
    this._visible = value;
  }
}
