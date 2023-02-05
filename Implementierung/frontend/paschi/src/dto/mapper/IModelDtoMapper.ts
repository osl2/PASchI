export interface IModelDtoMapper<Entity, Dto> {

  modelToDto(e: Entity): Dto;
  dtoToModel(d: Dto): Entity;
}
