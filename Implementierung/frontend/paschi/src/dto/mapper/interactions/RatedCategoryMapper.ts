import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {RatedCategoryDto} from "@/dto/userdata/interactions/RatedCategoryDto";

export class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto> {

  private static mapper: RatedCategoryMapper = new RatedCategoryMapper();

  private constructor() {
  }

  static getMapper(): RatedCategoryMapper {
    return RatedCategoryMapper.mapper;
  }

  dtoToModel(ratedCategoryDto: RatedCategoryDto): RatedCategory {
    return undefined;
  }

  modelToDto(ratedCategory: RatedCategory): RatedCategoryDto {
    return undefined;
  }

}
