package edu.kit.informatik.controller;

import edu.kit.informatik.service.BaseService;

import java.util.List;

/**
 * Abstrakte Klasse BaseController zur Vererbung der Methoden für alle benötigten Controller.
 * Controller dienen zum Bauen der REST-Api.
 *
 * @param <Entity> Entität des Controllers
 * @param <Dto> Dto der Entität
 *
 * @author ugqbo
 * @version 1.0
 */
public abstract class BaseController<Entity, Dto> {

    /**
     * Allgemeiner {@link BaseService Service}
     */
    private final BaseService<Entity, Dto> service;

    /**
     * Konstruktor zum Erstellen eines Objektes der Klasse. Er wird durch Unterklassen aufgerufen, die den
     * {@link BaseService} durch die passende Unterklasse ersetzten.
     * @param service {@link BaseService}
     */
    public BaseController(BaseService<Entity, Dto> service) {
        this.service = service;
    }

    /**
     * REST-Api zum Hinzufügen der Entität
     * @param dto Dto der Entität
     * @return Dto der Entität
     */
    public Dto add(Dto dto) {
        return this.service.add(dto);
    }

    /**
     * REST-Api zum Aktualisieren der Entität
     * @param dto Dto der Entität
     * @return Dto der Entität
     */
    public Dto update(Dto dto) {
        return this.service.update(dto);
    }

    /**
     * REST-Api zur Rückgabe einer Entität
     * @param id Id der Entität
     * @return Dto der Entität
     */
    public Dto getById(String id) {
        return this.service.getById(id);
    }

    /**
     * REST-Api Rückgabe aller Entitäten
     * @return Liste der Dtos der Entitäten
     */
    public List<Dto> getAll() {
        return this.service.getAll();
    }

    /**
     * REST-Api zum Löschen einer Entität
     * @param id Id der Entität
     * @return Dto der Entität
     */
    public String delete(String id) {
        return this.service.delete(id);
    }


}
