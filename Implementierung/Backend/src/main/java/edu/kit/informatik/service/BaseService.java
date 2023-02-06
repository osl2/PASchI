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
 * @param <ParameterDto> Data-Transfer-Objekt als übergebener Parameter
 * @param <ReturnDto> Zurückgegebenes Data-Transfer-Objekt
 *
 * @author ugqbo
 * @version 1.0
 */
@Service
@EnableAutoConfiguration
public abstract class BaseService<Entity, ParameterDto, ReturnDto> {

    /**
     * Allgemeiner {@link IModelDtoMapper Mapper} zum Abbilden einer Entität auf das dazugehörige Dto und
     * Abbilden eines Dto auf die dazugehörige Entität.
     */
    protected final IModelDtoMapper<Entity, ReturnDto, ReturnDto> mapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse. Wir durch die Unterklassen aufgerufen um dem
     * {@link IModelDtoMapper} du initialisieren.
     * @param mapper {@link IModelDtoMapper}
     */
    public BaseService(IModelDtoMapper<Entity, ReturnDto, ReturnDto> mapper) {
        this.mapper = mapper;
    }

    /**
     * Hinzufügen einer Entität
     * @param dto Dto
     * @return Dto
     */
    public abstract ReturnDto add(ParameterDto dto);
    /**
     * Aktualisieren einer Entität
     * @param dto Dto
     * @return Dto
     */

    public abstract ReturnDto update(ParameterDto dto);

    /**
     * Rückgabe einer Entität
     * @param id id der Entität
     * @return Dto
     */
    public abstract ReturnDto getById(String id);

    /**
     * Rückgabe aller Entitäten
     * @return Liste der Entitäten
     */
    public abstract List<ReturnDto> getAll();

    /**
     * Löschen einer Entität
     * @param id id der Entität
     * @return id
     */
    public abstract String delete(String id);

}