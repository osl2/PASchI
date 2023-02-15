package edu.kit.informatik.exceptions;

import edu.kit.informatik.model.DataObject;

public class EntityNotFoundException extends IllegalArgumentException {

    public EntityNotFoundException(Class<?> tClass, String id) {
        super("Entity of class '" + tClass.getSimpleName() + "' with id: '" + id + "' not found");
    }

}
