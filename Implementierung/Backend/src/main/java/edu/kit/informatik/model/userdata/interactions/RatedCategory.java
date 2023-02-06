package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
//@Table(name = "ratedcategories")
public class RatedCategory extends Category {

    @Enumerated(EnumType.STRING)
    private Quality quality;

    public RatedCategory(User user, String name, Quality quality) {
        super(user, name);
        this.quality = quality;
    }
}
