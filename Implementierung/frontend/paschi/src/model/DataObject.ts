/**
 * Abstraktes Datenobjekt.
 *
 * @author uekai
 * @version 1.0
 */
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

  /**
   * Aktualisiert den Timestamp des Objekts.
   */
  update() {
    const date = new Date().toISOString();
    this._updatedAt = date.toString();
  }

  /**
   * Gibt zurück, ob das Objekt eine gültige ID besitzt.
   */
  hasId(): boolean {
    return this._id != undefined;
  }

  /**
   * Gibt die ID des Objekts zurück. Falls keine gültige ID existiert, wird die lokale ID zurückgegeben.
   */
  get getId(): string {
    if (this._id == undefined) {
      return this._localId.toString();
    }
    return this._id;
  }

  /**
   * Setzt die ID des Objekts.
   *
   * @param id Die ID des Objekts.
   */
  set setId(id: string) {
    this._id = id;
  }

  /**
   * Setzt den createdAt Timestamp.
   *
   * @param value Der createdAt Timestamp.
   */
  set createdAt(value: string) {
    this._createdAt = value;
  }

  /**
   * Setzt den updatedAt Timestamp.
   *
   * @param value Der updatedAt Timestamp.
   */
  set updatedAt(value: string) {
    this._updatedAt = value;
  }

  /**
   * Gibt den createdAt Timestamp zurück.
   */
  get createdAt(): string {
    return this._createdAt;
  }

  /**
   * Gibt den updatedAtTimestamp zurück.
   */
  get updatedAt(): string {
    return this._updatedAt;
  }
}
