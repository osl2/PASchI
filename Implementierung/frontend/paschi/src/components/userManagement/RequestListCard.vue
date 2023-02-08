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
        <v-col>
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
import { Role } from "@/model/Role";
import { UserController } from "@/controller/UserController";

export default defineComponent({
  name: "RequestListCard",
  setup() {
    const userController: UserController = UserController.getUserController();
    userController.register("David", "nachname1", "email1", "", "");
    userController.register("Cian", "nachname2", "email2", "", "");
    userController.register("Aaron", "nachname3", "email3", "", "");
    userController.register("Luka", "nachname4", "email4", "", "");
    userController.register("Florian", "nachname5", "email5", "", "");
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
      }
      searchParameter.value = "ID";
      return ["ID"];
    });
    const searchParameter = ref("ID");
    const collapsed = ref(true);
    const toggleCollapseMessage = ref("ausklappen");
    const displayParameters: string[] = [
      "Benutzername + ID",
      "E-Mail + ID",
      "alle",
    ];
    const displayParameter = ref("alle");
    const showName = computed(() => {
      return (
        displayParameter.value === "Benutzername + ID" ||
        displayParameter.value === "alle"
      );
    });
    const showEmail = computed(() => {
      return (
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
      displayParameters,
      displayParameter,
      collapsed,
      toggleCollapseMessage,
      searchInput,
      requests: [
        new User(
          undefined,
          0,
          "David",
          "nachname1",
          "email1",
          false,
          Role.USER,
          ""
        ),
        new User(
          undefined,
          1,
          "Cian",
          "nachname2",
          "email1",
          false,
          Role.USER,
          ""
        ),
        new User(
          undefined,
          2,
          "Luka",
          "nachname3",
          "email1",
          false,
          Role.USER,
          ""
        ),
      ],
    };
  },
});
</script>

<style scoped></style>
