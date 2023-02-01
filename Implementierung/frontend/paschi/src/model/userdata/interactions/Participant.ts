import {User} from "@/model/User";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";

export abstract class Participant {

  private id: string | undefined;
  private localId: number;
  user: User;
  firstName: string;
  lastName: string;
  courses: Course[];
  interactions: Interaction[];

  protected constructor(id: string | undefined, localId: number, user: User, firstName: string, lastName: string) {
    this.id = id;
    this.localId = localId;
    this.user = user;
    this.firstName = firstName;
    this.lastName = lastName;
    this.courses = [];
    this.interactions = [];
  }

  addCourse(course: Course) {
    if (this.getCourse(course.getId) == undefined) {
      this.courses.push(course);
    }
  }

  removeCourse(courseId: string) {
    this.courses.forEach((element: Course, index: number) => {
      if (element.getId === courseId) {
        this.courses.splice(index, 1);
      }
    });
  }

  getCourse(courseId: string): Course | undefined {
    for (let i = 0; i < this.courses.length; i++) {
      if (this.courses.at(i)?.getId === courseId) {
        return this.courses.at(i);
      }
    }

    return undefined;
  }

  addInteraction(interaction: Interaction) {
    if (this.getInteraction(interaction.getId) == undefined) {
      this.interactions.push(interaction);
    }
  }

  removeInteraction(interactionId: string) {
    this.interactions.forEach((element: Interaction, index: number) => {
      if (element.getId === interactionId) {
        this.interactions.splice(index, 1);
      }
    });
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
