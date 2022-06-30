<template>
  <v-card flat>
    <v-container>
      <v-row>
        <template>
          <v-form ref="form" v-model="valid">
            <v-text-field v-model="name" label="Title" required></v-text-field>

            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>

            <v-btn :disabled="!valid" color="success" class="mr-4" @click="validate"> Validate </v-btn>

            <v-btn color="error" class="mr-4" @click="reset"> Reset Form </v-btn>

            <v-btn color="warning" @click="resetValidation"> Reset Validation </v-btn>

            <v-text-field label="Percentage" v-model="percentage"></v-text-field>

            <vue-editor :editorToolbar="customToolbar" v-model="description"></vue-editor>
            <v-text-field label="Level" v-model="level"></v-text-field>
            <v-text-field label="Experience" v-model="experience"></v-text-field>
          </v-form>
        </template>
      </v-row>
    </v-container>
    <v-toolbar flat>
      <v-btn v-show="!dataDirty" ripple rounded color="accent" @click="deleteCourse">Delete</v-btn>
      <v-spacer></v-spacer>
      <v-btn v-show="!dataDirty" ripple rounded color="secondary" @click="cancel">Close</v-btn>
      <v-btn v-show="dataDirty" ripple rounded @click="cancel">Cancel</v-btn>
      <v-btn v-show="dataDirty" ripple rounded color="primary" @click="save()">Save</v-btn>
    </v-toolbar>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-show="itemDirty" ripple rounded color="primary" dark v-on="on">Save</v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in saveOptions" :key="index" @click="save(item.click)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "edit-skill",
  props: ["id"],
  data: () => ({
    search: "",
    panels: [2, 4],
    customToolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }]
    ],
    saveButton: [
      { click: "save", title: "Save to Draft" },
      {
        condition: ["isDraft"],
        click: "publish",
        title: "Save and Publish"
      },
      { condition: ["nameChange"], click: "duplicate", title: "Save as New" }
    ],
    cancelButton: [
      {
        condition: ["isDraft"],
        click: "revertSaved",
        title: "Revert to saved"
      },
      { click: "revertPublish", title: "Revert to Published" }
    ],
    confirmDelete: false,
    criteriaCopy: {}
  }),

  computed: {
    ...mapState("Skill", {
      status: 1,
      dataDirty: "itemDirty"
    })
  },
  loadedFn() {
    if (this.itemLoaded) {
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
  },

  methods: {
    addItem() {
      this.$router.push({ name: "create-skill", params: { id: null } });
    },
    editItem(id) {
      this.$router.push({ name: "edit-skill", params: { id: id } });
    }
  },
  beforeCreate() {
    this.$store.dispatch("Skill/checkload");
  }
};
</script>
