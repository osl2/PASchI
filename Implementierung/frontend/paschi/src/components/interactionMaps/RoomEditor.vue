<template>
  <v-main
    fluid
    :scrollable="false"
    class="bg-grey-lighten-3"
    style="touch-action: none"
  >
    <v-card
      key="background"
      variant="flat"
      color="white"
      :style="roomDisplayStyle"
      @mousemove="mouseMoveRoomObject($event, selectedRoomObject)"
      @mouseup="mouseUpRoomObject"
    >
      <v-card
        v-for="roomObject in roomObjects"
        :key="roomObject.getId"
        class="ma-0 v-row align-center justify-center"
        color="secondary"
        elevation="0"
        draggable="false"
        :style="getRoomObjectStyle(roomObject)"
        @touchstart="touchStart($event, roomObject)"
        @touchmove="moveTouch($event, roomObject)"
        @mousedown="mouseDownRoomObject($event, roomObject)"
      >
        <v-icon
          class="v-col-auto"
          size="25px"
          color="white"
          icon="fas fa-chair"
        ></v-icon>
      </v-card>
    </v-card>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from "vue";
import { RoomObject } from "@/model/userdata/rooms/roomObject";
import { RoomController } from "@/controller/RoomController";

export default defineComponent({
  name: "RoomEditor.vue",
  setup() {
    const roomController = RoomController.getRoomController();

    const roomId = roomController.createRoom("TestRoom");

    onBeforeMount(() => {
      roomController.addChair(roomId, 0, 0, 0);
      roomController.addChair(roomId, 1000, 0, 0);
      roomController.addChair(roomId, 2000, 0, 0);
      roomController.addTable(roomId, 3000, 0, 0, 1000, 3000);
    });

    const roomWidth = 16180;
    const roomHeight = 10000;

    const maxRoomDisplayWidth = 0.9 * window.innerWidth;
    const maxRoomDisplayHeight = 0.9 * window.innerHeight;

    const roomScale = Math.min(
      maxRoomDisplayWidth / roomWidth,
      maxRoomDisplayHeight / roomHeight
    );

    const roomDisplayWidth = roomWidth * roomScale;
    const roomDisplayHeight = roomHeight * roomScale;

    const roomDisplayTopMargin = (window.innerHeight - roomDisplayHeight) / 2;
    const roomDisplayLeftMargin = (window.innerWidth - roomDisplayWidth) / 2;

    const preTranslationRoomObjectScreenCoordinates = ref({ x: 0, y: 0 });
    const preTranslationRoomObjectRoomCoordinates = ref({ x: 0, y: 0 });

    const translationOffset = ref({ x: 0, y: 0 });

    const roomDisplayStyle = {
      position: "absolute",
      top: roomDisplayTopMargin + "px",
      left: roomDisplayLeftMargin + "px",
      width: roomDisplayWidth + "px",
      height: roomDisplayHeight + "px",
    };

    const selectedRoomObject = ref<RoomObject>();

    //detects collisions with other room objects using the separating axis theorem
    function roomObjectOverlaps(
      roomObject: RoomObject,
      roomObjects: RoomObject[]
    ) {
      for (let i = 0; i < roomObjects.length; i++) {
        if (roomObjects[i].getId === roomObject.getId) {
          continue;
        }
        if (
          separatedAxisCollide(roomObject, roomObjects[i]) &&
          separatedAxisCollide(roomObjects[i], roomObject)
        ) {
          return true;
        }
      }
      return false;
    }

    function separatedAxisCollide(
      roomObject1: RoomObject,
      roomObject2: RoomObject
    ) {
      const roomObject1Orientation = roomObject1.position.orientation;
      const roomObject1Origin = {
        x: roomObject1.position.xCoordinate + roomObject1.dimensions.width / 2,
        y: roomObject1.position.yCoordinate + roomObject1.dimensions.length / 2,
      };
      //describes the vector from the origin to the top right corner of the roomObject1
      const roomObject1TopRightDiagonal = {
        x:
          (roomObject1.dimensions.width / 2) *
            Math.cos(roomObject1Orientation) +
          (roomObject1.dimensions.length / 2) *
            Math.sin(roomObject1Orientation),
        y:
          (roomObject1.dimensions.width / 2) *
            Math.sin(roomObject1Orientation) -
          (roomObject1.dimensions.length / 2) *
            Math.cos(roomObject1Orientation),
      };
      //describes the vector from the origin to the top left corner of the roomObject1
      const roomObject1TopLeftDiagonal = {
        x:
          -(roomObject1.dimensions.width / 2) *
            Math.cos(roomObject1Orientation) +
          (roomObject1.dimensions.length / 2) *
            Math.sin(roomObject1Orientation),
        y:
          -(roomObject1.dimensions.width / 2) *
            Math.sin(roomObject1Orientation) -
          (roomObject1.dimensions.length / 2) *
            Math.cos(roomObject1Orientation),
      };
      //describes the vector from the origin to the bottom right corner of the roomObject1
      const roomObject1BottomRightDiagonal = {
        x: -roomObject1TopLeftDiagonal.x,
        y: -roomObject1TopLeftDiagonal.y,
      };
      //describes the vector from the origin to the bottom left corner of the roomObject1
      const roomObject1BottomLeftDiagonal = {
        x: -roomObject1TopRightDiagonal.x,
        y: -roomObject1TopRightDiagonal.y,
      };
      const roomObject1Vertices = [
        {
          x: roomObject1Origin.x + roomObject1TopRightDiagonal.x,
          y: roomObject1Origin.y + roomObject1TopRightDiagonal.y,
        },
        {
          x: roomObject1Origin.x + roomObject1BottomRightDiagonal.x,
          y: roomObject1Origin.y + roomObject1BottomRightDiagonal.y,
        },
        {
          x: roomObject1Origin.x + roomObject1BottomLeftDiagonal.x,
          y: roomObject1Origin.y + roomObject1BottomLeftDiagonal.y,
        },
        {
          x: roomObject1Origin.x + roomObject1TopLeftDiagonal.x,
          y: roomObject1Origin.y + roomObject1TopLeftDiagonal.y,
        },
      ];
      const roomObject2Orientation = roomObject2.position.orientation;
      const roomObject2Origin = {
        x: roomObject2.position.xCoordinate + roomObject2.dimensions.width / 2,
        y: roomObject2.position.yCoordinate + roomObject2.dimensions.length / 2,
      };
      //describes the vector from the origin to the top right corner of the roomObject2
      const roomObject2TopRightDiagonal = {
        x:
          (roomObject2.dimensions.width / 2) *
            Math.cos(roomObject2Orientation) +
          (roomObject2.dimensions.length / 2) *
            Math.sin(roomObject2Orientation),
        y:
          (roomObject2.dimensions.width / 2) *
            Math.sin(roomObject2Orientation) -
          (roomObject2.dimensions.length / 2) *
            Math.cos(roomObject2Orientation),
      };
      //describes the vector from the origin to the top left corner of the roomObject2
      const roomObject2TopLeftDiagonal = {
        x:
          -(roomObject2.dimensions.width / 2) *
            Math.cos(roomObject2Orientation) +
          (roomObject2.dimensions.length / 2) *
            Math.sin(roomObject2Orientation),
        y:
          -(roomObject2.dimensions.width / 2) *
            Math.sin(roomObject2Orientation) -
          (roomObject2.dimensions.length / 2) *
            Math.cos(roomObject2Orientation),
      };
      //describes the vector from the origin to the bottom right corner of the roomObject2
      const roomObject2BottomRightDiagonal = {
        x: -roomObject2TopLeftDiagonal.x,
        y: -roomObject2TopLeftDiagonal.y,
      };
      //describes the vector from the origin to the bottom left corner of the roomObject2
      const roomObject2BottomLeftDiagonal = {
        x: -roomObject2TopRightDiagonal.x,
        y: -roomObject2TopRightDiagonal.y,
      };
      const roomObject2Vertices = [
        {
          x: roomObject2Origin.x + roomObject2TopRightDiagonal.x,
          y: roomObject2Origin.y + roomObject2TopRightDiagonal.y,
        },
        {
          x: roomObject2Origin.x + roomObject2BottomRightDiagonal.x,
          y: roomObject2Origin.y + roomObject2BottomRightDiagonal.y,
        },
        {
          x: roomObject2Origin.x + roomObject2BottomLeftDiagonal.x,
          y: roomObject2Origin.y + roomObject2BottomLeftDiagonal.y,
        },
        {
          x: roomObject2Origin.x + roomObject2TopLeftDiagonal.x,
          y: roomObject2Origin.y + roomObject2TopLeftDiagonal.y,
        },
      ];
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

        function projectVertexOntoEdgeNormal(vertex: { x: number; y: number }) {
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

        if (
          roomObject1Max < roomObject2Min ||
          roomObject2Max < roomObject1Min
        ) {
          return false;
        }
      }
      return true;
    }

    function roomToDisplayCoordinates(x: number, y: number) {
      return {
        x: x * roomScale,
        y: y * roomScale,
      };
    }

    function displayToRoomCoordinates(x: number, y: number) {
      return {
        x: (x - roomDisplayLeftMargin) / roomScale,
        y: (y - roomDisplayTopMargin) / roomScale,
      };
    }

    function getRoomObjectStyle(roomObject: RoomObject) {
      const { x, y } = roomToDisplayCoordinates(
        roomObject.position.xCoordinate,
        roomObject.position.yCoordinate
      );
      return {
        position: "absolute",
        top: y + "px",
        left: x + "px",
        width: roomObject.dimensions.width * roomScale + "px",
        height: roomObject.dimensions.length * roomScale + "px",
        transform: `rotate(${roomObject.position.orientation}rad)`,
      };
    }

    function touchStart(event: TouchEvent, roomObject: RoomObject) {
      preTranslationRoomObjectScreenCoordinates.value.x =
        event.touches[0].clientX;
      preTranslationRoomObjectScreenCoordinates.value.y =
        event.touches[0].clientY;
      preTranslationRoomObjectRoomCoordinates.value = displayToRoomCoordinates(
        preTranslationRoomObjectScreenCoordinates.value.x,
        preTranslationRoomObjectScreenCoordinates.value.y
      );
      translationOffset.value = {
        x:
          preTranslationRoomObjectRoomCoordinates.value.x -
          roomObject.position.xCoordinate,
        y:
          preTranslationRoomObjectRoomCoordinates.value.y -
          roomObject.position.yCoordinate,
      };
    }

    function moveTouch(event: TouchEvent, roomObject: RoomObject) {
      const oldPosition = {
        x: roomObject.position.xCoordinate,
        y: roomObject.position.yCoordinate,
      };
      const newPosition = {
        x:
          displayToRoomCoordinates(
            event.touches[0].clientX,
            event.touches[0].clientY
          ).x - translationOffset.value.x,
        y:
          displayToRoomCoordinates(
            event.touches[0].clientX,
            event.touches[0].clientY
          ).y - translationOffset.value.y,
      };
      roomObject.position.xCoordinate = newPosition.x;
      roomObject.position.yCoordinate = newPosition.y;
      if (
        roomObjectOverlaps(roomObject, roomController.getRoomObjects(roomId)!)
      ) {
        roomObject.position.xCoordinate = oldPosition.x;
        roomObject.position.yCoordinate = oldPosition.y;
      }
    }

    function mouseDownRoomObject(event: MouseEvent, roomObject: RoomObject) {
      selectedRoomObject.value = roomObject;
      preTranslationRoomObjectScreenCoordinates.value.x = event.clientX;
      preTranslationRoomObjectScreenCoordinates.value.y = event.clientY;
      preTranslationRoomObjectRoomCoordinates.value = displayToRoomCoordinates(
        preTranslationRoomObjectScreenCoordinates.value.x,
        preTranslationRoomObjectScreenCoordinates.value.y
      );
      translationOffset.value = {
        x:
          preTranslationRoomObjectRoomCoordinates.value.x -
          roomObject.position.xCoordinate,
        y:
          preTranslationRoomObjectRoomCoordinates.value.y -
          roomObject.position.yCoordinate,
      };
    }

    function mouseUpRoomObject() {
      selectedRoomObject.value = undefined;
    }

    function mouseMoveRoomObject(event: MouseEvent, roomObject: RoomObject) {
      const oldPosition = {
        x: roomObject.position.xCoordinate,
        y: roomObject.position.yCoordinate,
      };
      const newPosition = {
        x:
          displayToRoomCoordinates(
            event.clientX,
            event.clientY
          ).x - translationOffset.value.x,
        y:
          displayToRoomCoordinates(
            event.clientX,
            event.clientY
          ).y - translationOffset.value.y,
      };
      roomObject.position.xCoordinate = newPosition.x;
      roomObject.position.yCoordinate = newPosition.y;
      if (
        roomObjectOverlaps(roomObject, roomController.getRoomObjects(roomId)!)
      ) {
        roomObject.position.xCoordinate = oldPosition.x;
        roomObject.position.yCoordinate = oldPosition.y;
      }
    }

    return {
      roomObjects: roomController.getRoomObjects(roomId),
      touchStart,
      moveTouch,
      getRoomObjectStyle,
      roomDisplayStyle,
      mouseDownRoomObject: mouseDownRoomObject,
      mouseMoveRoomObject: mouseMoveRoomObject,
      mouseUpRoomObject,
      selectedRoomObject,
    };
  },
});
</script>

<style scoped></style>
