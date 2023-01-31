import {BaseService} from "@/service/BaseService";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";

export class CategoryService extends BaseService<Category, CategoryDto> {

  private static readonly CATEGORY_BASE_URL: string = "";

  constructor() {
    super(CategoryService.CATEGORY_BASE_URL);
  }

  add(e: Category) {
    super.add(e);
  }

  update(e: Category) {
    super.update(e);
  }

  getById(id: string) {
    super.getById(id);
  }

  getAll() {
    super.getAll();
  }

  delete(id: string) {
    super.delete(id);
  }
}
