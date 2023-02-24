import {Participant} from "@/model/userdata/interactions/Participant";
import {User} from "@/model/User";
import {UserController} from "@/controller/UserController";
import {useStudentStore} from "@/store/StudentStore";

export class Teacher extends Participant {

  private static userController = UserController.getUserController();

  private constructor(id: string | undefined, localId: number, user: User, firstName: string, lastName: string) {
    super(id, localId, user, firstName, lastName);
  }

  static getTeacher(): Teacher {
    const user = this.userController.getUser();
    let teacher = useStudentStore().getTeacher();
    if (teacher == undefined) {
      teacher = new Teacher(
        undefined,
        useStudentStore().getNextId(),
        user,
        user.firstName,
        user.lastName
      );
      useStudentStore().setTeacher(teacher);
    }
    return teacher;
  }

  isTeacher(): boolean {
    return true;
  }
}
