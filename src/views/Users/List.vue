<template>
  <v-container class="my-1">
    <toolbar :options="toolbar" @refresh="refreshData"></toolbar>
    <v-card v-if="allLoaded">
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
          clearable
        ></v-text-field>
      </v-card-title>
      <v-data-table
        dense
        :sort-desc="[false, true]"
        multi-sort
        :items-per-page="15"
        item-key="id"
        :headers="headers"
        :items="list"
        :search="search"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small @click="editItem(item.id)">mdi-pencil</v-icon>
        </template>
        <template v-slot:no-data>
          NO DATA HERE!
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ this.edit.name }}</span>
        </v-card-title>
        <v-card-text>
          <v-select
            v-model="edit.type"
            :items="['Admin', 'Role Based']"
            label="User Type"
            required
          >
          </v-select>
        </v-card-text>
        <v-card-actions>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn ripple rounded color="error" @click="clear">
              Cancel
            </v-btn>
            <v-btn ripple rounded color="secondary" @click="saveUser">
              Save
            </v-btn>
          </v-toolbar>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";

import toolbar from "../../components/shared/toolbar";

export default {
  name: "Users",
  components: {
    toolbar
  },
  data: () => ({
    edit: {
      id: null,
      type: null,
      name: null
    },
    dialog: false,
    headers: [
      {
        text: "Employee ID",
        align: "start",
        sortable: true,
        value: "empId"
      },
      {
        text: "Type",
        align: "start",
        sortable: true,
        value: "type"
      },
      {
        text: "First Name",
        align: "start",
        sortable: true,
        value: "firstname"
      },
      {
        text: "Last Name",
        align: "start",
        sortable: true,
        value: "lastname"
      },
      {
        text: "Email Address",
        align: "start",
        sortable: true,
        value: "email"
      },
      {
        text: "Novell Id",
        align: "start",
        sortable: true,
        value: "novelId"
      },
      { value: "action" }
    ],
    toolbar: {
      displayName: "Users",
      actions: [{ event: "refresh", icon: "mdi-refresh", hint: "Refresh" }]
    },
    search: ""
  }),
  computed: {
    ...mapState("Users", ["list"]),
    ...mapGetters("Users", ["byId", "isLoaded"]),
    allLoaded() {
      if (this.isLoaded) {
        this.$emit("hide-msg");
        return true;
      } else {
        this.$emit("show-msg", {
          txt: "Loading",
          timeout: -1,
          showLoader: true,
          btn: false
        });
        return false;
      }
    }
  },
  methods: {
    ...mapActions("Users", { storeUser: "saveItem" }),
    refreshData() {
      this.$store.dispatch("Users/load");
    },
    clear() {
      this.dialog = false;
      this.edit.id = null;
      this.edit.name = null;
      this.edit.type = null;
    },
    saveUser() {
      this.storeUser({ id: this.edit.id, type: this.edit.type })
        .catch((err) => {
          console.log(err);
          this.clear();
        })
        .then((r) => {
          console.log(r);
          this.clear();
        });
    },
    editItem(id) {
      let user = this.byId(id);

      // get the type for this user.
      this.edit.id = id;
      this.edit.type = user.type;
      this.edit.name = user.firstname + " " + user.lastname;

      this.dialog = true;
    }
  },
  beforeCreate() {
    this.$store.dispatch("Users/checkload");
  },
  beforeMount() {
    this.$store.dispatch("Users/checkload");
  }
};
</script>
