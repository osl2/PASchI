package edu.kit.informatik.exceptions;

import edu.kit.informatik.model.User;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

/**
 * Unterklasse von {@link ResponseStatusException} welche geworfen wird, falls die Entität mit der übergebenen Id
 * nicht in der Datenbank gefunden wurde
 *
 * @author ugqbo
 * @version 1.0
 */
public class EntityNotFoundException extends ResponseStatusException {

    private static final String OUTPUT = "Entity of class '%s' with id: '%s' not found";

    /**
     * Konstruktor zum Erstellen eines Objektes
     * @param tClass Klasse in der die Exception geworfen wurde
     * @param id Id des {@link User}
     */
    public EntityNotFoundException(Class<?> tClass, String id) {
        super(HttpStatus.NOT_FOUND, String.format(OUTPUT, tClass.getSimpleName(), id));
    }

}
