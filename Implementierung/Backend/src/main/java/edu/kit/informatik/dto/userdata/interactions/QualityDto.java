package edu.kit.informatik.dto.userdata.interactions;

public enum QualityDto {
    ONE_STAR("onestar"),
    TWO_STAR("twostar"),
    THREE("threestar"),
    FOUR("fourstar"),
    FIVE_STAR("fivestar");

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
