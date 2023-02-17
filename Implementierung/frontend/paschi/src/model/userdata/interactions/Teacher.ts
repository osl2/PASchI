import {Participant} from "@/model/userdata/interactions/Participant";
import {User} from "@/model/User";
import {UserController} from "@/controller/UserController";
import {useStudentStore} from "@/store/StudentStore";

export class Teacher extends Participant {

  private static teacherStore = useStudentStore();
  private static userController = UserController.getUserController();

  private constructor(id: string | undefined, localId: number, user: User, firstName: string, lastName: string) {
    super(id, localId, user, firstName, lastName);
  }

  static getTeacher(): Teacher {
    const user = this.userController.getUser();
    let teacher = this.teacherStore.getTeacher();
    if (teacher == undefined) {
      teacher = new Teacher(
        undefined,
        this.teacherStore.getNextId(),
        user,
        user.firstName,
        user.lastName
      );
      this.teacherStore.setTeacher(teacher);
    }
    return teacher;
  }

  isTeacher(): boolean {
    return true;
  }
}
