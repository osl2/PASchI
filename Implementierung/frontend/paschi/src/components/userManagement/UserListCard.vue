<template>
  <v-card color="primary" min-width="600">
    <v-card-title>
      <v-row class="ma-2">
        Akzeptierte Accounts
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
      v-for="user in users"
      v-show="!collapsed && includesSearch(user)"
    >
      <v-row class="ma-2" align-content="start">
        <v-col v-show="showName">
          {{ user.firstName }} + {{ user.lastName }}
        </v-col>
        <v-col v-show="showEmail">
          {{ user.email }}
        </v-col>
        <v-col>
          {{ user.getId }}
        </v-col>
        <v-col cols="2">
          <v-btn
            prepend-icon="fas fa-trash"
            color="#ff0000"
            @click="deleteUser(user)"
          />
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
  name: "UserListCard",
  setup() {
    const userController: UserController = UserController.getUserController();
    userController.register("David", "nachname1", "email1", "", "");
    userController.register("Cian", "nachname2", "email2", "", "");
    userController.register("Aaron", "nachname3", "email3", "", "");
    userController.register("Luka", "nachname4", "email4", "", "");
    userController.register("Florian", "nachname5", "email5", "", "");
    const adminController: AdminController =
      AdminController.getAdminController();
    const users: Ref<User[]> = ref<User[]>(
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
    function includesSearch(user: User): boolean {
      return (
        (searchParameter.value === "ID" &&
          user.getId.includes(searchInput.value)) ||
        (searchParameter.value === "E-Mail" &&
          user.email.includes(searchInput.value))
      );
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
      users: [
        new User(
          undefined,
          0,
          "David",
          "nachname1",
          "email1",
          true,
          Role.USER,
          ""
        ),
        new User(
          undefined,
          1,
          "Cian",
          "nachname2",
          "email1",
          true,
          Role.USER,
          ""
        ),
        new User(
          undefined,
          2,
          "Luka",
          "nachname3",
          "email1",
          true,
          Role.USER,
          ""
        ),
      ],
    };
  },
});
</script>

<style scoped></style>
