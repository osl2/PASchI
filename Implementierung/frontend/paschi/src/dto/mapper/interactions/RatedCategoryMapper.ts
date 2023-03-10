import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {RatedCategoryDto} from "@/dto/userdata/interactions/RatedCategoryDto";
import {QualityMapper} from "@/dto/mapper/interactions/QualityMapper";
import {UserController} from "@/controller/UserController";
import {useCategoryStore} from "@/store/CategoryStore";

export class RatedCategoryMapper implements IModelDtoMapper<RatedCategory, RatedCategoryDto> {

  private static mapper: RatedCategoryMapper = new RatedCategoryMapper();
  private qualityMapper = QualityMapper.getMapper();

  private constructor() {
  }

  static getMapper(): RatedCategoryMapper {
    return RatedCategoryMapper.mapper;
  }

  modelToDto(ratedCategory: RatedCategory): RatedCategoryDto {
    const qualityDto = this.qualityMapper.modelToDto(ratedCategory.getQuality()!);

    return new RatedCategoryDto(
      ratedCategory.getId,
      ratedCategory.user.getId,
      ratedCategory.createdAt,
      ratedCategory.updatedAt,
      ratedCategory.name,
      qualityDto
    );
  }

  async dtoToModel(ratedCategoryDto: RatedCategoryDto): Promise<RatedCategory> {
    const userController = UserController.getUserController();
    const quality = await this.qualityMapper.dtoToModel(ratedCategoryDto.quality);

    let category = <RatedCategory> useCategoryStore().getCategory(ratedCategoryDto.name);
    if (category == undefined) {
      category = new RatedCategory(
        ratedCategoryDto.id,
        0,
        userController.getUser(),
        ratedCategoryDto.name,
        quality
      );
      if (!useCategoryStore().hasName(ratedCategoryDto.name)) {
        useCategoryStore().addCategory(category);
      }
      useCategoryStore().addRatedCategory(category)
      category.createdAt = ratedCategoryDto.createdAt;
      category.updatedAt = ratedCategoryDto.updatedAt;
    }

    category.name = ratedCategoryDto.name;
    return category;
  }
}
