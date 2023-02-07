<template>
  <NavigationBar>
    <template v-slot:prepend> Raum bearbeiten </template>
    <template v-slot:default class="row justify-center w-100">
      <v-app-bar-title class="v-col-auto">
        {{ roomName }}
      </v-app-bar-title>
    </template>
    <template v-slot:append>
      <v-btn color="green" variant="flat" rounded @click="saveClick()"
        >speichern</v-btn
      >
    </template>
  </NavigationBar>
  <RoomDisplay
    :room-id="roomId"
    @select-room-object="selectRoomObject"
    @drag-room-object="dragRoomObject"
    @deselectRoomObject="releaseRoomObject"
  >
    <template v-slot:left>
      <v-snackbar
        width="1000"
        variant="tonal"
        v-model="easterEgg"
        color="primary"
        timeout="4000"
      >
        <v-icon>mdi mdi-egg</v-icon>
        Snelting glaubt nicht, dass du so große Tische hast. <br />
        Lügen = Betrug = Strafe = 0 Punkte = Exmatrikulation
        <template v-slot:actions>
          <v-icon>fas fa-person-military-pointing</v-icon>
          <v-icon>fas fa-otter</v-icon>
        </template>
      </v-snackbar>
      <v-card :style="roomInventoryStyle" :class="roomInventoryClass">
        <v-btn
          width="70"
          height="70"
          class="ma-1"
          variant="tonal"
          color="secondary"
          @click="addTable"
        >
          <v-badge icon="mdi mdi-plus" color="green">
            <v-icon size="30">mdi mdi-table-furniture</v-icon>
          </v-badge>
        </v-btn>
        <v-btn
          width="70"
          height="70"
          class="ma-1"
          variant="tonal"
          color="secondary"
          @click="addChair"
        >
          <v-badge icon="mdi mdi-plus" color="green">
            <v-icon size="30">mdi mdi-seat-outline</v-icon>
          </v-badge>
        </v-btn>
        <v-btn-toggle
          class="ma-1"
          v-model="action"
          color="primary"
          mandatory
          :style="toggleActionStyle"
        >
          <v-btn
            :style="toggleButton1Style"
            width="70"
            height="70"
            variant="tonal"
            icon="mdi mdi-cursor-move"
            value="translate"
          />
          <v-btn
            width="70"
            height="70"
            variant="tonal"
            icon="mdi mdi-rotate-left"
            value="rotate"
          />
          <v-btn
            width="70"
            height="70"
            variant="tonal"
            icon="mdi mdi-resize"
            value="resize"
          />
          <v-btn
            :style="toggleButton2Style"
            width="70"
            height="70"
            variant="tonal"
            color="red"
            icon="mdi mdi-close"
            value="delete"
          />
        </v-btn-toggle>
      </v-card>
    </template>
  </RoomDisplay>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { RoomController } from "@/controller/RoomController";
import { Coordinate } from "@/components/room/Coordinate";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import { useRouter } from "vue-router";
import { Chair } from "@/model/userdata/rooms/Chair";
import RoomDisplay from "@/components/room/RoomDisplay.vue";

export default defineComponent({
  name: "RoomEditor.vue",
  components: { RoomDisplay, NavigationBar },
  props: {
    roomId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const roomController = RoomController.getRoomController();

    const roomId = props.roomId;

    const roomObjects = computed(() => roomController.getRoomObjects(roomId));

    const roomWidth = 16180;
    const roomHeight = 10000;

    let translationOffset: Coordinate = { x: 0, y: 0 };

    const roomInventoryOnBottom = false;

    const roomInventoryStyle = {
      position: "absolute",
      top: roomInventoryOnBottom ? "auto" : "0px",
      bottom: roomInventoryOnBottom ? "0px" : "auto",
      left: "0px",
      width: roomInventoryOnBottom ? "100%" : "80px",
      height: roomInventoryOnBottom ? "80px" : "100%",
    };

    const roomInventoryClass = {
      "d-flex": true,
      "flex-column": !roomInventoryOnBottom,
      "flex-row": roomInventoryOnBottom,
      "justify-center": true,
      "align-center": true,
    };

    const toggleActionStyle = {
      flexDirection: roomInventoryOnBottom ? "row" : "column",
      height: roomInventoryOnBottom ? "70px" : "auto",
    };

    const toggleButton1Style = {
      borderTopLeftRadius: "5px",
      borderTopRightRadius: roomInventoryOnBottom ? "0px" : "5px",
      borderBottomLeftRadius: roomInventoryOnBottom ? "5px" : "0px",
      borderBottomRightRadius: "0px",
    };

    const toggleButton2Style = {
      borderTopLeftRadius: "0px",
      borderTopRightRadius: roomInventoryOnBottom ? "5px" : "0px",
      borderBottomLeftRadius: roomInventoryOnBottom ? "0px" : "5px",
      borderBottomRightRadius: "5px",
    };

    const roomObjectErrorStyle = ref(false);

    const action = ref<string>("translate");

    const selectFunction = computed(() => {
      switch (action.value) {
        case "translate":
          return initializeRoomObjectGrabCoordinates;
        case "rotate":
          return initializeRoomObjectRotationCoordinates;
        case "resize":
          return initializeRoomObjectResizeCoordinates;
        case "delete":
          return deleteRoomObject;
      }
    });

    const moveFunction = computed(() => {
      switch (action.value) {
        case "translate":
          return translateRoomObjectToDisplayCoordinates;
        case "rotate":
          return rotateRoomObject;
        case "resize":
          return resizeRoomObject;
        case "delete":
          return () => {};
      }
    });

    const releaseFunction = computed(() => {
      switch (action.value) {
        case "translate":
          return endTranslationRoomObject;
        case "rotate":
          return finalizeRoomObjectRotation;
        case "resize":
          return finalizeRoomObjectResize;
        case "delete":
          return () => {};
      }
    });

    //detects collisions with other room objects using the separating axis theorem
    function roomObjectOverlaps(
      roomObject: RoomObject,
      roomObjects: RoomObject[]
    ) {
      const roomObjectVertices = getRoomObjectVertices(roomObject);
      for (let i = 0; i < 4; i++) {
        if (
          roomObjectVertices[i].x < 0 ||
          roomObjectVertices[i].x > roomWidth ||
          roomObjectVertices[i].y < 0 ||
          roomObjectVertices[i].y > roomHeight
        ) {
          return true;
        }
      }
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

    function getRoomObjectVertices(roomObject: RoomObject): Coordinate[] {
      const roomObjectOrigin = getRoomObjectOrigin(roomObject);
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

    function separatedAxisCollide(
      roomObject1: RoomObject,
      roomObject2: RoomObject
    ) {
      const roomObject1Vertices = getRoomObjectVertices(roomObject1);
      const roomObject2Vertices = getRoomObjectVertices(roomObject2);
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

        if (
          roomObject1Max < roomObject2Min ||
          roomObject2Max < roomObject1Min
        ) {
          return false;
        }
      }
      return true;
    }

    let lastValidTranslationCoordinate: Coordinate = { x: 0, y: 0 };

    let previousRotationCoordinate: Coordinate = { x: 0, y: 0 };

    let lastValidRotation = 0;

    let previousResizeCoordinate: Coordinate = { x: 0, y: 0 };

    let lastValidResize: Coordinate = { x: 0, y: 0 };

    function calculateRoomObjectResize(
      roomObject: RoomObject,
      currentCoordinate: Coordinate
    ) {
      const origin = getRoomObjectOrigin(roomObject);
      const previousCoordinateFromOrigin = {
        x: previousResizeCoordinate.x - origin.x,
        y: previousResizeCoordinate.y - origin.y,
      };
      const currentCoordinateFromOrigin = {
        x: currentCoordinate.x - origin.x,
        y: currentCoordinate.y - origin.y,
      };

      const roomObjectVertices = getRoomObjectVertices(roomObject);

      const normalizedRoomObjectVertical = {
        x:
          (roomObjectVertices[1].x - roomObjectVertices[0].x) /
          Math.sqrt(
            Math.pow(roomObjectVertices[1].x - roomObjectVertices[0].x, 2) +
              Math.pow(roomObjectVertices[1].y - roomObjectVertices[0].y, 2)
          ),
        y:
          (roomObjectVertices[1].y - roomObjectVertices[0].y) /
          Math.sqrt(
            Math.pow(roomObjectVertices[1].x - roomObjectVertices[0].x, 2) +
              Math.pow(roomObjectVertices[1].y - roomObjectVertices[0].y, 2)
          ),
      };

      const normalizedRoomObjectHorizontal = {
        x:
          (roomObjectVertices[0].x - roomObjectVertices[3].x) /
          Math.sqrt(
            Math.pow(roomObjectVertices[0].x - roomObjectVertices[3].x, 2) +
              Math.pow(roomObjectVertices[0].y - roomObjectVertices[3].y, 2)
          ),
        y:
          (roomObjectVertices[0].y - roomObjectVertices[3].y) /
          Math.sqrt(
            Math.pow(roomObjectVertices[0].x - roomObjectVertices[3].x, 2) +
              Math.pow(roomObjectVertices[0].y - roomObjectVertices[3].y, 2)
          ),
      };

      const directionVertical = Math.sign(
        currentCoordinateFromOrigin.x * normalizedRoomObjectVertical.x +
          currentCoordinateFromOrigin.y * normalizedRoomObjectVertical.y
      );

      const directionHorizontal = Math.sign(
        currentCoordinateFromOrigin.x * normalizedRoomObjectHorizontal.x +
          currentCoordinateFromOrigin.y * normalizedRoomObjectHorizontal.y
      );

      const resizeDelta: Coordinate = {
        x:
          directionHorizontal *
          ((currentCoordinateFromOrigin.x - previousCoordinateFromOrigin.x) *
            normalizedRoomObjectHorizontal.x +
            (currentCoordinateFromOrigin.y - previousCoordinateFromOrigin.y) *
              normalizedRoomObjectHorizontal.y),
        y:
          directionVertical *
          ((currentCoordinateFromOrigin.x - previousCoordinateFromOrigin.x) *
            normalizedRoomObjectVertical.x +
            (currentCoordinateFromOrigin.y - previousCoordinateFromOrigin.y) *
              normalizedRoomObjectVertical.y),
      };

      return resizeDelta;
    }

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

    const easterEgg = ref<boolean>(false);

    function resizeRoomObject(
      roomCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      if (roomObject instanceof Chair) {
        return;
      }
      const resizeDelta = calculateRoomObjectResize(
        roomObject,
        roomCoordinates
      );
      roomObject.dimensions.width += resizeDelta.x * 2;
      roomObject.dimensions.length += resizeDelta.y * 2;
      roomObject.position.xCoordinate -= resizeDelta.x;
      roomObject.position.yCoordinate -= resizeDelta.y;
      if (roomObject.dimensions.width < 300) {
        roomObject.dimensions.width = lastValidResize.x;
        roomObject.position.xCoordinate = lastValidTranslationCoordinate.x;
      }
      if (roomObject.dimensions.length < 300) {
        roomObject.dimensions.length = lastValidResize.y;
        roomObject.position.yCoordinate = lastValidTranslationCoordinate.y;
      }
      if (
        roomObject.dimensions.width > 7000 &&
        roomObject.dimensions.length > 7000
      ) {
        //uncomment to activate Easter egg
        //easterEgg.value = true;
      }
      if (!roomObjectOverlaps(roomObject, roomObjects.value!)) {
        lastValidResize = {
          x: roomObject.dimensions.width,
          y: roomObject.dimensions.length,
        };
        lastValidTranslationCoordinate = {
          x: roomObject.position.xCoordinate,
          y: roomObject.position.yCoordinate,
        };
        roomObjectErrorStyle.value = false;
      } else {
        roomObjectErrorStyle.value = true;
      }
      previousResizeCoordinate = roomCoordinates;
    }

    function initializeRoomObjectResizeCoordinates(
      roomCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      previousResizeCoordinate = roomCoordinates;
      lastValidResize = {
        x: roomObject.dimensions.width,
        y: roomObject.dimensions.length,
      };
      lastValidTranslationCoordinate = {
        x: roomObject.position.xCoordinate,
        y: roomObject.position.yCoordinate,
      };
    }

    function finalizeRoomObjectResize(roomObject: RoomObject) {
      roomObject.dimensions.width = lastValidResize.x;
      roomObject.dimensions.length = lastValidResize.y;
      roomObject.position.xCoordinate = lastValidTranslationCoordinate.x;
      roomObject.position.yCoordinate = lastValidTranslationCoordinate.y;
      roomObjectErrorStyle.value = false;
    }

    function deleteRoomObject(
      displayCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      roomController.removeRoomObject(roomId, roomObject.getId);
    }

    function initializeRoomObjectRotationCoordinates(
      roomCoordinate: Coordinate,
      roomObject: RoomObject
    ) {
      previousRotationCoordinate = roomCoordinate;
      lastValidRotation = roomObject.position.orientation;
    }

    function rotateRoomObject(
      roomCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      const angle = calculateRoomObjectRotation(roomObject, roomCoordinates);
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
      roomObjectErrorStyle.value = false;
    }

    function initializeRoomObjectGrabCoordinates(
      roomCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      translationOffset = {
        x: roomCoordinates.x - roomObject.position.xCoordinate,
        y: roomCoordinates.y - roomObject.position.yCoordinate,
      };
      lastValidTranslationCoordinate = {
        x: roomObject.position.xCoordinate,
        y: roomObject.position.yCoordinate,
      };
    }

    function translateRoomObjectToDisplayCoordinates(
      roomCoordinates: Coordinate,
      roomObject: RoomObject
    ) {
      const newPosition = {
        x: roomCoordinates.x - translationOffset.x,
        y: roomCoordinates.y - translationOffset.y,
      };
      roomObject.position.xCoordinate = newPosition.x;
      roomObject.position.yCoordinate = newPosition.y;
      if (!roomObjectOverlaps(roomObject, roomObjects.value!)) {
        lastValidTranslationCoordinate = newPosition;
        roomObjectErrorStyle.value = false;
      } else {
        roomObjectErrorStyle.value = true;
      }
    }

    function endTranslationRoomObject(roomObject: RoomObject) {
      if (
        roomObjectOverlaps(roomObject, roomController.getRoomObjects(roomId)!)
      ) {
        roomObject.position.xCoordinate = lastValidTranslationCoordinate.x;
        roomObject.position.yCoordinate = lastValidTranslationCoordinate.y;
      }
      roomObjectErrorStyle.value = false;
    }

    function addTable() {
      roomController.addTable(
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

    function selectRoomObject(roomObject: RoomObject, roomCoordinates: Coordinate, displayCoordinates: Coordinate) {
      selectFunction.value!(roomCoordinates, roomObject);
    }

    function dragRoomObject(roomObject: RoomObject, roomCoordinates: Coordinate, displayCoordinates: Coordinate) {
      moveFunction.value!(roomCoordinates, roomObject);
    }

    function releaseRoomObject(roomObject: RoomObject, roomCoordinates: Coordinate, displayCoordinates: Coordinate) {
      releaseFunction.value!(roomObject);
    }

    function saveClick() {
      router.back();
    }

    return {
      addTable,
      addChair,
      selectRoomObject,
      dragRoomObject,
      releaseRoomObject,
      action,
      roomInventoryStyle,
      roomObjectErrorStyle,
      roomId,
      toggleActionStyle,
      toggleButton1Style,
      toggleButton2Style,
      roomInventoryClass,
      easterEgg,
      roomName: roomController.getRoom(roomId)!.name,
      saveClick,
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
