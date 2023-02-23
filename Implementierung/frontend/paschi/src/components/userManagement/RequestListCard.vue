<template>
  <v-card color="primary" min-width="600">
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
            label="suchen nach"
            :items="searchParameters"
            v-model="searchParameter"
        /></v-col>
        <v-col>
          <v-text-field
            v-model="searchInput"
            label="Suche"
            type="input"
          ></v-text-field>
        </v-col>
      </v-row>
    </v-card-item>
    <v-card-item
      v-for="request in requests"
      v-show="!collapsed && includesSearch(request)"
    >
      <v-row align="center">
        <v-col v-show="showName">
          {{ request.firstName }} {{ request.lastName }}
        </v-col>
        <v-col v-show="showEmail">
          {{ request.email }}
        </v-col>
        <v-col v-show="showId">
          {{ request.getId }}
        </v-col>
        <v-col cols="3">
          <v-btn color="#00ff00" @click="authUser(request)">
            <v-icon icon="fas fa-check"></v-icon>
          </v-btn>
          <v-btn color="#ff0000" @click="deleteUser(request)">
            <v-icon icon="fas fa-xmark"></v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card-item>
  </v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref, Ref } from "vue";
import { AdminController } from "@/controller/AdminController";
import { User } from "@/model/User";

export default defineComponent({
  name: "RequestListCard",
  setup() {
    const adminController: AdminController =
      AdminController.getAdminController();
    const requests: Ref<User[]> = ref<User[]>(
      adminController.getUsersNotAuthenticated()
    ) as Ref<User[]>;
    const searchInput = ref("");
    const searchParameters = computed(() => {
      if (
        displayParameter.value === "E-Mail + ID" ||
        displayParameter.value === "alle"
      ) {
        return ["E-Mail", "ID"];
      } else if (displayParameter.value === "Benutzername + E-Mail") {
        searchParameter.value = "E-Mail";
        return ["E-Mail"];
      }
      searchParameter.value = "ID";
      return ["ID"];
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
    function includesSearch(request: User): boolean {
      return (
        (searchParameter.value === "ID" &&
          request.getId.includes(searchInput.value)) ||
        (searchParameter.value === "E-Mail" &&
          request.email.includes(searchInput.value))
      );
    }
    function authUser(user: User) {
      adminController.authUser(user.getId);
    }
    function deleteUser(user: User) {
      adminController.deleteUser(user.getId);
    }
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
      requests,
    };
  },
});
</script>

<style scoped></style>
