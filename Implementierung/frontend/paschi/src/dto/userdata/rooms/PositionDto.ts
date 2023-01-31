export class PositionDto {

  id: string;
  userId: string;
  xCoordinate: number;
  yCoordinate: number;
  orientation: number;

  constructor(id: string, userId: string, xCoordinate: number, yCoordinate: number, orientation: number) {
    this.id = id;
    this.userId = userId;
    this.xCoordinate = xCoordinate;
    this.yCoordinate = yCoordinate;
    this.orientation = orientation;
  }
}
