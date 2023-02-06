package edu.kit.informatik.model.userdata.interactions;

public enum Quality {
    ONE_STAR("onestar"),
    TWO_STAR("twostar"),
    THREE("threestar"),
    FOUR("fourstar"),
    FIVE_STAR("fivestar");

    Quality(String name) {
    }

    @Override
    public String toString() {
        return this.name();
    }
}
