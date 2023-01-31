export abstract class BaseService<Entity, Dto> {

  private readonly base_url: string;

  protected constructor(base_url: string) {
    this.base_url = base_url;
  }

  add(e: Entity) {

  }

  update(e: Entity) {

  }

  getById(id: string)/*: Entity*/ {

  }

  getAll()/*: Entity[]*/ {

  }

  delete(id: string) {

  }
}
