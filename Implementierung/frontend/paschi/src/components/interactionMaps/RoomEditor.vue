<template>
  <v-main
    fluid
    :scrollable="false"
    class="bg-grey-lighten-3"
    style="touch-action: none"
  >
    <v-card
      @dragover="dragOver"
      @drop="moveDrag($event, lastUsedRoomObject)"

      key="background"
      variant="flat"
      color="white"
      :style="roomDisplayStyle"
      @mouseup="dragEnd()"
      @mouseleave="dragEnd()"
    >
      <v-card
        v-for="roomObject in roomObjects"
        :key="roomObject.id"
        class="ma-0 v-row align-center justify-center"
        color="secondary"
        elevation="0"
        draggable="false"
        :style="getRoomObjectStyle(roomObject)"
        @touchstart="touchStart($event)"
        @touchmove="moveTouch($event, roomObject)"
        @dragstart="dragStart($event, roomObject)"
        @mousedown="dragStart($event, roomObject)"
        @mousemove="moveDrag($event, roomObject)"
        @mouseenter="resetMoveStart($event)"
        @mouseup="dragEnd()"
        @mouseleave="moveDrag($event, roomObject)"
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
import { Room } from "@/model/userdata/rooms/Room";
import { User } from "@/model/User";
import { Role } from "@/model/Role";
import { Position } from "@/model/userdata/rooms/Position";
import { Chair } from "@/model/userdata/rooms/Chair";
import { Table } from "@/model/userdata/rooms/Table";
import { Dimensions } from "@/model/userdata/rooms/Dimensions";

export default defineComponent({
  name: "RoomEditor.vue",
  setup() {
    const Gregor = ref<User>(
      new User(4, "Gregor", "Snelting", "f", true, Role.USER, "")
    );
    const room = ref<Room>(new Room("123", Gregor.value, "Test"));

    onBeforeMount(() => {
      room.value.addRoomObject(
        new Chair(
          "0",
          Gregor.value,
          new Position("0", Gregor.value, 0, 0, Math.PI / 4)
        )
      );
      room.value.addRoomObject(
        new Chair(
          "1",
          Gregor.value,
          new Position("1", Gregor.value, 700, 100, 0)
        )
      );
      room.value.addRoomObject(
        new Chair(
          "2",
          Gregor.value,
          new Position("2", Gregor.value, 200, 700, 0)
        )
      );
      room.value.addRoomObject(
        new Table(
          "3",
          Gregor.value,
          new Position("3", Gregor.value, 3000, 3000, Math.PI / 4),
          new Dimensions(3000, 1000)
        )
      );
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

    const lastUsedRoomObject = ref<RoomObject>();

    const moveXStart = ref(0);
    const moveYStart = ref(0);

    var mouseDown = false;

    const roomDisplayStyle = {
      position: "absolute",
      top: roomDisplayTopMargin + "px",
      left: roomDisplayLeftMargin + "px",
      width: roomDisplayWidth + "px",
      height: roomDisplayHeight + "px",
    };

    //detects collisions with other room objects using the separating axis theorem
    function roomObjectOverlaps(
      roomObject: RoomObject,
      roomObjects: RoomObject[]
    ) {
      for (let i = 0; i < roomObjects.length; i++) {
        if (roomObjects[i].id === roomObject.id) {
          continue;
        }
        if (separatedAxisCollide(roomObject, roomObjects[i]) && separatedAxisCollide(roomObjects[i], roomObject)) {
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
        y: roomObject1.position.yCoordinate + roomObject1.dimensions.height / 2,
      };
      //describes the vector from the origin to the top right corner of the roomObject1
      const roomObject1TopRightDiagonal = {
        x:
          (roomObject1.dimensions.width / 2) *
            Math.cos(roomObject1Orientation) +
          (roomObject1.dimensions.height / 2) *
            Math.sin(roomObject1Orientation),
        y:
          (roomObject1.dimensions.width / 2) *
            Math.sin(roomObject1Orientation) -
          (roomObject1.dimensions.height / 2) *
            Math.cos(roomObject1Orientation),
      };
      //describes the vector from the origin to the top left corner of the roomObject1
      const roomObject1TopLeftDiagonal = {
        x:
          -(roomObject1.dimensions.width / 2) *
            Math.cos(roomObject1Orientation) +
          (roomObject1.dimensions.height / 2) *
            Math.sin(roomObject1Orientation),
        y:
          -(roomObject1.dimensions.width / 2) *
            Math.sin(roomObject1Orientation) -
          (roomObject1.dimensions.height / 2) *
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
        y: roomObject2.position.yCoordinate + roomObject2.dimensions.height / 2,
      };
      //describes the vector from the origin to the top right corner of the roomObject2
      const roomObject2TopRightDiagonal = {
        x:
          (roomObject2.dimensions.width / 2) *
            Math.cos(roomObject2Orientation) +
          (roomObject2.dimensions.height / 2) *
            Math.sin(roomObject2Orientation),
        y:
          (roomObject2.dimensions.width / 2) *
            Math.sin(roomObject2Orientation) -
          (roomObject2.dimensions.height / 2) *
            Math.cos(roomObject2Orientation),
      };
      //describes the vector from the origin to the top left corner of the roomObject2
      const roomObject2TopLeftDiagonal = {
        x:
          -(roomObject2.dimensions.width / 2) *
            Math.cos(roomObject2Orientation) +
          (roomObject2.dimensions.height / 2) *
            Math.sin(roomObject2Orientation),
        y:
          -(roomObject2.dimensions.width / 2) *
            Math.sin(roomObject2Orientation) -
          (roomObject2.dimensions.height / 2) *
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
        height: roomObject.dimensions.height * roomScale + "px",
        transform: `rotate(${roomObject.position.orientation}rad)`,
      };
    }

    function touchStart(event: TouchEvent) {
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function screenCoordinatesDeltaToRoomCoordinatesDelta(
      x: number,
      y: number
    ) {
      return {
        x: x / roomScale,
        y: y / roomScale,
      };
    }

    function moveTouch(event: TouchEvent, roomObject: RoomObject) {
      const delta = screenCoordinatesDeltaToRoomCoordinatesDelta(
        event.touches[0].clientX - moveXStart.value,
        event.touches[0].clientY - moveYStart.value
      );
      roomObject.position.xCoordinate =
        roomObject.position.xCoordinate + delta.x;
      roomObject.position.yCoordinate =
        roomObject.position.yCoordinate + delta.y;
      if (roomObjectOverlaps(roomObject, room.value.roomObjects)) {
        roomObject.position.xCoordinate =
          roomObject.position.xCoordinate - delta.x;
        roomObject.position.yCoordinate =
          roomObject.position.yCoordinate - delta.y;
      }
      moveXStart.value = event.touches[0].clientX;
      moveYStart.value = event.touches[0].clientY;
    }

    function dragOver(event: DragEvent) {
      event.dataTransfer ? (event.dataTransfer.dropEffect = "move") : null;
      event.preventDefault();
    }

    function dragStart(event: DragEvent, roomObject: RoomObject) {
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
      lastUsedRoomObject.value = roomObject;
      mouseDown = true;
    }

    function moveDrag(event: DragEvent, roomObject: RoomObject) {
      if (!mouseDown) {
        return;
      }
      const delta = screenCoordinatesDeltaToRoomCoordinatesDelta(
        event.clientX - moveXStart.value,
        event.clientY - moveYStart.value
      );
      roomObject.position.xCoordinate =
        roomObject.position.xCoordinate + delta.x;
      roomObject.position.yCoordinate =
        roomObject.position.yCoordinate + delta.y;
      if (roomObjectOverlaps(roomObject, room.value.roomObjects)) {
        roomObject.position.xCoordinate =
          roomObject.position.xCoordinate - delta.x;
        roomObject.position.yCoordinate =
          roomObject.position.yCoordinate - delta.y;
      }
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
    }

    function dragEnd() {
      mouseDown = false;
    }

    function resetMoveStart(event: MouseEvent) {
      moveXStart.value = event.clientX;
      moveYStart.value = event.clientY;
    }

    return {
      roomObjects: room.value.roomObjects,
      dragStart,
      moveDrag,
      dragOver,
      touchStart,
      moveTouch,
      getRoomObjectStyle,
      roomDisplayStyle,
      lastUsedRoomObject,
      dragEnd,
      resetMoveStart
    };
  },
});
</script>

<style scoped></style>
