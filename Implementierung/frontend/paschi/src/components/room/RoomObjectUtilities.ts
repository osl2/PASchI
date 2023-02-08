import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { Coordinate } from "@/components/room/Coordinate";

export class RoomObjectUtilities {
  private constructor() {}

  private static roomObjectUtilities: RoomObjectUtilities =
    new RoomObjectUtilities();

  static getRoomObjectUtilities(): RoomObjectUtilities {
    return RoomObjectUtilities.roomObjectUtilities;
  }
  get roomHeight(): number {
    return 10000;
  }

  get roomWidth(): number {
    return 16180;
  }

  roomObjectOverlaps(roomObject: RoomObject, roomObjects: RoomObject[]) {
    const roomObjectVertices = this.getRoomObjectVertices(roomObject);
    for (let i = 0; i < 4; i++) {
      if (
        roomObjectVertices[i].x < 0 ||
        roomObjectVertices[i].x > this.roomWidth ||
        roomObjectVertices[i].y < 0 ||
        roomObjectVertices[i].y > this.roomHeight
      ) {
        return true;
      }
    }
    for (let i = 0; i < roomObjects.length; i++) {
      if (roomObjects[i].getId === roomObject.getId) {
        continue;
      }
      if (
        this.separatedAxisCollide(roomObject, roomObjects[i]) &&
        this.separatedAxisCollide(roomObjects[i], roomObject)
      ) {
        return true;
      }
    }
    return false;
  }

  getRoomObjectOrigin(roomObject: RoomObject): Coordinate {
    return {
      x: roomObject.position.xCoordinate + roomObject.dimensions.width / 2,
      y: roomObject.position.yCoordinate + roomObject.dimensions.length / 2,
    };
  }

  getRoomObjectVertices(roomObject: RoomObject): Coordinate[] {
    const roomObjectOrigin = this.getRoomObjectOrigin(roomObject);
    const roomObjectOrientation = roomObject.position.orientation;
    const roomObjectTopRightDiagonal = {
      x:
        (roomObject.dimensions.width / 2) * Math.cos(roomObjectOrientation) +
        (roomObject.dimensions.length / 2) * Math.sin(roomObjectOrientation),
      y:
        (roomObject.dimensions.width / 2) * Math.sin(roomObjectOrientation) -
        (roomObject.dimensions.length / 2) * Math.cos(roomObjectOrientation),
    };
    //describes the vector from the origin to the top left corner of the roomObject1
    const roomObjectTopLeftDiagonal = {
      x:
        -(roomObject.dimensions.width / 2) * Math.cos(roomObjectOrientation) +
        (roomObject.dimensions.length / 2) * Math.sin(roomObjectOrientation),
      y:
        -(roomObject.dimensions.width / 2) * Math.sin(roomObjectOrientation) -
        (roomObject.dimensions.length / 2) * Math.cos(roomObjectOrientation),
    };
    const roomObjectBottomRightDiagonal = {
      x: -roomObjectTopLeftDiagonal.x,
      y: -roomObjectTopLeftDiagonal.y,
    };
    //describes the vector from the origin to the bottom left corner of the roomObject1
    const roomObjectBottomLeftDiagonal = {
      x: -roomObjectTopRightDiagonal.x,
      y: -roomObjectTopRightDiagonal.y,
    };
    return [
      {
        x: roomObjectOrigin.x + roomObjectTopRightDiagonal.x,
        y: roomObjectOrigin.y + roomObjectTopRightDiagonal.y,
      },
      {
        x: roomObjectOrigin.x + roomObjectBottomRightDiagonal.x,
        y: roomObjectOrigin.y + roomObjectBottomRightDiagonal.y,
      },
      {
        x: roomObjectOrigin.x + roomObjectBottomLeftDiagonal.x,
        y: roomObjectOrigin.y + roomObjectBottomLeftDiagonal.y,
      },
      {
        x: roomObjectOrigin.x + roomObjectTopLeftDiagonal.x,
        y: roomObjectOrigin.y + roomObjectTopLeftDiagonal.y,
      },
    ];
  }

  //detects collisions with other room objects using the separating axis theorem
  separatedAxisCollide(roomObject1: RoomObject, roomObject2: RoomObject) {
    const roomObject1Vertices = this.getRoomObjectVertices(roomObject1);
    const roomObject2Vertices = this.getRoomObjectVertices(roomObject2);
    for (let i = 0; i < 4; i++) {
      const roomObject1Vertex1 = roomObject1Vertices[i];
      const roomObject1Vertex2 = roomObject1Vertices[(i + 1) % 4];
      const roomObject1Edge = {
        x: roomObject1Vertex2.x - roomObject1Vertex1.x,
        y: roomObject1Vertex2.y - roomObject1Vertex1.y,
      };
      // noinspection JSSuspiciousNameCombination
      const roomObject1EdgeNormal = {
        x: -roomObject1Edge.y,
        y: roomObject1Edge.x,
      };

      function projectVertexOntoEdgeNormal(vertex: Coordinate) {
        return (
          vertex.x * roomObject1EdgeNormal.x +
          vertex.y * roomObject1EdgeNormal.y
        );
      }

      const roomObject1Min = Math.min(
        projectVertexOntoEdgeNormal(roomObject1Vertices[0]),
        projectVertexOntoEdgeNormal(roomObject1Vertices[1]),
        projectVertexOntoEdgeNormal(roomObject1Vertices[2]),
        projectVertexOntoEdgeNormal(roomObject1Vertices[3])
      );
      const roomObject1Max = Math.max(
        projectVertexOntoEdgeNormal(roomObject1Vertices[0]),
        projectVertexOntoEdgeNormal(roomObject1Vertices[1]),
        projectVertexOntoEdgeNormal(roomObject1Vertices[2]),
        projectVertexOntoEdgeNormal(roomObject1Vertices[3])
      );
      const roomObject2Min = Math.min(
        projectVertexOntoEdgeNormal(roomObject2Vertices[0]),
        projectVertexOntoEdgeNormal(roomObject2Vertices[1]),
        projectVertexOntoEdgeNormal(roomObject2Vertices[2]),
        projectVertexOntoEdgeNormal(roomObject2Vertices[3])
      );
      const roomObject2Max = Math.max(
        projectVertexOntoEdgeNormal(roomObject2Vertices[0]),
        projectVertexOntoEdgeNormal(roomObject2Vertices[1]),
        projectVertexOntoEdgeNormal(roomObject2Vertices[2]),
        projectVertexOntoEdgeNormal(roomObject2Vertices[3])
      );

      if (roomObject1Max < roomObject2Min || roomObject2Max < roomObject1Min) {
        return false;
      }
    }
    return true;
  }
}

export function useRoomObjectUtilities() {
  return RoomObjectUtilities.getRoomObjectUtilities();
}
