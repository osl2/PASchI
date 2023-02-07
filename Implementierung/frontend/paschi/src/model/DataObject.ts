export class DataObject {

  private id: string | undefined;
  private readonly localId: number;
  private readonly createdAt: string;
  private updatedAt: string;

  constructor(id: string | undefined, localId: number) {
    this.id = id;
    this.localId = localId;
    const date = new Date();
    this.createdAt = date.toString();
    this.updatedAt = date.toString();
  }

  update() {
    const date = new Date();
    this.updatedAt = date.toString();
  }

  hasId(): boolean {
    return this.id != undefined;
  }

  get getId(): string {
    if (this.id == undefined) {
      return this.localId.toString();
    }
    return this.id;
  }

  set setId(id: string) {
    this.id = id;
  }

  get created(): string {
    return this.createdAt;
  }

  get lastUpdate(): string {
    return this.updatedAt;
  }
}
