<template>
  <v-main
    fluid
    :scrollable="false"
    class="bg-grey-lighten-3"
    style="touch-action: none"
  >
    <v-card :style="roomInventoryStyle">
      <v-card class="" @click="addTable">
        <v-icon>mdi mdi-table-furniture</v-icon>
      </v-card>
      <v-card class="" @click="addChair">
        <v-icon>mdi mdi-seat-outline</v-icon>
      </v-card>
      <v-btn-toggle v-model="action" @update:model-value="setAction" color="primary" mandatory >
        <v-btn icon="mdi mdi-cursor-move" value="translate" />
        <v-btn icon="mdi mdi-rotate-left" value="rotate" />
      </v-btn-toggle>
    </v-card>
    <v-card
      key="background"
      variant="flat"
      color="white"
      :style="roomDisplayStyle"
      @mousemove="mouseMoveRoomObject($event, selectedRoomObject)"
      @mouseup="mouseUpRoomObject($event, selectedRoomObject)"
      @mouseleave="mouseUpRoomObject($event, selectedRoomObject)"
    >
      <v-card
        v-for="roomObject in roomObjects"
        :key="roomObject.getId"
        class="ma-0 v-row align-center justify-center"
        :class="[
          roomObjectErrorStyle && roomObject === selectedRoomObject
            ? 'error'
            : 'notError',
        ]"
        color="secondary"
        elevation="0"
        draggable="false"
        :style="getRoomObjectStyle(roomObject)"
        @touchstart="touchStart($event, roomObject)"
        @touchmove="moveTouch($event, roomObject)"
        @touchend="touchEnd($event, roomObject)"
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
import { computed, defineComponent, onBeforeMount, ref } from "vue";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { RoomController } from "@/controller/RoomController";
import { Coordinate } from "@/components/interactionMaps/Coordinate";

export default defineComponent({
  name: "RoomEditor.vue",
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  setup() {
    const roomController = RoomController.getRoomController();

    const roomId = roomController.createRoom("TestRoom");

    const roomObjects = computed(() => roomController.getRoomObjects(roomId));

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

    const preTranslationRoomObjectRoomCoordinates = ref({ x: 0, y: 0 });

    const translationOffset = ref({ x: 0, y: 0 });

    const roomDisplayStyle = {
      position: "absolute",
      top: roomDisplayTopMargin + "px",
      left: roomDisplayLeftMargin + "px",
      width: roomDisplayWidth + "px",
      height: roomDisplayHeight + "px",
    };

    const roomInventoryOnBottom = roomDisplayLeftMargin < roomDisplayTopMargin;

    const roomInventoryStyle = {
      position: "absolute",
      top: roomInventoryOnBottom ? "auto" : "0px",
      bottom: roomInventoryOnBottom ? "0px" : "auto",
      left: "0px",
      width: roomInventoryOnBottom ? "100%" : roomDisplayLeftMargin - 10 + "px",
      height: roomInventoryOnBottom ? roomDisplayTopMargin - 10 + "px" : "100%",
    };

    const selectedRoomObject = ref<RoomObject>();

    const roomObjectErrorStyle = ref(false);

    const action = ref<string>("translate");

    let selectFunction = initializeRoomObjectGrabCoordinates;

    let moveFunction = translateRoomObjectToDisplayCoordinates;

    let releaseFunction = endTranslationRoomObject;

    function setAction(action: string) {
      switch (action) {
        case "translate":
          selectFunction = initializeRoomObjectGrabCoordinates;
          moveFunction = translateRoomObjectToDisplayCoordinates;
          releaseFunction = endTranslationRoomObject;
          break;
        case "rotate":
          selectFunction = initializeRoomObjectRotationCoordinates;
          moveFunction = rotateRoomObject;
          releaseFunction = finalizeRoomObjectRotation;
          break;
      }
    }

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

    function getRoomObjectOrigin(roomObject: RoomObject): Coordinate {
      return {
        x: roomObject.position.xCoordinate + roomObject.dimensions.width / 2,
        y: roomObject.position.yCoordinate + roomObject.dimensions.length / 2,
      };
    }

    function separatedAxisCollide(
      roomObject1: RoomObject,
      roomObject2: RoomObject
    ) {
      const roomObject1Orientation = roomObject1.position.orientation;
      const roomObject1Origin = getRoomObjectOrigin(roomObject1);
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
      const roomObject2Origin = getRoomObjectOrigin(roomObject2);
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
        if (
          roomObject1Vertices[i].x < 0 ||
          roomObject1Vertices[i].x > roomWidth ||
          roomObject1Vertices[i].y < 0 ||
          roomObject1Vertices[i].y > roomHeight
        ) {
          return true;
        }
        if (
          roomObject2Vertices[i].x < 0 ||
          roomObject2Vertices[i].x > roomWidth ||
          roomObject2Vertices[i].y < 0 ||
          roomObject2Vertices[i].y > roomHeight
        ) {
          return true;
        }
      }
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

    let previousRotationCoordinate: Coordinate = { x: 0, y: 0 };

    let lastValidRotation = 0;

    function calculateRoomObjectRotation(
      roomObject: RoomObject,
      currentCoordinate: Coordinate
    ) {
      const origin = getRoomObjectOrigin(roomObject);
      const previousCoordinateFromOrigin = {
        x: previousRotationCoordinate.x - origin.x,
        y: previousRotationCoordinate.y - origin.y,
      };
      const currentCoordinateFromOrigin = {
        x: currentCoordinate.x - origin.x,
        y: currentCoordinate.y - origin.y,
      };
      const direction = Math.sign(
        previousCoordinateFromOrigin.x * currentCoordinateFromOrigin.y -
          previousCoordinateFromOrigin.y * currentCoordinateFromOrigin.x
      );
      const rotationDelta =
        direction *
        Math.acos(
          (previousCoordinateFromOrigin.x * currentCoordinateFromOrigin.x +
            previousCoordinateFromOrigin.y * currentCoordinateFromOrigin.y) /
            (Math.sqrt(
              previousCoordinateFromOrigin.x ** 2 +
                previousCoordinateFromOrigin.y ** 2
            ) *
              Math.sqrt(
                currentCoordinateFromOrigin.x ** 2 +
                  currentCoordinateFromOrigin.y ** 2
              ))
        );
      previousRotationCoordinate = currentCoordinate;
      return rotationDelta;
    }

    function initializeRoomObjectRotationCoordinates(
      displayCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      previousRotationCoordinate = displayToRoomCoordinates(
        displayCoordinates.x,
        displayCoordinates.y
      );
      lastValidRotation = roomObject.position.orientation;
    }

    function rotateRoomObject(
      displayCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      const angle = calculateRoomObjectRotation(
        roomObject,
        displayToRoomCoordinates(displayCoordinates.x, displayCoordinates.y)
      );
      roomObject.position.orientation =
        (roomObject.position.orientation + angle) % (2 * Math.PI);
      if (!roomObjectOverlaps(roomObject, roomObjects.value!)) {
        lastValidRotation = roomObject.position.orientation;
        roomObjectErrorStyle.value = false;
      } else {
        roomObjectErrorStyle.value = true;
      }
    }

    function finalizeRoomObjectRotation(roomObject: RoomObject) {
      roomObject.position.orientation = lastValidRotation;
      selectedRoomObject.value = undefined;
      roomObjectErrorStyle.value = false;
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

    function initializeRoomObjectGrabCoordinates(
      displayCoordinates: { x: number; y: number },
      roomObject: RoomObject
    ) {
      const roomCoordinates: { x: number; y: number } =
        displayToRoomCoordinates(displayCoordinates.x, displayCoordinates.y);
      translationOffset.value = {
        x: roomCoordinates.x - roomObject.position.xCoordinate,
        y: roomCoordinates.y - roomObject.position.yCoordinate,
      };
      preTranslationRoomObjectRoomCoordinates.value = {
        x: roomObject.position.xCoordinate,
        y: roomObject.position.yCoordinate,
      };
    }

    function translateRoomObjectToDisplayCoordinates(
      displayCoordinates: { x: number; y: number },
      roomObject: RoomObject
    ) {
      const newPosition = {
        x:
          displayToRoomCoordinates(displayCoordinates.x, displayCoordinates.y)
            .x - translationOffset.value.x,
        y:
          displayToRoomCoordinates(displayCoordinates.x, displayCoordinates.y)
            .y - translationOffset.value.y,
      };
      roomObject.position.xCoordinate = newPosition.x;
      roomObject.position.yCoordinate = newPosition.y;
      roomObjectErrorStyle.value = roomObjectOverlaps(
        roomObject,
        roomController.getRoomObjects(roomId)!
      );
    }

    function endTranslationRoomObject(roomObject: RoomObject) {
      if (
        roomObjectOverlaps(roomObject, roomController.getRoomObjects(roomId)!)
      ) {
        roomObject.position.xCoordinate =
          preTranslationRoomObjectRoomCoordinates.value.x;
        roomObject.position.yCoordinate =
          preTranslationRoomObjectRoomCoordinates.value.y;
      }
      selectedRoomObject.value = undefined;
      roomObjectErrorStyle.value = false;
    }

    function touchStartRoomObject(event: TouchEvent, roomObject: RoomObject) {
      selectedRoomObject.value = roomObject;
      const displayCoordinates: { x: number; y: number } = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      selectFunction(displayCoordinates, roomObject);
    }

    function touchMoveRoomObject(event: TouchEvent, roomObject: RoomObject) {
      const displayCoordinates = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY,
      };
      moveFunction(displayCoordinates, roomObject);
    }

    function touchEndRoomObject(event: TouchEvent, roomObject: RoomObject) {
      releaseFunction(roomObject);
    }

    function mouseDownRoomObject(event: MouseEvent, roomObject: RoomObject) {
      selectedRoomObject.value = roomObject;
      const displayCoordinates: { x: number; y: number } = {
        x: event.clientX,
        y: event.clientY,
      };
      selectFunction(displayCoordinates, roomObject);
    }

    function mouseMoveRoomObject(event: MouseEvent, roomObject: RoomObject) {
      if (!roomObject) {
        return;
      }
      const displayCoordinates = {
        x: event.clientX,
        y: event.clientY,
      };
      moveFunction(displayCoordinates, roomObject);
    }

    function mouseUpRoomObject(event: MouseEvent, roomObject: RoomObject) {
      releaseFunction(roomObject);
    }

    function addTable() {
      const table = roomController.addTable(
        roomId,
        roomWidth / 2,
        roomHeight / 2,
        0,
        500,
        2000
      );
    }

    function addChair() {
      roomController.addChair(roomId, roomWidth / 2, roomHeight / 2, 0);
    }

    return {
      roomObjects,
      touchStart: touchStartRoomObject,
      moveTouch: touchMoveRoomObject,
      getRoomObjectStyle,
      addTable,
      action,
      addChair,
      setAction,
      roomDisplayStyle,
      roomInventoryStyle,
      mouseDownRoomObject: mouseDownRoomObject,
      mouseMoveRoomObject: mouseMoveRoomObject,
      mouseUpRoomObject,
      selectedRoomObject,
      roomObjectErrorStyle,
      touchEnd: touchEndRoomObject,
      stuff: roomController.getRoom(roomId)!,
      roomId,
    };
  },
});
</script>

<style scoped>
.error {
  border: 2px solid red;
  z-index: 2;
}

.not-error {
  z-index: 1;
}
</style>
