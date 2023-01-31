import {BaseService} from "@/service/BaseService";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";

export class CategoryService extends BaseService<Category, CategoryDto> {

  private readonly CATEGORY_BASE_URL: string;

  constructor(base_url: string, CATEGORY_BASE_URL: string) {
    super(base_url);
    this.CATEGORY_BASE_URL = CATEGORY_BASE_URL;
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
