import {IModelDtoMapper} from "@/dto/mapper/IModelDtoMapper";

export abstract class BaseService<Entity, Dto> {

  private readonly mapper: IModelDtoMapper<Entity, Dto>;

  protected constructor(mapper: IModelDtoMapper<Entity, Dto>) {
    this.mapper = mapper;
  }

  protected getMapper(): IModelDtoMapper<Entity, Dto> {
    return this.mapper;
  }

  abstract add(e: Entity): void;

  abstract update(e: Entity): void;

  abstract getById(id: string): Entity;

  abstract getAll(): Entity[];

  abstract delete(id: string): void;
}
