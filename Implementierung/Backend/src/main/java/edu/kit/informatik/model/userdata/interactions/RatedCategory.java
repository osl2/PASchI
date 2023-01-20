package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import lombok.NoArgsConstructor;

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

    public Quality getQuality() {
        return quality;
    }

    public void setQuality(Quality quality) {
        this.quality = quality;
    }
}
