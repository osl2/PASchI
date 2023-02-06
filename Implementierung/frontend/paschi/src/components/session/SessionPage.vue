<template>
  <navigation-bar />
  <side-menu />
  <v-main>

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
import {useRouter} from "vue-router";
import { CategoryController } from "@/controller/CategoryController";
import { Interaction } from "@/model/userdata/interactions/Interaction";
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
    const interactionMapActivated = ref(false)
    const categories: Ref<Category[]> = ref(categoryController.getCategories()) as Ref<Category[]>;
    const roomObjects: Ref<RoomObject[]> = ref(getRoomObjects()) as Ref<
      RoomObject[]
    >;
    const courseParticipants: Ref<Participant[]> = ref(
      getCourseParticipants()
    ) as Ref<Participant[]>;
    const firstParticipant: Ref<Participant | undefined> = ref(undefined);
    const secondParticipant: Ref<Participant | undefined> = ref(undefined);
    const selectedCategory: Ref<Category | undefined> = ref(undefined);
    const interactions: Ref<Interaction[]> = ref(sessionController.getInteractionsOfSession(props.sessionId)) as Ref<Interaction[]>;

    function undoClick() {
      sessionController.deleteInteraction(props.sessionId, interactions.value[interactions.value.length - 1].getId)
    }
    function getRoomObjects(): RoomObject[] {
      if (seatArrangement instanceof SeatArrangement) {
        return seatArrangement.room.roomObjects as RoomObject[];
      }
      return [];
    }
    //Participants for mobile session
    function getCourseParticipants(): Participant[] {
      if (seatArrangement instanceof SeatArrangement) {
        return seatArrangement.course.participants;
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
    function setCategory(category: Category | undefined) {
      selectedCategory.value = category;
    }
    function toggleInteractionMapActivated() {
      interactionMapActivated.value = !interactionMapActivated.value;
    }

    return {
      interactionMapActivated,
      categories,
      roomObjects,
      courseParticipants,
      secondParticipant,
      undoClick,
      toggleInteractionMapActivated,
      finishSessionClick,
      setFirstParticipant,
      setSecondParticipant,
      setCategory
    };
  },
});
</script>

<style scoped></style>
