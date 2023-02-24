package edu.kit.informatik.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import edu.kit.informatik.model.User;

/**
 * Unterklasse von {@link ResponseStatusException} welche geworfen wird, falls die UserId des authentifizierten
 * {@link User} nicht mit der UserId der übergebenen Entität übereinstimmt
 *
 * @author ugqbo
 * @version 1.0
 */
public class NotEntityOfUserException extends ResponseStatusException {

    private static final String OUTPUT = "User authentication does not match with userid '%s'";

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param id Id des {@link User}
     */
    public NotEntityOfUserException(String id) {
        super(HttpStatus.UNAUTHORIZED, String.format(OUTPUT,  id));
    }
}
