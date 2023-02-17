import {BaseService} from "@/service/BaseService";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";
import {CategoryMapper} from "@/dto/mapper/interactions/CategoryMapper";
import axios, {AxiosResponse} from "axios";
import {useUserStore} from "@/store/UserStore";

const CATEGORY_BASE_URL: string = 'http://193.196.37.141/api/category';

export class CategoryService extends BaseService<Category, CategoryDto> {

  private static categoryService: CategoryService = new CategoryService();
  private userStore = useUserStore();

  private constructor() {
    super(CategoryMapper.getMapper());
  }

  static getService(): CategoryService {
    return this.categoryService;
  }

  add(category: Category) {
    const token = this.userStore.getUser()?.token;
    const categoryDto = this.getMapper().modelToDto(category);
    axios.post(CATEGORY_BASE_URL, categoryDto, {
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  update(category: Category) {
    const token = this.userStore.getUser()?.token;
    const categoryDto = this.getMapper().modelToDto(category);
    axios.put(CATEGORY_BASE_URL, categoryDto, {
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  async getById(id: string): Promise<Category | undefined> {
    const token = this.userStore.getUser()?.token;
    let category;
    await axios.get(CATEGORY_BASE_URL + `/${id}`, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<CategoryDto>) => {
      category = this.getMapper().dtoToModel(response.data);
    }).catch((error) => {
      console.log(error);
    });

    if (category != undefined) {
      return category;
    } else {
      return undefined;
    }
  }

  async getAll(): Promise<Category[]> {
    const token = this.userStore.getUser()?.token;
    let categories: Category[] = [];
    await axios.get(CATEGORY_BASE_URL, {
      headers: {
        'Authorization': token
      }
    }).then((response: AxiosResponse<CategoryDto[]>) => {
      response.data.forEach((categoryDto: CategoryDto) => {
        categories.push(this.getMapper().dtoToModel(categoryDto));
      });
    }).catch((error) => {
      console.log(error);
    });

    return categories;
  }

  delete(id: string) {
    const token = this.userStore.getUser()?.token;
    axios.delete(CATEGORY_BASE_URL, {
      params: {
        id
      },
      headers: {
        'Authorization': token
      }
    }).catch((error) => {
      console.log(error);
    });
  }
}
