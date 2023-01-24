package edu.kit.informatik.dto.mapper;

import java.util.List;

/**
 * Interface zur Vererbung der Methoden für alle implementierten Mapper (Parser),
 * die aus einer Entität und Data-Transfer-Objekt zu dem jeweils anderen parsen können
 * @param <Entity> Entität
 * @param <Dto> Data-Transfer-Objekt
 *
 * @author uekai
 * @author ugqbo
 * @version 1.0
 */
public interface IModelDtoMapper<Entity, Dto> {

    /**
     * Parst eine Entität zu einem Data-Transfer-Objekt
     * @param e Entität
     * @return Data-transfer-Objekt
     */
    Dto modelToDto(Entity e);

    /**
     * Parst eine Liste von Entitäten zu einer Liste von Data-Transfer-Objekt
     * @param e {@link List} von Entitäten
     * @return {@link List} von Data-Transfer-Objekt
     */
    List<Dto> modelToDto(List<Entity> e);

    /**
     * Parst ein Data-Transfer-Objekt zu einer Entität
     * @param d Data-transfer-Objekt
     * @return Entität
     */
    Entity dtoToModel(Dto d);

    /**
     * Parst eine Liste von Data-Transfer-Objekten zu einer Liste von Entität
     * @param d {@link List} von Data-transfer-Objekt
     * @return {@link List} von Entität
     */
    List<Entity> dtoToModel(List<Dto> d);
}
