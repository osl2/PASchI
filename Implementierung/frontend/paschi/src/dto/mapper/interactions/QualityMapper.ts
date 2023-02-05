import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";
import {Quality} from "@/model/userdata/interactions/Quality";
import {QualityDto} from "@/dto/userdata/interactions/QualityDto";

export class QualityMapper implements IModelDtoMapper<Quality, QualityDto> {

  private static mapper: QualityMapper = new QualityMapper();

  private constructor() {
  }

  static getMapper(): QualityMapper {
    return QualityMapper.mapper;
  }

  dtoToModel(qualityDto: QualityDto): Quality {
    switch (qualityDto) {
      case QualityDto.ONE_STAR:
        return Quality.ONE_STAR;
      case QualityDto.TWO_STAR:
        return Quality.TWO_STAR;
      case QualityDto.THREE_STAR:
        return Quality.THREE_STAR;
      case QualityDto.FOUR_STAR:
        return Quality.FOUR_STAR;
      case QualityDto.FIVE_STAR:
        return Quality.FIVE_STAR;
    }
  }

  modelToDto(quality: Quality): QualityDto {
    switch (quality) {
      case Quality.ONE_STAR:
        return QualityDto.ONE_STAR;
      case Quality.TWO_STAR:
        return QualityDto.TWO_STAR;
      case Quality.THREE_STAR:
        return QualityDto.THREE_STAR;
      case Quality.FOUR_STAR:
        return QualityDto.FOUR_STAR;
      case Quality.FIVE_STAR:
        return QualityDto.FIVE_STAR;
    }
  }
}
