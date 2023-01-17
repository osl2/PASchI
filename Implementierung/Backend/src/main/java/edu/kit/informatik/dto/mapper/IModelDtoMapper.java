package edu.kit.informatik.dto.mapper;

import java.util.List;

public interface IModelDtoMapper<Entity, Dto> {

    Dto modelToDto(Entity e);
    List<Dto> modelToDto(List<Entity> e);
    Entity dtoToModel(Dto d);
    List<Entity> dtoToModel(List<Dto> d);
}
