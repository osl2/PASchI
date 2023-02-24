export class CategoryDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  name: string;

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, name: string) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.name = name;
  }
}
