import {BASE_URL, BaseService} from "@/service/BaseService";
import { Category } from "@/model/userdata/interactions/Category";
import { CategoryDto } from "@/dto/userdata/interactions/CategoryDto";
import { CategoryMapper } from "@/dto/mapper/interactions/CategoryMapper";
import axios, { AxiosResponse } from "axios";
import { useUserStore } from "@/store/UserStore";

const CATEGORY_BASE_URL: string = BASE_URL + "/api/category";

export class CategoryService extends BaseService<Category, CategoryDto> {

  private static categoryService: CategoryService = new CategoryService();

  private constructor() {
    super(CategoryMapper.getMapper());
  }

  static getService(): CategoryService {
    return this.categoryService;
  }

  async add(category: Category) {
    const token = useUserStore().getUser()?.token;
    const categoryDto = this.getMapper().modelToDto(category);
    await axios
      .post(CATEGORY_BASE_URL, categoryDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response: AxiosResponse<CategoryDto>) => {
        category.setId = response.data.id;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async update(category: Category) {
    const token = useUserStore().getUser()?.token;
    const categoryDto = this.getMapper().modelToDto(category);
    await axios
      .put(CATEGORY_BASE_URL, categoryDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async getById(id: string): Promise<Category | undefined> {
    const token = useUserStore().getUser()?.token;
    let category;
    await axios
      .get(CATEGORY_BASE_URL + `/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<CategoryDto>) => {
        category = await this.getMapper().dtoToModel(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    return category;
  }

  async getAll(): Promise<Category[]> {
    const token = useUserStore().getUser()?.token;
    const categories: Category[] = [];
    await axios
      .get(CATEGORY_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(async (response: AxiosResponse<CategoryDto[]>) => {
        for (const categoryDto of response.data) {
          categories.push(await this.getMapper().dtoToModel(categoryDto));
        }
      })
      .catch((error) => {
        console.log(error);
      });

    return categories;
  }

  async delete(id: string) {
    const token = useUserStore().getUser()?.token;
    await axios
      .delete(CATEGORY_BASE_URL, {
        params: {
          id,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
