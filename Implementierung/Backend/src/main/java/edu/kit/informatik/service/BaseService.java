package edu.kit.informatik.service;

import edu.kit.informatik.dto.mapper.IModelDtoMapper;
import edu.kit.informatik.exceptions.NotEntityOfUserException;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
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
    protected final IModelDtoMapper<Entity, ReturnDto> mapper;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse. Wir durch die Unterklassen aufgerufen um dem
     * {@link IModelDtoMapper} du initialisieren.
     * @param mapper {@link IModelDtoMapper}
     */
    public BaseService(IModelDtoMapper<Entity, ReturnDto> mapper) {
        this.mapper = mapper;
    }

    /**
     * Hinzufügen einer Entität
     * @param dto Dto
     * @return Dto
     */
    public abstract ReturnDto add(ParameterDto dto, Authentication authentication);
    /**
     * Aktualisieren einer Entität
     * @param dto Dto
     * @return Dto
     */

    public abstract ReturnDto update(ParameterDto dto, Authentication authentication);

    /**
     * Rückgabe einer Entität
     * @param id id der Entität
     * @return Dto
     */
    public abstract ReturnDto getById(String id, Authentication authentication);

    /**
     * Rückgabe aller Entitäten
     * @return Liste der Entitäten
     */
    public abstract List<ReturnDto> getAll(Authentication authentication);

    /**
     * Löschen einer Entität
     * @param id id der Entität
     * @return id
     */
    public abstract String delete(String id, Authentication authentication);

    public void checkAuthorization(Authentication authentication, String userId) throws NotEntityOfUserException {
        JwtAuthenticationToken jAT = (JwtAuthenticationToken) authentication;

        if (!jAT.getTokenAttributes().get("userId").equals(userId)) {
            throw new NotEntityOfUserException(userId);
        }
    }

}