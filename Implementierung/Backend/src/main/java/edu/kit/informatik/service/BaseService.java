package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
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
@EnableAutoConfiguration
public abstract class BaseService<Entity, Dto> {

    protected final IModelDtoMapper<Entity, Dto> mapper;

    public BaseService(IModelDtoMapper<Entity, Dto> mapper) {
        this.mapper = mapper;
    }

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