package edu.kit.informatik.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class NotEntityOfUserException extends ResponseStatusException {

    private static final String OUTPUT = "User authentication does not match with userid '%s'";

    public NotEntityOfUserException(String id) {
        super(HttpStatus.UNAUTHORIZED, String.format(OUTPUT,  id));
    }
}
