package edu.kit.informatik.exceptions;

public class EntityNotFoundException extends IllegalArgumentException {

    private static final String OUTPUT = "Entity of class '%s' with id: '%s' not found";

    public EntityNotFoundException(Class<?> tClass, String id) {
        super(String.format(OUTPUT, tClass.getSimpleName(), id));
        //super("Entity of class '" + tClass.getSimpleName() + "' with id: '" + id + "' not found");
    }

}
