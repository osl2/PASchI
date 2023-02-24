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
     * Bewertung mit einem Stern.
     */
    ONE_STAR(),
    /**
     * Bewertung mit zwei Sternen.
     */
    TWO_STAR(),
    /**
     * Bewertung mit drei Sternen.
     */
    THREE(),
    /**
     * Bewertung mit vier Sternen.
     */
    FOUR(),
    /**
     * Bewertung mit fünf Sternen.
     */
    FIVE_STAR();

    Quality() {
    }

    @Override
    public String toString() {
        return this.name();
    }
}
