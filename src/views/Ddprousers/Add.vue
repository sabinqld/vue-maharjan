<template>
  <v-card>
    <v-container class="my-1">
      <toolbar :options="toolbar"></toolbar>
      <v-form ref="form">
        <v-row>
          <v-col cols="6">
            <v-text-field
              v-model="tempEmpId"
              clearable
              label="Employee ID"
              append-outer-icon="mdi-account-search"
              @click:append-outer="searchEmp"
              @click:clear="clearEmpInput"
              @keyup.enter="searchEmp"
              @keydown.enter.prevent
              :disabled="!!empId"
            />
          </v-col>
        </v-row>
        <v-row v-if="validEmp">
          <v-col cols="6">
            <v-text-field v-model="displayEmpName" disabled label="Employee Name" />
          </v-col>
          <v-col cols="6">
            <v-text-field v-model="displayEmpEmail" disabled label="Employee Email" />
          </v-col>
        </v-row>
        <!--
        <v-row v-if="validEmp">
          <v-col cols="6">
            <v-text-field v-model="pref" label="Preferences" />
          </v-col>
        </v-row>
-->
      </v-form>
    </v-container>
    <div class="text-center">
      <v-snackbar v-model="error" centered multi-line :timeout="timeout" color="secondary">
        {{ errorMessage }}

        <v-btn ripple rounded color="error" @click="error = false">Close</v-btn>
      </v-snackbar>
    </div>
    <v-toolbar flat>
      <v-spacer></v-spacer>
      <v-btn v-show="!itemDirty" ripple rounded color="secondary" @click="cancel">Close</v-btn>
      <v-btn v-show="itemDirty" ripple rounded @click="cancel">Cancel</v-btn>
      <v-btn v-show="itemDirty" :disabled="!valid" ripple rounded color="primary" @click="save()">Save</v-btn>
    </v-toolbar>
  </v-card>
</template>
<script>
import { mapState, mapActions, mapGetters } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getItemField",
  mutationType: "updateItemField"
});

import toolbar from "../../components/shared/toolbar";

export default {
  name: "Ddprousers-add",
  components: {
    toolbar
  },

  data: () => ({
    tempEmpId: null,
    valid: true,
    timeout: -1,
    error: false,
    errorMessage: null,
    toolbar: {
      displayName: "DD Profile - Add User",
      actions: [{ event: "refresh", icon: "mdi-refresh", hint: "Refresh" }]
    }
  }),
  computed: {
    ...mapState("Ddprousers", ["itemLoaded", "itemDirty"]),
    ...mapState("Lookup", ["empLookup", "empStatus"]),
    ...mapFields("Ddprousers", ["empId", "pref"]),

    // computed function returns boolean if store is loaded and has returned a value, used to show employee details
    validEmp() {
      if (this.empStatus == 2 && this.empLookup) {
        return this.empLookup.empId ? true : false;
      } else {
        return false;
      }
    },

    // computed function shows employee full name
    displayEmpName() {
      return this.empLookup.firstname + " " + this.empLookup.lastname;
    },

    // computed function shows employee email
    displayEmpEmail() {
      return this.empLookup.email;
    }
  },
  methods: {
    ...mapGetters("Ddprousers", ["isDirty"]),
    ...mapActions("Ddprousers", ["saveItem", "cancelItem", "checkload"]),
    ...mapActions("Lookup", ["clearEmp", "getEmp"]),

    // clears store and returns to previous route
    cancel() {
      this.cancelItem();
      this.$router.go(-1);
    },

    // check if validate is true or false, then call saveItem action in store, returns to previous route
    save() {
      if (this.validate()) {
        this.saveItem({ id: null, empId: this.empId, pref: this.pref });
        this.$router.go(-1);
      }
    },

    // Checks validation on form component and return boolean
    validate() {
      return this.$refs.form.validate();
    },

    // clears form
    clearEmpInput() {
      this.clearEmp();
      this.tempEmpId = null;
    },

    // calls action from lookup store and returns record
    searchEmp() {
      this.getEmp(this.tempEmpId)
        .then(() => {
          // set the empId based upon the result.
          if (this.empLookup) {
            this.empId = this.empLookup.empId;
          } else {
            this.errorMessage = "Invalid employee ID";
            this.error = true;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  beforeMount() {
    this.$store.dispatch("Lookup/clearEmp");
    this.$store.dispatch("Ddprousers/createNew");
  },
  beforeRouteLeave(to, from, next) {
    if (this.isDirty()) {
      this.$store.dispatch("Ddprousers/load");
    }
    next();
  }
};
</script>
