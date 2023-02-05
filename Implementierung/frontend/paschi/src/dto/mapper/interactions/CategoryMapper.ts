import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Category} from "@/model/userdata/interactions/Category";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";

export class CategoryMapper implements IModelDtoMapper<Category, CategoryDto> {

  private static mapper: CategoryMapper = new CategoryMapper();

  private constructor() {
  }

  static getMapper(): CategoryMapper {
    return CategoryMapper.mapper;
  }

  dtoToModel(categoryDto: CategoryDto): Category {
    return undefined;
  }

  modelToDto(category: Category): CategoryDto {
    return undefined;
  }

}
