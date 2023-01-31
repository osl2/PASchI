import {QualityDto} from "@/dto/userdata/interactions/QualityDto";
import {CategoryDto} from "@/dto/userdata/interactions/CategoryDto";

export class RatedCategoryDto extends CategoryDto {

  quality: QualityDto;

  constructor(id: string, userId: string, name: string, quality: QualityDto) {
    super(id, userId, name);
    this.quality = quality;
  }
}
