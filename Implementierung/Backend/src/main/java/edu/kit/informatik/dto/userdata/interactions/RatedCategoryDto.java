package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.RatedCategory;
import edu.kit.informatik.model.User;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data-Transfer-Object zur Klasse {@link RatedCategory}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@NoArgsConstructor
@Getter
@Setter
public class RatedCategoryDto extends CategoryDto {

    private QualityDto quality;

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param id Id
     * @param userId Id eines {@link User}
     * @param name Name
     * @param quality {@link QualityDto}
     */
    public RatedCategoryDto(String id, String userId, String name, QualityDto quality) {
        super(id, userId, name);
        this.quality = quality;
    }
}
