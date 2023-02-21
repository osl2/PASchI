package edu.kit.informatik.model.userdata.interactions;

/**
 * Qualitäten der {@link RatedCategory}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public enum Quality {
    /**
     * Ein Stern
     */
    ONE_STAR("onestar"),
    /**
     * Zwei Sterne
     */
    TWO_STAR("twostar"),
    /**
     * Drei Sterne
     */
    THREE("threestar"),
    /**
     * Vier Sterne
     */
    FOUR("fourstar"),
    /**
     * Fünf Sterne
     */
    FIVE_STAR("fivestar");

    Quality(String name) {
    }

    @Override
    public String toString() {
        return this.name();
    }
}
