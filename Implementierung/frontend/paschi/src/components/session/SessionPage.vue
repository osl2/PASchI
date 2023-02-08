<template>
  <navigation-bar />
  <side-menu />
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
              <v-btn color="primary" variant="flat" rounded height="56" @click=""
                ><div style="font-size: large">Lehrkraft</div></v-btn
              >
            </v-col>
          </v-row>
        </v-list-item>
        <template
          v-for="participant in courseParticipantsSortedByName.filter(
            (participant) => {
              (participant.firstName + ' ' + participant.lastName).startsWith(
                searchInput
              );
            }
          )"
        >
          <v-divider />
          <v-list-item
            @click="setParticipant(participant)"
          >
            {{ participant.firstName }} {{ participant.lastName }}
          </v-list-item>
        </template>
      </v-list>
    </v-card>
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
import { Interaction } from "@/model/userdata/interactions/Interaction";
import { Course } from "@/model/userdata/courses/Course";
export default defineComponent({
  name: "SessionPage",
  components: { SideMenu, NavigationBar },
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
    const interactionMapActivated = ref(false);
    const categories: Ref<Category[]> = ref(
      categoryController.getCategories()
    ) as Ref<Category[]>;
    const roomObjects: Ref<RoomObject[]> = ref(getRoomObjects()) as Ref<
      RoomObject[]
    >;
    const courseParticipantsSortedByName: Participant[] =
      getCourseParticipantsSortedByName();
    const firstParticipant: Ref<Participant | undefined> = ref(undefined);
    const secondParticipant: Ref<Participant | undefined> = ref(undefined);
    const selectedCategory: Ref<Category | undefined> = ref(undefined);
    const interactions: Ref<Interaction[]> = ref(
      sessionController.getInteractionsOfSession(props.sessionId)
    ) as Ref<Interaction[]>;
    const searchInput = ref("");

    function undoClick() {
      sessionController.deleteInteraction(
        props.sessionId,
        interactions.value[interactions.value.length - 1].getId
      );
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
      if ((firstParticipant.value = undefined)) {
        setFirstParticipant(participant);
      } else {
        setParticipant(participant);
      }
    }
    function setCategory(category: Category | undefined) {
      selectedCategory.value = category;
    }
    function toggleInteractionMapActivated() {
      interactionMapActivated.value = !interactionMapActivated.value;
    }

    return {
      searchInput,
      interactionMapActivated,
      categories,
      roomObjects,
      courseParticipantsSortedByName,
      secondParticipant,
      undoClick,
      toggleInteractionMapActivated,
      finishSessionClick,
      setParticipant,
      setCategory,
    };
  },
});
</script>

<style scoped></style>
