export class DataObject {

  private id: string | undefined;
  private localId: number;

  constructor(id: string | undefined, localId: number) {
    this.id = id;
    this.localId = localId;
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
}
