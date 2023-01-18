import {User} from "@/model/User";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";

export abstract class Participant {

  id: number;
  user: User;
  firstName: string;
  lastName: string;
  courses: Course[];
  interactions: Interaction[];

  protected constructor(id: number, user: User, firstName: string, lastName: string) {
    this.id = id;
    this.user = user;
    this.firstName = firstName;
    this.lastName = lastName;
    this.courses = [];
    this.interactions = [];
  }

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  removeCourse(courseId: number): void {
    this.courses.forEach((element, index) => {
      if (element.id == courseId) {
        this.courses.splice(index, 1);
      }
    });
  }

  addInteraction(interaction: Interaction): void {
    this.interactions.push(interaction);
  }

  removeInteraction(interactionId: number): void {
    this.interactions.forEach((element, index) => {
      if (element.id == interactionId) {
        this.interactions.splice(index, 1);
      }
    });
  }
}
