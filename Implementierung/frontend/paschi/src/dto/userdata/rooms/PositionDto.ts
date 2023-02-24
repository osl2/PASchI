export class PositionDto {

  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  xcoordinate: number;
  ycoordinate: number;
  orientation: number;

  constructor(id: string, userId: string, createdAt: string, updatedAt: string, xCoordinate: number,
              yCoordinate: number, orientation: number) {
    this.id = id;
    this.userId = userId;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.xcoordinate = xCoordinate;
    this.ycoordinate = yCoordinate;
    this.orientation = orientation;
  }
}
