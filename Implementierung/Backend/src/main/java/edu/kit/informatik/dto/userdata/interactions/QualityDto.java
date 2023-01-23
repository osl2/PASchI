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
    ONE_STAR("one_star"),
    /**
     * Zwei Sterne - Qualität
     */
    TWO_STAR("two_star"),
    /**
     * Drei Sterne - Qualität
     */
    THREE("three_star"),
    /**
     * Vier Sterne - Qualität
     */
    FOUR("four_star"),
    /**
     * Fünf Sterne - Qualität
     */
    FIVE_STAR("five_star");

    QualityDto(String name) {
    }

    @Override
    public String toString() {
        return this.name();
    }

    public static QualityDto getQualityByString(String string) {
        for (QualityDto quality : QualityDto.values()) {
            if (quality.toString().toLowerCase().equals(string)) {
                return quality;
            }
        }

        return null;
    }
}
