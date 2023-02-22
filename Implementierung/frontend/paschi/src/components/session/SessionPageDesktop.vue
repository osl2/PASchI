<template>
  <NavigationBar extended>
    <template v-slot:prepend> Sitzung </template>
    <template v-slot:default class="row justify-center w-100">
      <v-app-bar-title class="v-col-auto">
        {{ sessionName }}
      </v-app-bar-title>
    </template>
    <template v-slot:append>
      <v-icon v-if="undoPossible" @click="undoClick" class="ma-2">
        mdi mdi-undo
      </v-icon>
      <v-icon v-if="!undoPossible" color="#999999" class="ma-2">
        mdi mdi-undo
      </v-icon>
      <v-icon v-if="redoPossible" @click="redoClick" class="ma-2">
        mdi mdi-redo
      </v-icon>
      <v-icon v-if="!redoPossible" color="#999999" class="ma-2">
        mdi mdi-redo
      </v-icon>
      <v-btn color="green" variant="flat" rounded @click="finishSessionClick()">
        Sitzung beenden
      </v-btn>
    </template>
  </NavigationBar>
  <LineOverlay :lines="interactionLines" style="z-index: 10" />
  <RoomDisplay
    style="z-index: 5"
    no-drag
    :room-id="roomId"
    @selectRoomObject="selectStudent"
    @dragRoomObject="drag"
    @deselectRoomObject="selectTargetStudent"
  >
    <template v-slot:chair="chair">
      <SeatLabel
        :ref="
          (el) =>
            (seatLabels[getParticipant(chair.chair)?.getId ?? undefined] = el)
        "
        :chair="chair.chair"
        :participant="getParticipant(chair.chair)"
      />
    </template>
  </RoomDisplay>
  <v-dialog v-model="categoryDialog" persistent>
    <v-card>
      <v-container>
        <v-row no-gutters>
          <template v-for="category in categories">
            <v-card class="v-col-3" @click="selectCategory(category)">
              <v-row no-gutters justify="space-around" class="ma-2">
                {{ category.name }}
              </v-row>
            </v-card>
          </template>
          <v-card class="v-col-3" @click="addCategoryClick()" color="#eeeeee">
            <v-row no-gutters justify="space-around" class="ma-2">
              <v-icon icon="mdi mdi-plus"></v-icon>
            </v-row>
          </v-card>
        </v-row>
        <v-row justify="space-around">
          <v-btn
            rounded
            color="primary"
            class="v-col-6 ma-2"
            @click="resetInterActionParams"
          >abbrechen</v-btn
          >
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
  <v-dialog v-model="starDialog" persistent>
    <v-card>
      <v-container>
        <v-row no-gutters justify="space-around" class="ma-2">
          <v-rating
            v-model="categoryQuality"
            @update:modelValue="selectQuality()"
            class="ma-2"
            :item-labels="['schlecht', '', '', '', 'gut']"
            item-label-position="top"
          ></v-rating>
        </v-row>
        <v-row justify="space-around">
          <v-btn
            rounded
            color="primary"
            class="v-col-6 ma-2"
            @click="resetInterActionParams"
          >abbrechen</v-btn
          >
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
  <v-dialog v-model="newCategoryDialog" class="v-col-10">
    <v-card>
      <v-container>
        <v-row>
          <v-text-field
            v-model="newCategoryName"
            variant="outlined"
            label="Name der neuen Kategorie"
            type="input"
            class="v-col-8"
          ></v-text-field>
          <v-checkbox
            label="bewertete Kategorie"
            v-model="newCategoryIsRated"
          ></v-checkbox>
        </v-row>
        <v-row justify="center">
          <v-btn
            height="50"
            width="150"
            @click="cancelAddCategory"
            variant="tonal"
            class="ma-2"
          >Abbrechen</v-btn
          >
          <v-btn
            type="submit"
            height="50"
            width="150"
            @click="confirmAddCategory"
            variant="tonal"
            color="primary"
            class="ma-2"
          >Bestätigen</v-btn
          >
        </v-row>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import { SessionController } from "@/controller/SessionController";
import RoomDisplay from "@/components/room/RoomDisplay.vue";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { Participant } from "@/model/userdata/interactions/Participant";
import { Chair } from "@/model/userdata/rooms/Chair";
import LineOverlay from "@/components/room/LineOverlay.vue";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { Coordinate } from "@/components/room/Coordinate";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import router from "@/plugins/router";
import {CategoryController} from "@/controller/CategoryController";
import {Category} from "@/model/userdata/interactions/Category";
import {Quality} from "@/model/userdata/interactions/Quality";

export default defineComponent({
  name: "SessionPageDesktop",
  components: { NavigationBar, LineOverlay, SeatLabel, RoomDisplay },
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const sessionController = SessionController.getSessionController();
    const categoryController = CategoryController.getCategoryController()
    const sessionId = props.sessionId;
    const seatArrangement =
      sessionController.getSeatArrangementOfSession(sessionId);
    const roomId = seatArrangement?.room.getId;

    let selectedStudent: Participant | undefined = undefined;

    let targetStudent: Participant | undefined = undefined;

    const dragPosition: Ref<Coordinate | undefined> = ref(undefined);

    const dragStart: Ref<Coordinate | undefined> = ref(undefined);

    const categoryDialog = ref(false);
    const categoryQuality = ref(0);
    const undoPossible = computed(() => getUndoPossible());
    const redoPossible = computed(() => getRedoPossible());
    const newCategoryDialog = ref(false);
    const newCategoryName = ref("");
    const newCategoryIsRated = ref(false);
    const selectedCategory: Ref<Category | undefined> = ref<
      Category | undefined
    >(undefined) as Ref<Category | undefined>;

    const categories: Ref<Category[]> = ref(
      categoryController.getCategories()
    ) as Ref<Category[]>;
    const starDialog = ref(false);
    const sessionName = sessionController.getSession(props.sessionId)?.name;

    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    const seatLabels = ref([]);

    function selectStudent(
      roomObject: RoomObject,
      roomCoordinates: Coordinate,
      displayCoordinates: Coordinate
    ) {
      if (roomObject instanceof Chair && getParticipant(roomObject)) {
        selectedStudent = getParticipant(roomObject);
        dragStart.value = displayCoordinates;
      }
    }

    function selectTargetStudent(
      roomObject: RoomObject,
      roomCoordinates: Coordinate,
      displayCoordinates: Coordinate
    ) {
      if (roomObject instanceof Chair && getParticipant(roomObject) && getParticipant(roomObject) != selectedStudent) {
        targetStudent = getParticipant(roomObject);
        dragPosition.value = displayCoordinates;
        categoryDialog.value = true;
      }
    }

    function drag(
      roomObject: RoomObject,
      roomCoordinates: Coordinate,
      displayCoordinates: Coordinate
    ) {
      if (roomObject instanceof Chair && getParticipant(roomObject)) {
        dragPosition.value = displayCoordinates;
        interactionLines.value = [
          {
            x1: dragStart.value?.x,
            y1: dragStart.value?.y,
            x2: dragPosition.value?.x,
            y2: dragPosition.value?.y,
          },
        ];
      }
    }

    function getUndoPossible(): boolean {
      let undoPossible = sessionController.hasUndo(props.sessionId);
      if (typeof undoPossible === "boolean") {
        return undoPossible;
      }
      return false;
    }
    function getRedoPossible(): boolean {
      let redoPossible = sessionController.hasRedo(props.sessionId);
      if (typeof redoPossible === "boolean") {
        return redoPossible;
      }
      return false;
    }
    function undoClick() {
      sessionController.undoInteraction(props.sessionId);
    }
    function redoClick() {
      sessionController.redoInteraction(props.sessionId);
    }

    function finishSessionClick() {
      router.push({
        name: "Dashboard",
      });
    }
    function addCategoryClick() {
      newCategoryName.value = "";
      newCategoryIsRated.value = false;
      newCategoryDialog.value = true;
    }
    function cancelAddCategory() {
      newCategoryDialog.value = false;
    }
    function confirmAddCategory() {
      if (newCategoryIsRated.value) {
        categoryController.createRatedCategory(newCategoryName.value);
      } else {
        categoryController.createCategory(newCategoryName.value);
      }
      newCategoryDialog.value = false;
    }

    function setCategory(category: Category | undefined) {
      selectedCategory.value = category;
    }
    function selectCategory(category: Category) {
      setCategory(category);
      categoryDialog.value = false;
      if (category.hasQuality()) {
        starDialog.value = true;
      } else {
        createInteraction();
      }
    }
    function selectQuality() {
      createInteraction();
      starDialog.value = false;
    }

    function createInteraction() {

      if (selectedCategory.value!.hasQuality()) {
        let quality: Quality;
        switch (categoryQuality.value) {
          case 1:
            quality = Quality.ONE_STAR;
            break;
          case 2:
            quality = Quality.TWO_STAR;
            break;
          case 3:
            quality = Quality.THREE_STAR;
            break;
          case 4:
            quality = Quality.FOUR_STAR;
            break;
          default:
            quality = Quality.FIVE_STAR;
            break;
        }
        sessionController.createInteraction(
          props.sessionId,
          selectedStudent!.getId,
          targetStudent!.getId,
          categoryController.getCategoryWithQuality(
            selectedCategory.value!.name,
            quality
          )!.getId
        );
      } else {
        sessionController.createInteraction(
          props.sessionId,
          selectedStudent!.getId,
          targetStudent!.getId,
          selectedCategory.value!.getId
        );
      }

      selectedStudent = undefined;
      targetStudent = undefined;
      selectedCategory.value = undefined;
      categoryQuality.value = 0;
    }

    function resetInterActionParams() {
      selectedStudent = undefined;
      targetStudent = undefined;
      setCategory(undefined);
      categoryQuality.value = 0;
      categoryDialog.value = false;
      starDialog.value = false;
    }

    const interactionLines = ref();

    return {
      roomId,
      seatLabels,
      getParticipant,
      selectStudent,
      selectTargetStudent,
      interactionLines,
      finishSessionClick,
      addCategoryClick,
      drag,
      cancelAddCategory,
      confirmAddCategory,
      resetInterActionParams,
      categoryDialog,
      categoryQuality,
      undoPossible,
      redoPossible,
      undoClick,
      redoClick,
      selectCategory,
      selectQuality,
      categories,
      selectedCategory,
      setCategory,
      starDialog,
      sessionName,
      newCategoryName,
      newCategoryIsRated,
      newCategoryDialog,
    };
  },
});
</script>

<style scoped></style>
