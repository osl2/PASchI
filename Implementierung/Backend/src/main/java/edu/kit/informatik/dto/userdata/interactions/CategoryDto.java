package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.Category;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.UUID;

/**
 * Data-Transfer-Object zur Klasse {@link Category}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */

@EqualsAndHashCode
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CategoryDto implements Comparable<CategoryDto> {

    private String id;
    private String userId;
    private String name;

    @Override
    public int compareTo(CategoryDto o) {
        UUID thisUser = UUID.fromString(this.id);
        UUID oUser = UUID.fromString(o.getId());

        return  thisUser.compareTo(oUser);
    }
}
