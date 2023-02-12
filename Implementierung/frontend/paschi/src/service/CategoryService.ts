import {BaseService} from "@/service/BaseService";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";
import {CategoryMapper} from "@/dto/mapper/interactions/CategoryMapper";
import axios from "axios/index";

// TODO: URL
const CATEGORY_BASE_URL: string = '';

export class CategoryService extends BaseService<Category, CategoryDto> {

  constructor() {
    super(CategoryMapper.getMapper());
  }

  add(category: Category) {
    const categoryDto = this.getMapper().modelToDto(category);
    axios.post(CATEGORY_BASE_URL + '', categoryDto).then((response) => {
      // irgendwas
    });
  }

  update(category: Category) {
    const categoryDto = this.getMapper().modelToDto(category);
    axios.post(CATEGORY_BASE_URL + '', categoryDto).then((response) => {
      // irgendwas
    });
  }

  async getById(id: string): Promise<Category | undefined> {
    let category;
    await axios.get(CATEGORY_BASE_URL + '').then((response) => {
      category = this.getMapper().dtoToModel(response.data);
    });

    if (category != undefined) {
      return category;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Category[]> {
    let categories: Category[] = [];
    axios.get(CATEGORY_BASE_URL + '').then((response) => {
      response.data.forEach((course: any) => {
        categories.push(this.getMapper().dtoToModel(course));
      });
    });

    return categories;
  }

  delete(id: string) {
    axios.delete(CATEGORY_BASE_URL + '').then((response) => {
      // irgendwas
    });
  }
}
