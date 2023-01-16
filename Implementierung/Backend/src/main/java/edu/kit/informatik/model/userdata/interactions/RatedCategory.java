package edu.kit.informatik.model.userdata.interactions;

import edu.kit.informatik.model.User;

public class RatedCategory extends Category {

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
