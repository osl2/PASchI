package edu.kit.informatik.service;

import java.util.List;

/**
 * Interface BaseService zur Vererbung der Methoden für alle benötigten Services.
 * Services dienen zur Bearbeitung der Methoden des dazugehörigen Controllers.
 *
 * @param <Entity> Entität des Services
 * @param <Dto> Dto zur Entität
 *
 * @author ugqbo
 * @version 1.0
 */
@org.springframework.stereotype.Service
public interface BaseService<Entity, Dto> {
    /**
     * Hinzufügen einer Entität
     * @param dto Dto
     * @return Dto
     */
    Dto add(Dto dto);
    /**
     * Aktualisieren einer Entität
     * @param dto Dto
     * @return Dto
     */

    Dto update(Dto dto);

    /**
     * Rückgabe einer Entität
     * @param id id der Entität
     * @return Dto
     */
    Dto getById(long id);

    /**
     * Rückgabe aller Entitäten
     * @return Liste der Entitäten
     */
    List<Dto> getAll();

    /**
     * Löschen einer Entität
     * @param id id der Entität
     * @return id
     */
    long delete(long id);

}