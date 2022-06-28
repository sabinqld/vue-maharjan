<template>
  <v-container class="my-1">
    <toolbar :options="toolbar" @refresh="refreshData"></toolbar>
    <template flat v-if="loadedFn">
      <v-row>
        <v-col cols="12">
          <v-text-field disabled label="Employee ID" v-model="user.empId"></v-text-field>
          <v-text-field disabled label="Type" v-model="user.type"></v-text-field>
          <v-text-field disabled label="Email" v-model="user.email"></v-text-field>
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>
<script>
import { mapState } from "vuex";
import toolbar from "../../components/shared/toolbar";

export default {
  name: "profile",
  components: {
    toolbar
  },
  data: () => ({
    toolbar: {
      displayName: "My Profile",
      actions: [{ event: "refresh", icon: "mdi-refresh", hint: "Refresh" }]
    }
  }),
  computed: {
    ...mapState("Currentuser", ["status", "auth", "access", "positions", "user"]),
    loadedFn() {
      if (this.status == 2) {
        this.$emit("hide-msg");
        return true;
      } else {
        this.$emit("show-msg", {
          txt: "Loading",
          timeout: -1,
          showLoader: true
        });
        return false;
      }
    }
  },
  methods: {
    refreshData() {
      this.$store.dispatch("Currentuser/load");
    }
  }
};
</script>
