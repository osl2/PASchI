<template>
  <v-card name="requestCard" color="primary" min-width="600">
    <v-card-title>
      <v-row class="ma-2">
        Accountanträge
        <v-spacer />
        <v-btn @click="toggleCollapse">{{ toggleCollapseMessage }}</v-btn>
      </v-row>
    </v-card-title>
    <v-card-item v-show="!collapsed">
      <v-select
        label="Anzeigeparameter"
        :items="displayParameters"
        v-model="displayParameter"
      />
    </v-card-item>
    <v-card-item v-show="!collapsed">
      <v-row>
        <v-col cols="3">
          <v-select
            name="requestSearchParameters"
            label="suchen nach"
            :items="searchParameters"
            v-model="searchParameter"
        /></v-col>
        <v-col>
          <v-text-field
            name="requestSearch"
            v-model="searchInput"
            label="Suche"
            type="input"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-item>
    <v-card-item
      name="request"
      v-for="request in requests.sort((a, b) => a.email.localeCompare(b.email))"
      v-show="!collapsed && includesSearch(request)"
      :key="request.getId"
    >
      <v-row align="center">
        <v-col v-show="showName">
          {{ request.firstName }} {{ request.lastName }}
        </v-col>
        <v-col name="requestEmail" v-show="showEmail">
          {{ request.email }}
        </v-col>
        <v-col v-show="showId">
          {{ request.getId }}
        </v-col>
        <v-col cols="3">
          <v-btn
            name="authUser"
            :loading="loading.includes(request.getId)"
            color="#00ff00"
            @click="authUser(request)"
          >
            <v-icon icon="fas fa-check"></v-icon>
          </v-btn>
          <v-btn
            :loading="loading.includes(request.getId)"
            color="#ff0000"
            @click="deleteUser(request)"
          >
            <v-icon icon="fas fa-xmark"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import { AdminController } from "@/controller/AdminController";
import { User } from "@/model/User";

export default defineComponent({
  name: "RequestListCard",
  props: {
    requests: {
      type: Array as () => User[],
      required: true,
    },
  },
  emits: ["updateRequests"],
  setup(props, { emit }) {
    const adminController: AdminController =
      AdminController.getAdminController();
    const loading = ref<String[]>([]);

    const searchInput = ref("");
    const searchParameters = computed(() => {
      if (
        displayParameter.value === "E-Mail + ID"
      ) {
        if (!displayParameter.value.includes(searchParameter.value)) {
          searchParameter.value = "ID";
        }
        return ["E-Mail", "ID"];
      } else if (
        displayParameter.value === "alle"
      ) {
        return ["E-Mail", "ID" , "Benutzername"];
      }
      else if (displayParameter.value === "Benutzername + E-Mail") {
        if (!displayParameter.value.includes(searchParameter.value)) {
          searchParameter.value = "E-Mail";
        }
        return ["E-Mail", "Benutzername"];
      }
      if (!displayParameter.value.includes(searchParameter.value)) {
        searchParameter.value = "ID";
      }
      return ["ID", "Benutzername"];
    });
    const searchParameter = ref("ID");
    const collapsed = ref(true);
    const toggleCollapseMessage = ref("ausklappen");
    const displayParameters: string[] = [
      "Benutzername + ID",
      "Benutzername + E-Mail",
      "E-Mail + ID",
      "alle",
    ];
    const displayParameter = ref("alle");
    const showId = computed(() => {
      return (
        displayParameter.value === "Benutzername + ID" ||
        displayParameter.value === "alle" ||
        displayParameter.value === "E-Mail + ID"
      );
    });
    const showName = computed(() => {
      return (
        displayParameter.value === "Benutzername + ID" ||
        displayParameter.value === "alle" ||
        displayParameter.value === "Benutzername + E-Mail"
      );
    });
    const showEmail = computed(() => {
      return (
        displayParameter.value === "Benutzername + E-Mail" ||
        displayParameter.value === "E-Mail + ID" ||
        displayParameter.value === "alle"
      );
    });

    /**
     * Gibt zurück, ob der Account in der Suche inkludiert ist.
     *
     * @param user Der Account.
     */
    function includesSearch(user: User): boolean {
      return (
        (searchParameter.value === "ID" &&
          user.getId.includes(searchInput.value)) ||
        (searchParameter.value === "E-Mail" &&
          user.email.toUpperCase().includes(searchInput.value.toUpperCase())) ||
        (searchParameter.value === "Benutzername" &&
          (user.firstName + " " + user.lastName).toUpperCase().includes(searchInput.value.toUpperCase()))
      );
    }

    /**
     * Authentifiziert den Benutzer.
     *
     * @param user Der Benutzer.
     */
    async function authUser(user: User) {
      loading.value.push(user.getId);
      await adminController.authUser(user.getId).then(() => {
        loading.value = loading.value.filter((id) => id !== user.getId);
        emit("updateRequests");
      })
    }

    /**
     * Löscht einen Benutzer.
     *
     * @param user Der Nutzer, der gelöscht wird.
     */
    async function deleteUser(user: User) {
      loading.value.push(user.getId);
      await adminController.deleteUser(user.getId).then(() => {
        loading.value = loading.value.filter((id) => id !== user.getId);
        emit("updateRequests");
      });
    }

    /**
     * Wechselt Zustand der Liste (eingeklappt/ aufgeklappt).
     */
    function toggleCollapse() {
      collapsed.value = !collapsed.value;
      if (collapsed.value) {
        toggleCollapseMessage.value = "ausklappen";
      } else {
        toggleCollapseMessage.value = "einklappen";
      }
    }
    return {
      toggleCollapse,
      authUser,
      deleteUser,
      includesSearch,
      searchParameter,
      searchParameters,
      showEmail,
      showName,
      showId,
      displayParameters,
      displayParameter,
      collapsed,
      toggleCollapseMessage,
      searchInput,
      loading,
    };
  },
});
</script>

<style scoped></style>
