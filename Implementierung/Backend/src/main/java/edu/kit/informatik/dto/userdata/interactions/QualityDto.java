package edu.kit.informatik.dto.userdata.interactions;

import edu.kit.informatik.model.userdata.interactions.Quality;

/**
 * Data-Transfer-Object zum Enum {@link Quality}
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public enum QualityDto {
    /**
     * Ein Stern - Qualität
     */
    ONE_STAR(),
    /**
     * Zwei Sterne - Qualität
     */
    TWO_STAR(),
    /**
     * Drei Sterne - Qualität
     */
    THREE_STAR(),
    /**
     * Vier Sterne - Qualität
     */
    FOUR_STAR(),
    /**
     * Fünf Sterne - Qualität
     */
    FIVE_STAR();

    QualityDto() {
    }

    @Override
    public String toString() {
        return this.name();
    }
}
