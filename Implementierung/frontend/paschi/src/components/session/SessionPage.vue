<template>
  <NavigationBar extended>
    <template v-slot:prepend> Sitzung </template>
    <template v-slot:default class="row justify-center w-100">
      <v-app-bar-title class="v-col-auto">
        {{ sessionName }}
      </v-app-bar-title>
    </template>
    <template v-slot:append>
      <v-btn color="green" variant="flat" rounded @click="finishSessionClick()">
        Sitzung beenden
      </v-btn>
    </template>
    <template v-slot:extension>
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
    </template>
  </NavigationBar>
  <v-main>
    <v-card rounded="0" class="ma-2">
      <v-list>
        <v-list-item>
          <v-row>
            <v-col>
              <v-text-field
                clearable
                v-model="searchInput"
                label="Suche"
                type="input"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-btn
                color="primary"
                variant="flat"
                rounded
                height="56"
                @click=""
              >
                <div style="font-size: large">Lehrkraft</div></v-btn
              >
            </v-col>
          </v-row>
        </v-list-item>
        <v-row no-gutters>
          <template
            v-for="participant in filterParticipants(
              courseParticipantsSortedByName
            )"
          >
            <v-card class="v-col-3" @click="selectParticipant(participant)">
              <v-row no-gutters justify="space-around" class="ma-2">
                <SeatLabel :participant="participant"></SeatLabel>
              </v-row>
            </v-card>
          </template>
        </v-row>
      </v-list>
    </v-card>
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
            <v-card class="v-col-3" @click="addCategoryClick()">
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
  </v-main>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { SessionController } from "@/controller/SessionController";
import { RoomObject } from "@/model/userdata/rooms/RoomObject";
import { Participant } from "@/model/userdata/interactions/Participant";
import { SeatArrangement } from "@/model/userdata/courses/SeatArrangement";
import { Category } from "@/model/userdata/interactions/Category";
import { useRouter } from "vue-router";
import { CategoryController } from "@/controller/CategoryController";
import { Course } from "@/model/userdata/courses/Course";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { Quality } from "@/model/userdata/interactions/Quality";

export default defineComponent({
  name: "SessionPage",
  components: { SeatLabel, SideMenu, NavigationBar },
  props: {
    sessionId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();

    const sessionController = SessionController.getSessionController();
    const categoryController = CategoryController.getCategoryController();

    const seatArrangement = sessionController.getSeatArrangementOfSession(
      props.sessionId
    );
    const categories: Ref<Category[]> = ref(
      categoryController.getCategories()
    ) as Ref<Category[]>;
    const roomObjects: Ref<RoomObject[]> = ref(getRoomObjects()) as Ref<
      RoomObject[]
    >;
    const starDialog = ref(false);
    const sessionName = sessionController.getSession(props.sessionId)?.name;
    const courseParticipantsSortedByName: Participant[] =
      getCourseParticipantsSortedByName();
    // TODO Kommentar entfernen sobald login möglich
    // const teacher = sessionController.getTeacher();
    const firstParticipant: Ref<Participant | undefined> = ref<
      Participant | undefined
    >(undefined) as Ref<Participant | undefined>;
    const secondParticipant: Ref<Participant | undefined> = ref<
      Participant | undefined
    >(undefined) as Ref<Participant | undefined>;
    const selectedCategory: Ref<Category | undefined> = ref<
      Category | undefined
    >(undefined) as Ref<Category | undefined>;
    const searchInput = ref("");
    const categoryDialog = ref(false);
    const categoryQuality = ref(0);
    const undoPossible = computed(() => getUndoPossible());
    const redoPossible = computed(() => getRedoPossible());
    const newCategoryDialog = ref(false);
    const newCategoryName = ref("");
    const newCategoryIsRated = ref(false);

    function filterParticipants(participants: Participant[]): Participant[] {
      let searchInputUpperCase = searchInput.value.toUpperCase();
      return participants.filter((participant) => {
        return (
          (participant.firstName + " " + participant.lastName).startsWith(
            searchInputUpperCase
          ) || participant.lastName.startsWith(searchInputUpperCase)
        );
      });
    }
    function resetInterActionParams() {
      setFirstParticipant(undefined);
      setSecondParticipant(undefined);
      setCategory(undefined);
      categoryQuality.value = 0;
      categoryDialog.value = false;
      starDialog.value = false;
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
    function getRoomObjects(): RoomObject[] {
      if (seatArrangement instanceof SeatArrangement) {
        return seatArrangement.room.roomObjects as RoomObject[];
      }
      return [];
    }
    //Participants for mobile session
    function getCourseParticipantsSortedByName(): Participant[] {
      let course = sessionController.getCourseOfSession(props.sessionId);
      if (course instanceof Course) {
        let participants: Participant[] = [];
        course.participants.forEach((val) => participants.push(val));
        participants = course.participants.sort((a, b) =>
          a.lastName.localeCompare(b.lastName)
        );
        participants = course.participants.sort((a, b) =>
          a.firstName.localeCompare(b.firstName)
        );
        return participants;
      }
      return [];
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
    function setFirstParticipant(participant: Participant | undefined) {
      firstParticipant.value = participant;
    }
    function setSecondParticipant(participant: Participant | undefined) {
      secondParticipant.value = participant;
    }
    function selectParticipant(participant: Participant) {
      if (typeof firstParticipant.value === "undefined") {
        setFirstParticipant(participant);
      } else {
        setSecondParticipant(participant);
        categoryDialog.value = true;
      }
    }
    function createInteraction() {
      console.log(selectedCategory.value!.getId);
      console.log(firstParticipant.value!.getId);
      console.log(secondParticipant.value!.getId);

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
          firstParticipant.value!.getId,
          secondParticipant.value!.getId,
          categoryController.getCategoryWithQuality(
            selectedCategory.value!.name,
            quality
          )!.getId
        );
      } else {
        sessionController.createInteraction(
          props.sessionId,
          firstParticipant.value!.getId,
          secondParticipant.value!.getId,
          selectedCategory.value!.getId
        );
      }

      firstParticipant.value = undefined;
      secondParticipant.value = undefined;
      selectedCategory.value = undefined;
      categoryQuality.value = 0;
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

    return {
      starDialog,
      //teacher, TODO Kommentar entfernen
      sessionName,
      searchInput,
      categories,
      roomObjects,
      courseParticipantsSortedByName,
      secondParticipant,
      categoryDialog,
      categoryQuality,
      undoPossible,
      redoPossible,
      newCategoryDialog,
      newCategoryName,
      newCategoryIsRated,
      resetInterActionParams,
      undoClick,
      redoClick,
      filterParticipants,
      finishSessionClick,
      selectParticipant,
      selectCategory,
      selectQuality,
      addCategoryClick,
      confirmAddCategory,
      cancelAddCategory,
    };
  },
});
</script>

<style scoped></style>
