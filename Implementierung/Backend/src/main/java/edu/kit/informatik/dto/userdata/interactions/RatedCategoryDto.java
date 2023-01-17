package edu.kit.informatik.dto.userdata.interactions;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RatedCategoryDto extends CategoryDto {

    private QualityDto quality;

    public RatedCategoryDto(Long id, Long userId, String name, QualityDto quality) {
        super(id, userId, name);
        this.quality = quality;
    }
}
