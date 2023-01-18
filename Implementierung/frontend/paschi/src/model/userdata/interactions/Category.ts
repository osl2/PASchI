import {User} from "@/model/User";

export class Category {

  id: string;
  user: User;
  name: string;

  constructor(id: string, user: User, name: string) {
    this.id = id;
    this.user = user;
    this.name = name;
  }
}
