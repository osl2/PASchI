package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.Category;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Data-Transfer-Object zur Klasse {@link Category}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoryDto {

    private String id;
    private String userId;
    private String name;
}
