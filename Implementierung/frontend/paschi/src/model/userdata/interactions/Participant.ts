import {User} from "@/model/User";
import {Course} from "@/model/userdata/courses/Course";
import {Interaction} from "@/model/userdata/interactions/Interaction";
import {DataObject} from "@/model/DataObject";

export abstract class Participant extends DataObject {

  user: User;
  firstName: string;
  lastName: string;
  courses: Course[];
  interactions: Interaction[];

  protected constructor(id: string | undefined, localId: number, user: User, firstName: string, lastName: string) {
    super(id, localId);
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
      if (element.getId === courseId) {
        this.courses.splice(index, 1);
      }
    });
  }

  addInteraction(interaction: Interaction) {
    this.interactions.push(interaction);
  }

  removeInteraction(interactionId: string) {
    this.interactions.forEach((element, index) => {
      if (element.getId === interactionId) {
        this.interactions.splice(index, 1);
      }
    });
  }
}
