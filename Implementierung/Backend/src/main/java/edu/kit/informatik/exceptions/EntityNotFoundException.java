package edu.kit.informatik.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class EntityNotFoundException extends ResponseStatusException {

    private static final String OUTPUT = "Entity of class '%s' with id: '%s' not found";

    public EntityNotFoundException(Class<?> tClass, String id) {
        super(HttpStatus.NOT_FOUND, String.format(OUTPUT, tClass.getSimpleName(), id));
    }

}
