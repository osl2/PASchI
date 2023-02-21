export abstract class DataObject {

  private _id: string | undefined;
  private readonly _localId: number;
  private _createdAt: string;
  private _updatedAt: string;

  protected constructor(id: string | undefined, localId: number) {
    this._id = id;
    this._localId = localId;
    const date = new Date().toISOString();
    this._createdAt = date.toString();
    this._updatedAt = date.toString();
  }

  update() {
    const date = new Date().toISOString();
    this._updatedAt = date.toString();
  }

  hasId(): boolean {
    return this._id != undefined;
  }

  get getId(): string {
    if (this._id == undefined) {
      return this._localId.toString();
    }
    return this._id;
  }

  set setId(id: string) {
    this._id = id;
  }

  set createdAt(value: string) {
    this._createdAt = value;
  }

  get createdAt(): string {
    return this._createdAt;
  }

  get updatedAt(): string {
    return this._updatedAt;
  }
}
