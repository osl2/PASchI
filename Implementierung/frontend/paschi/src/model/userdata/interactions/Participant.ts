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
    this.courses.push(course);
  }

  removeCourse(courseId: string) {
    this.courses.forEach((element, index) => {
      if (element.id === courseId) {
        this.courses.splice(index, 1);
      }
    });
  }

  addInteraction(interaction: Interaction) {
    this.interactions.push(interaction);
  }

  removeInteraction(interactionId: string) {
    this.interactions.forEach((element, index) => {
      if (element.id === interactionId) {
        this.interactions.splice(index, 1);
      }
    });
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
