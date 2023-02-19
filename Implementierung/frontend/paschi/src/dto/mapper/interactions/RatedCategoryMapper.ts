import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {RatedCategoryDto} from "@/dto/userdata/interactions/RatedCategoryDto";
import {QualityMapper} from "@/dto/mapper/interactions/QualityMapper";

export class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto> {

  private static mapper: RatedCategoryMapper = new RatedCategoryMapper();
  private qualityMapper = QualityMapper.getMapper();

  private constructor() {
  }

  static getMapper(): RatedCategoryMapper {
    return RatedCategoryMapper.mapper;
  }

  modelToDto(ratedCategory: RatedCategory): RatedCategoryDto {
    const qualityDto = this.qualityMapper.modelToDto(ratedCategory.quality);

    return new RatedCategoryDto(
      ratedCategory.getId,
      ratedCategory.user.getId,
      ratedCategory.createdAt,
      ratedCategory.updatedAt,
      ratedCategory.name,
      qualityDto
    );
  }

  dtoToModel(ratedCategoryDto: RatedCategoryDto): RatedCategory {
    return undefined;
  }
}
