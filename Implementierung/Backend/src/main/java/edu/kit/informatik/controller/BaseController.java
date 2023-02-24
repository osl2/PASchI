package edu.kit.informatik.controller;

import edu.kit.informatik.service.BaseService;
import org.springframework.security.core.Authentication;

import java.util.List;

/**
 * Abstrakte Klasse BaseController zur Vererbung der Methoden für alle benötigten Controller.
 * Controller dienen zum Bauen der REST-Api.
 *
 * @param <Entity> Entität des Controllers
 * @param <ParameterDto> Data-Transfer-Objekt als übergebener Parameter
 * @param <ReturnDto> Zurückgegebenes Data-Transfer-Objekt
 *
 * @author ugqbo
 * @version 1.0
 */
public abstract class BaseController<Entity, ParameterDto, ReturnDto> {

    /**
     * Allgemeiner {@link BaseService Service}
     */
    private final BaseService<Entity, ParameterDto, ReturnDto> service;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse. Er wird durch Unterklassen aufgerufen, die den
     * {@link BaseService} durch die passende Unterklasse ersetzten.
     * @param service {@link BaseService}
     */
    public BaseController(BaseService<Entity, ParameterDto, ReturnDto> service) {
        this.service = service;
    }

    /**
     * REST-Api zum Hinzufügen der Entität
     * @param dto Dto der Entität
     * @param authentication {@link Authentication}
     * @return Dto der Entität
     */
    public ReturnDto add(ParameterDto dto, Authentication authentication) {
        return this.service.add(dto, authentication);
    }

    /**
     * REST-Api zum Aktualisieren der Entität
     * @param dto Dto der Entität
     * @param authentication {@link Authentication}
     * @return Dto der Entität
     */
    public ReturnDto update(ParameterDto dto, Authentication authentication) {
        return this.service.update(dto, authentication);
    }

    /**
     * REST-Api zur Rückgabe einer Entität
     * @param id Id der Entität
     * @param authentication {@link Authentication}
     * @return Dto der Entität
     */
    public ReturnDto getById(String id, Authentication authentication) {
        return this.service.getById(id, authentication);
    }

    /**
     * REST-Api Rückgabe aller Entitäten
     * @param authentication {@link Authentication}
     * @return Liste der Dtos der Entitäten
     */
    public List<ReturnDto> getAll(Authentication authentication) {
        return this.service.getAll(authentication);
    }

    /**
     * REST-Api zum Löschen einer Entität
     * @param authentication {@link Authentication}
     * @param id Id der Entität
     * @return Dto der Entität
     */
    public String delete(String id, Authentication authentication) {
        return this.service.delete(id, authentication);
    }


}
