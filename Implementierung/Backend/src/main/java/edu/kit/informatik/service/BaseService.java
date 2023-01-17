package edu.kit.informatik.service;

import org.springframework.stereotype.Service;

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
@Service
public abstract class BaseService<Entity, Dto> {
    /**
     * Hinzufügen einer Entität
     * @param dto Dto
     * @return Dto
     */
    public abstract Dto add(Dto dto);
    /**
     * Aktualisieren einer Entität
     * @param dto Dto
     * @return Dto
     */

    public abstract Dto update(Dto dto);

    /**
     * Rückgabe einer Entität
     * @param id id der Entität
     * @return Dto
     */
    public abstract Dto getById(long id);

    /**
     * Rückgabe aller Entitäten
     * @return Liste der Entitäten
     */
    public abstract List<Dto> getAll();

    /**
     * Löschen einer Entität
     * @param id id der Entität
     * @return id
     */
    public abstract long delete(long id);

}