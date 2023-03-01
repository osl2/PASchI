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
      <v-icon class="ma-2" @click="activateInteractionList">
        mdi mdi-view-list
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
                @click="selectParticipant(teacher)"
              >
                <div style="font-size: large">Lehrkraft</div></v-btn
              >
            </v-col>
          </v-row>
        </v-list-item>
        <v-row no-gutters>
          <template
            key="participant.getId"
            v-for="participant in filterParticipants(
              courseParticipantsSortedByName
            )"
          >
            <v-card class="v-col-3" @click="selectParticipant(participant)">
              <v-row no-gutters justify="space-around" class="ma-2">
                <v-col class="mr-n4">
                  <v-row no-gutters justify="space-around" class="ma-2">
                    <SeatLabel :participant="participant"></SeatLabel>
                  </v-row>
                </v-col>
                <v-col cols="1" class="ma-1">
                  <v-icon
                    icon="mdi mdi-view-list"
                    @click="activateStudentInteractionList(participant)"
                    v-on:click.stop
                  ></v-icon>
                </v-col>
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
    <v-dialog v-model="studentInteractionListDialog">
      <v-card cols="11">
        <v-card-title>
          <v-row>
            <v-col cols="11" no-gutters
            ><div class="v-col-11">Interaktionen</div></v-col
            >
            <v-col cols="1" no-gutters align-self="start">
              <v-row justify="end">
                <v-icon class="ma-2" @click="studentInteractionListDialog = false">mdi mdi-close</v-icon>
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
            :key="interaction.getId"
            v-for="interaction in studentInteractionsBuffer.reverse()"
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
  </v-main>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from "vue";
import NavigationBar from "@/components/navigation/NavigationBar.vue";
import SideMenu from "@/components/navigation/SideMenu.vue";
import { SessionController } from "@/controller/SessionController";
import { Participant } from "@/model/userdata/interactions/Participant";
import { Category } from "@/model/userdata/interactions/Category";
import { useRouter } from "vue-router";
import { CategoryController } from "@/controller/CategoryController";
import { Course } from "@/model/userdata/courses/Course";
import SeatLabel from "@/components/room/SeatLabel.vue";
import { Quality } from "@/model/userdata/interactions/Quality";
import { Interaction } from "@/model/userdata/interactions/Interaction";
import { CourseController } from "@/controller/CourseController";
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

    const courseController =  CourseController.getCourseController()
    const sessionController = SessionController.getSessionController();
    const categoryController = CategoryController.getCategoryController();

    const categories: Ref<Category[]> = ref(
      categoryController.getCategories()
    ) as Ref<Category[]>;
    const starDialog = ref(false);
    const sessionName = sessionController.getSession(props.sessionId)?.name;
    const courseParticipantsSortedByName: Participant[] =
      getCourseParticipantsSortedByName();
    const teacher = courseController.getTeacher();
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
    const interactionListDialog = ref(false);
    const studentInteractionListDialog = ref(false);
    const interactionListStudentBuffer: Ref<Participant | undefined> = ref<
      Participant | undefined
    >(undefined) as Ref<Participant | undefined>;
    const interactions = computed<Interaction[]>(() => {
      let interactions = sessionController.getInteractionsOfSession(
        props.sessionId
      );
      if (typeof interactions === "undefined") {
        return [];
      }
      return interactions;
    });
    const studentInteractionsBuffer = computed<Interaction[]>(() => {
      let interactions = sessionController.getInteractionsOfParticipant(
        props.sessionId, interactionListStudentBuffer.value!.getId
      );
      if (typeof interactions === "undefined") {
        return [];
      }
      return interactions;
    });

    /**
     * Methode, die die Schüler ausfiltern, deren Name nicht mit der Eingabe im Textfeld übereinstimmt.
     *
     * @param participants
     */
    function filterParticipants(participants: Participant[]): Participant[] {
      let searchInputUpperCase = searchInput.value.toUpperCase();
      return participants.filter((participant) => {
        return (
          (participant.firstName + " " + participant.lastName)
            .toUpperCase()
            .startsWith(searchInputUpperCase) ||
          participant.lastName.toUpperCase().startsWith(searchInputUpperCase)
        );
      });
    }

    /**
     * Methode, die alle Parameter für die Interaktionen zurücksetzt
     */
    function resetInterActionParams() {
      setFirstParticipant(undefined);
      setSecondParticipant(undefined);
      setCategory(undefined);
      categoryQuality.value = 0;
      categoryDialog.value = false;
      starDialog.value = false;
    }

    /**
     * Methode, die zurückgibt, ob ein undo möglich ist
     */
    function getUndoPossible(): boolean {
      let undoPossible = sessionController.hasUndo(props.sessionId);
      if (typeof undoPossible === "boolean") {
        return undoPossible;
      }
      return false;
    }

    /**
     * Methode, die zurückgibt, ob ein redo möglich ist
     */
    function getRedoPossible(): boolean {
      let redoPossible = sessionController.hasRedo(props.sessionId);
      if (typeof redoPossible === "boolean") {
        return redoPossible;
      }
      return false;
    }

    /**
     * Methode, die ein undo auf den Interaktionen ausführt
     */
    function undoClick() {
      sessionController.undoInteraction(props.sessionId);
    }

    /**
     * Methode, die ein redo auf den Interaktionen ausführt
     */
    function redoClick() {
      sessionController.redoInteraction(props.sessionId);
    }

    /**
     * Methode, die alle Kursmitglieder sortiert nach Namen zurückgibt
     */
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

    /**
     * Methode, die die Sitzung beendet, indem sie zum Dashboard leitet
     */
    function finishSessionClick() {
      router.push({
        name: "Dashboard",
      });
    }

    /**
     * Methode, die einen Dialog zur Erstellung von Kategorien aktiviert
     */
    function addCategoryClick() {
      newCategoryName.value = "";
      newCategoryIsRated.value = false;
      newCategoryDialog.value = true;
    }

    /**
     * Methode, die die erstellung einer Interaktion abbricht, indem sie das DialogFeld zum Erstellen von Kategorien schließt
     */
    function cancelAddCategory() {
      newCategoryDialog.value = false;
    }

    /**
     * Methode, die die Kategorie mit den zuvor bestimmten Parametern erstellt
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
     * Methode, die den ersten Teilnehmer der Interaktion setzt
     *
     * @param participant Der zu setzende Teilnehmer
     */
    function setFirstParticipant(participant: Participant | undefined) {
      firstParticipant.value = participant;
    }

    /**
     * Methode, die den zweiten Teilnehmer der Interaktion setzt
     *
     * @param participant Der zu setzende Teilnehmer
     */
    function setSecondParticipant(participant: Participant | undefined) {
      secondParticipant.value = participant;
    }

    /**
     * Methode, die den ersten Teilnehmer setzt, falls noch nicht gesetzt und andernfalls den zweiten setzt und direkt den Kategoriedialog öffnet
     *
     * @param participant Der zu setzende Teilnehmer
     */
    function selectParticipant(participant: Participant) {
      if (typeof firstParticipant.value === "undefined") {
        setFirstParticipant(participant);
      } else {
        setSecondParticipant(participant);
        categoryDialog.value = true;
      }
    }

    /**
     * Methode, die eine Interaktion mit den zuvor bestimmten Parametern erstellt
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
          firstParticipant.value!.getId,
          secondParticipant.value!.getId,
          categoryController.getCategoryWithQuality(
            selectedCategory.value!.name,
            quality
          )!.getId
        );
      } else {
        await sessionController.createInteraction(
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

    /**
     * Setzt die Kategorie für die Interaktion
     *
     * @param category Die zu setzende Interaktion
     */
    function setCategory(category: Category | undefined) {
      selectedCategory.value = category;
    }

    /**
     * Setzt die Kategorie und öffnet, falls nötig den InteraktionsbewertungsDialog
     *
     * @param category Die zu setzende Kategorie
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
     * Erstellt eine Interaktion mit den zuvor bestimmten Parametern und schließt den Interaktionsbewertungsdialog
     */
    function selectQuality() {
      createInteraction();
      starDialog.value = false;
    }

    /**
     * Aktiviert die Interaktionsliste eines Schülers
     *
     * @param participant Schüler der Interaktionsliste
     */
    function activateStudentInteractionList(participant: Participant) {
      interactionListStudentBuffer.value = participant;
      studentInteractionListDialog.value = true;
    }

    /**
     * Aktiviert die Interaktionsliste
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

    return {
      starDialog,
      teacher,
      sessionName,
      searchInput,
      categories,
      courseParticipantsSortedByName,
      secondParticipant,
      categoryDialog,
      categoryQuality,
      undoPossible,
      redoPossible,
      newCategoryDialog,
      newCategoryName,
      newCategoryIsRated,
      interactionListDialog,
      studentInteractionListDialog,
      studentInteractionsBuffer,
      interactionListStudentBuffer,
      interactions,
      activateInteractionList,
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
      activateStudentInteractionList,
      getStars,
    };
  },
});
</script>

<style scoped></style>
