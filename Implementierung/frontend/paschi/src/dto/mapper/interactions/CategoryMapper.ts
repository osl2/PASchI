import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";
import {RatedCategoryMapper} from "@/dto/mapper/interactions/RatedCategoryMapper";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {RatedCategoryDto} from "@/dto/userdata/interactions/RatedCategoryDto";
import {useCategoryStore} from "@/store/CategoryStore";
import {UserController} from "@/controller/UserController";

export class CategoryMapper implements IModelDtoMapper<Category, CategoryDto> {

  private static mapper: CategoryMapper = new CategoryMapper();
  private ratedCategoryMapper = RatedCategoryMapper.getMapper();

  private constructor() {
  }

  static getMapper(): CategoryMapper {
    return CategoryMapper.mapper;
  }

  modelToDto(category: Category): CategoryDto {
    if (category instanceof RatedCategory) {
      return this.ratedCategoryMapper.modelToDto(<RatedCategory> category);
    }

    return new CategoryDto(
      category.getId,
      category.user.getId,
      category.createdAt,
      category.updatedAt,
      category.name
    );
  }

  async dtoToModel(categoryDto: CategoryDto): Promise<Category> {
    if ("quality" in categoryDto) {
      return this.ratedCategoryMapper.dtoToModel(<RatedCategoryDto> categoryDto);
    }

    const userController = UserController.getUserController();

    let category = useCategoryStore().getCategory(categoryDto.id);
    if (category == undefined) {
      category = new Category(
        categoryDto.id,
        0,
        userController.getUser(),
        categoryDto.name
      );
      category.createdAt = categoryDto.createdAt;
      category.updatedAt = categoryDto.updatedAt;
      useCategoryStore().addCategory(category);
    }

    category.name = categoryDto.name;
    return category;
  }
}
