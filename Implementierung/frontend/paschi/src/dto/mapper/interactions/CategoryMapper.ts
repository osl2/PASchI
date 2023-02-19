import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";
import {RatedCategoryMapper} from "@/dto/mapper/interactions/RatedCategoryMapper";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";

export class CategoryMapper implements IModelDtoMapper<Category, CategoryDto> {

  private static mapper: CategoryMapper = new CategoryMapper();

  private constructor() {
  }

  static getMapper(): CategoryMapper {
    return CategoryMapper.mapper;
  }

  modelToDto(category: Category): CategoryDto {
    if (category.hasQuality()) {
      return RatedCategoryMapper.getMapper().modelToDto(<RatedCategory> category);
    }

    return new CategoryDto(
      category.getId,
      category.user.getId,
      category.createdAt,
      category.updatedAt,
      category.name
    );
  }

  dtoToModel(categoryDto: CategoryDto): Category {
    return undefined;
  }
}
