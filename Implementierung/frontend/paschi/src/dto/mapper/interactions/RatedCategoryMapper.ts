import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {RatedCategory} from "@/model/userdata/interactions/RatedCategory";
import {RatedCategoryDto} from "@/dto/userdata/interactions/RatedCategoryDto";
import {QualityMapper} from "@/dto/mapper/interactions/QualityMapper";
import {UserController} from "@/controller/UserController";
import {useCategoryStore} from "@/store/CategoryStore";
import {Category} from "@/model/userdata/interactions/Category";

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

  async dtoToModel(ratedCategoryDto: RatedCategoryDto): Promise<RatedCategory> {
    const userController = UserController.getUserController();

    let category = <RatedCategory> useCategoryStore().getCategory(ratedCategoryDto.id);
    if (category == undefined) {
      category = new RatedCategory(
        ratedCategoryDto.id,
        0,
        userController.getUser(),
        ratedCategoryDto.name,
        await this.qualityMapper.dtoToModel(ratedCategoryDto.quality)
      );
      category.createdAt = ratedCategoryDto.createdAt;
      category.updatedAt = ratedCategoryDto.updatedAt;
      useCategoryStore().addCategory(category);
    }

    return category;
  }
}
