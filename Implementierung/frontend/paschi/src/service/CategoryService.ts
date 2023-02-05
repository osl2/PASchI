import {BaseService} from "@/service/BaseService";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";
import {CategoryMapper} from "@/dto/mapper/interactions/CategoryMapper";

const CATEGORY_BASE_URL: string = '';

export class CategoryService extends BaseService<Category, CategoryDto> {

  constructor() {
    super(CategoryMapper.getMapper());
  }

  add(e: Category) {
  }

  update(e: Category) {
  }

  getById(id: string): Category | undefined {
  }

  getAll(): Category[] {
  }

  delete(id: string) {
  }
}
