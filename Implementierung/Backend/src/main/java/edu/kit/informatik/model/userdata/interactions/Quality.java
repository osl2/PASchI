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
    ONE_STAR(),
    /**
     * Zwei Sterne
     */
    TWO_STAR(),
    /**
     * Drei Sterne
     */
    THREE(),
    /**
     * Vier Sterne
     */
    FOUR(),
    /**
     * Fünf Sterne
     */
    FIVE_STAR();

    Quality() {
    }

    @Override
    public String toString() {
        return this.name();
    }
}
