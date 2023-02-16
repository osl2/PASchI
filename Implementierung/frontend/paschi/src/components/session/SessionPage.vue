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
      <v-icon v-if="undoPossible()" @click="undoClick" class="ma-2">
        mdi mdi-undo
      </v-icon>
      <v-icon v-if="!undoPossible()" color="#999999" class="ma-2">
        mdi mdi-undo
      </v-icon>
      <v-icon v-if="redoPossible()" @click="redoClick" class="ma-2">
        mdi mdi-redo
      </v-icon>
      <v-icon v-if="!redoPossible()" color="#999999" class="ma-2">
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
            <v-card class="v-col-3" @click="setParticipant(participant)">
              <v-row no-gutters justify="space-around" class="ma-2">
                <SeatLabel :participant="participant"></SeatLabel>
              </v-row>
            </v-card>
          </template>
        </v-row>
      </v-list>
    </v-card>
    <v-dialog v-model="categoryDialog">
      <v-card>

        <template
          v-for="category in categories"
        >
          <v-card class="v-col-3" @click="setCategory(category)">
            <v-row no-gutters justify="space-around" class="ma-2">
              {{ category.name }}
            </v-row>
          </v-card>
        </template>
        <v-btn rounded @click="resetInterActionParams">abbrechen</v-btn>
      </v-card>
    </v-dialog>
  </v-main>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
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
    const sessionName = sessionController.getSession(props.sessionId)?.name;
    const courseParticipantsSortedByName: Participant[] =
      getCourseParticipantsSortedByName();
    const teacher = sessionController.getTeacher();
    const firstParticipant: Ref<Participant | undefined> = ref(undefined);
    const secondParticipant: Ref<Participant | undefined> = ref(undefined);
    const selectedCategory: Ref<Category | undefined> = ref(undefined);
    const searchInput = ref("");
    const categoryDialog = ref(false);

    function filterParticipants(participants: Participant[]): Participant[] {
      return participants.filter((participant) => {
        return (participant.firstName + " " + participant.lastName).startsWith(
          searchInput.value
        );
      });
    }
    function resetInterActionParams() {
      setFirstParticipant(undefined);
      setSecondParticipant(undefined);
      setCategory(undefined);
      categoryDialog.value = false;
    }
    function undoPossible(): boolean {
      let undoPossible = sessionController.hasUndo(props.sessionId);
      if (typeof undoPossible === "boolean") {
        return false;
      }
      return false;
    }
    function redoPossible(): boolean {
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
        name: "DashBoard",
      });
    }
    function setFirstParticipant(participant: Participant | undefined) {
      firstParticipant.value = participant;
    }
    function setSecondParticipant(participant: Participant | undefined) {
      firstParticipant.value = participant;
    }
    function setParticipant(participant: Participant) {
      if (typeof firstParticipant.value === "undefined") {
        setFirstParticipant(participant);
      } else {
        setSecondParticipant(participant);
        categoryDialog.value = true;
      }
    }
    function createInteraction() {
      sessionController.createInteraction(
        props.sessionId,
        firstParticipant.value!.getId,
        secondParticipant.value!.getId,
        selectedCategory.value!.getId
      );
      firstParticipant.value = undefined;
      secondParticipant.value = undefined;
      selectedCategory.value = undefined;
    }
    function setCategory(category: Category | undefined) {
      selectedCategory.value = category;
    }

    return {
      sessionName,
      searchInput,
      categories,
      roomObjects,
      courseParticipantsSortedByName,
      secondParticipant,
      categoryDialog,
      resetInterActionParams,
      createInteraction,
      undoClick,
      redoClick,
      undoPossible,
      redoPossible,
      filterParticipants,
      finishSessionClick,
      setParticipant,
      setCategory,
      teacher
    };
  },
});
</script>

<style scoped></style>
