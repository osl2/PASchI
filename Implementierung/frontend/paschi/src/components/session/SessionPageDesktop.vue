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
      <v-icon class="ma-2" @click="activateInteractionList">
        mdi mdi-view-list
      </v-icon>
      <v-btn color="green" variant="flat" rounded @click="finishSessionClick()">
        Sitzung beenden
      </v-btn>
    </template>
  </NavigationBar>
  <LineOverlay :lines="interactionLines" z-index="10" />
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
  <v-dialog v-model="interactionListDialog">
    <v-card cols="11">
      <v-card-title>
        <v-row>
          <v-col cols="11" no-gutters
          ><div class="v-col-11">Interaktionen</div></v-col
          >
          <v-col cols="1" no-gutters align-self="start">
            <v-row justify="end">
              <v-icon class="ma-2" @click="interactionListDialog = false">mdi mdi-close</v-icon>
            </v-row>
          </v-col>
        </v-row>
      </v-card-title>
      <v-list class="ma-2 v-col-12">
        <v-row class="ma-2">
          <v-col><div>Von</div></v-col>
          <v-col><div>Nach</div></v-col>
          <v-col><div>Katetegorie</div></v-col>
          <v-col><div>Qualität</div></v-col>
          <v-col><div>Zeit</div></v-col>
        </v-row>
        <v-divider />
        <v-row
          class="ma-2"
          key="interaction.getId"
          v-for="interaction in interactions.reverse()"
        >
          <v-col
          ><div>
            {{ interaction.fromParticipant.firstName }}
            {{ interaction.fromParticipant.lastName }}
          </div></v-col
          >
          <v-col
          ><div>
            {{ interaction.toParticipant.firstName }}
            {{ interaction.toParticipant.lastName }}
          </div></v-col
          >
          <v-col
          ><div>{{ interaction.category.name }}</div></v-col
          >
          <v-col>
            <template v-if="interaction.category.hasQuality()">
              <v-icon
                icon="mdi mdi-star"
                v-for="i in getStars(interaction.category.getQuality())"
              ></v-icon>
              <v-icon
                icon="mdi mdi-star-outline"
                v-for="i in 5 - (getStars(interaction.category.getQuality()))"
              ></v-icon>
            </template>
          </v-col>
          <v-col
          ><div>{{ interaction.timeStamp }}</div></v-col
          >
        </v-row>
      </v-list>
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
import {Interaction} from "@/model/userdata/interactions/Interaction";

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

    const interactionListDialog = ref(false);
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
      categoryController.getAllCategories()
    ) as Ref<Category[]>;
    const starDialog = ref(false);
    const sessionName = sessionController.getSession(props.sessionId)?.name;
    const interactions = ref(getAllInteractions());


    function getAllInteractions() {
      let interactions = sessionController.getInteractionsOfSession(
        props.sessionId
      );
      if (typeof interactions === "undefined") {
        return [];
      }
      return interactions;
    }

    /**
     * Gibt Schüler der auf einem Stuhl zurück
     *
     * @param chair Der Stuhl auf dem der Schüler sitzt
     */
    function getParticipant(chair: Chair) {
      return seatArrangement?.getParticipantForSeat(chair);
    }

    const seatLabels = ref([]);

    /**
     * Setzt ersten Schüler einer Interaktion und fängt an eine Linie zu zeichnen, falls das Raumobjekt ein Stuhl mit Schüler ist.
     *
     * @param roomObject Das ausgewählte Raumobjekt
     * @param roomCoordinates Die Raumkoordinaten des ausgewählten Raumobjekts
     * @param displayCoordinates Die Bildschirmkoordinaten des ausgewählten Raumobjekts
     */
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

    /**
     * Setzt zweiten Schüler einer Interaktion, öffnet die Kategorieauswahl und beendet die Linie, falls das Raumobjekt ein Stuhl mit Schüler ist
     *
     * @param roomObject Das ausgewählte Raumobjekt
     * @param roomCoordinates Die Raumkoordinaten des ausgewählten Raumobjekts
     * @param displayCoordinates Die Bildschirmkoordinaten des ausgewählten Raumobjekts
     */
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

    /**
     * Zeichnet eine Linie, falls das Raumobjekt ein Stuhl mit Schüler ist.
     *
     * @param roomObject Das ausgewählte Raumobjekt
     * @param roomCoordinates Die Raumkoordinaten des ausgewählten Raumobjekts
     * @param displayCoordinates Die Bildschirmkoordinaten des ausgewählten Raumobjekts
     */
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
            curve: false,
            id: "interactionLine",
          },
        ];
      }
    }

    /**
     * Gibt zurück, ob ein undo möglich ist.
     */
    function getUndoPossible(): boolean {
      let undoPossible = sessionController.hasUndo(props.sessionId);
      if (typeof undoPossible === "boolean") {
        return undoPossible;
      }
      return false;
    }

    /**
     * Gibt zurück, ob ein redo möglich ist.
     */
    function getRedoPossible(): boolean {
      let redoPossible = sessionController.hasRedo(props.sessionId);
      if (typeof redoPossible === "boolean") {
        return redoPossible;
      }
      return false;
    }

    /**
     * Führt ein undo aus.
     */
    function undoClick() {
      sessionController.undoInteraction(props.sessionId);
    }

    /**
     * Führt ein redo aus.
     */
    function redoClick() {
      sessionController.redoInteraction(props.sessionId);
    }

    /**
     * Beendet eine Sitzung, indem zum Dashboard geleitet wird
     */
    function finishSessionClick() {
      router.push({
        name: "Dashboard",
      });
    }

    /**
     * Öffnet Dialog zum Erstellen einer neuen Kategorie.
     */
    function addCategoryClick() {
      newCategoryName.value = "";
      newCategoryIsRated.value = false;
      newCategoryDialog.value = true;
    }

    /**
     * Der Kategoriedialog wird geschlossen.
     */
    function cancelAddCategory() {
      newCategoryDialog.value = false;
    }

    /**
     * Es wird eine neue Kategorie mit den eingegebenen Parametern erstellt.
     */
    function confirmAddCategory() {
      if (newCategoryIsRated.value) {
        categoryController.createRatedCategory(newCategoryName.value);
      } else {
        categoryController.createCategory(newCategoryName.value);
      }
      newCategoryDialog.value = false;
    }

    /**
     * Setzt die ausgewählte Kategorie für die Interaktion.
     *
     * @param category Die Kategorie für die Interaktion.
     */
    function setCategory(category: Category | undefined) {
      selectedCategory.value = category;
    }

    /**
     * Setzt die Kategorie und öffnet den Qualitätsdialog, falls die Kategorie ausgewählt wurde, andernfalls wird die Kategorie erstellt.
     *
     * @param category DIe zu setzende Kategorie.
     */
    function selectCategory(category: Category) {
      setCategory(category);
      categoryDialog.value = false;
      if (category.hasQuality()) {
        starDialog.value = true;
      } else {
        createInteraction();
      }
    }

    /**
     * Setzt die zuvor gewählte Qualität und erstellt eine Interaktion
     */
    function selectQuality() {
      createInteraction();
      starDialog.value = false;
    }

    /**
     * erstellt eine Kategorie mit den zuvor bestimmten Parametern.
     */
    async function createInteraction() {
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
        await sessionController.createInteraction(
          props.sessionId,
          selectedStudent!.getId,
          targetStudent!.getId,
          categoryController.getCategoryWithQuality(
            selectedCategory.value!.name,
            quality
          )!.getId
        );
      } else {
        await sessionController.createInteraction(
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

    /**
     * Setzt alle zuvor bestimmten Parameter wieder auf ihre Startwerte zurück.
     */
    function resetInterActionParams() {
      selectedStudent = undefined;
      targetStudent = undefined;
      setCategory(undefined);
      categoryQuality.value = 0;
      categoryDialog.value = false;
      starDialog.value = false;
    }

    /**
     * Aktiviert die Anzeige der Interaktionsliste.
     */
    function activateInteractionList() {
      interactionListDialog.value = true;
    }

    function getStars(quality: Quality) {
      switch (quality) {
        case Quality.ONE_STAR:
          return 1;
        case Quality.TWO_STAR:
          return 2;
        case Quality.THREE_STAR:
          return 3;
        case Quality.FOUR_STAR:
          return 4;
        case Quality.FIVE_STAR:
          return 5;
        default:
          return 0
      }
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
      activateInteractionList,
      interactions,
      interactionListDialog,
      categoryDialog,
      categoryQuality,
      undoPossible,
      redoPossible,
      undoClick,
      redoClick,
      selectCategory,
      selectQuality,
      getStars,
      categories,
      selectedCategory,
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
