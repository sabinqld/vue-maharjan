<template>
  <v-card flat>
    <v-container>
      <v-row>
        <template>
          <v-form ref="form">
            <v-text-field v-model="title" label="Title" required></v-text-field>

            <v-text-field label="Percentage" v-model="percentage"></v-text-field>

            <vue-editor :editorToolbar="customToolbar" v-model="description"></vue-editor>
            <v-text-field label="Level" v-model="level"></v-text-field>
            <v-text-field label="Experience" v-model="experience"></v-text-field>
            <v-toolbar flat>
              <v-btn v-show="!dataDirty" ripple rounded color="accent" @click="deleteCourse">Delete</v-btn>
              <v-spacer></v-spacer>
              <v-btn v-show="!dataDirty" ripple rounded color="secondary" @click="cancel">Close</v-btn>
              <v-btn v-show="!dataDirty" ripple rounded @click="cancel">Cancel</v-btn>
              <v-btn v-show="!dataDirty" ripple rounded color="primary" @click="save()">Save</v-btn>
            </v-toolbar>
          </v-form>
        </template>
      </v-row>
    </v-container>

    <!-- <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn v-show="itemDirty" ripple rounded color="primary" dark v-on="on">Save</v-btn>
      </template>
      <v-list>
        <v-list-item v-for="(item, index) in saveOptions" :key="index" @click="save(item.click)">
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu> -->
  </v-card>
</template>
<script>
import { mapState, mapActions } from "vuex";
import { VueEditor } from "vue2-editor";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getItemField",
  mutationType: "updateItemField"
});
export default {
  name: "edit-skill",
  components: {
    VueEditor
  },
  props: ["id"],
  data: () => ({
    search: "",
    panels: [2, 4],
    customToolbar: [
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }][
        ({ align: "" }, { align: "center" }, { align: "right" }, { align: "justify" })
      ]
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
    ...mapActions("Skill", ["saveNew", "saveExisting", "cancelItem", "deleteItem"]),
    cancel() {
      this.cancelItem();
      this.$router.go(-1);
    },
    save() {
      if (this.id) {
        this.saveExisting().then(() => this.$router.go(-1));
      } else {
        this.saveNew({
          title: this.title,
          description: this.description,
          level: this.level,
          percentage: this.percentage,
          experience: this.experience
        }).then(() => this.$router.go(-1));
        //.catch(err => console.log(err));
      }
    },
    deleteCourse() {
      this.deleteItem().then(() => {
        this.$router.push({ name: "profiles" });
      });
    }

    // addItem() {
    //   this.$router.push({ name: "create-skill", params: { id: null } });
    // },
    // editItem(id) {
    //   this.$router.push({ name: "edit-skill", params: { id: id } });
    // }
  },
  beforeMount() {
    if (this.id) {
      this.$store.dispatch("Skill/loadSkill", this.id);
    } else {
      this.$store.dispatch("Skill/createNew");
    }
  },
  beforeCreate() {
    this.$store.dispatch("Skill/checkload");
  }
};
</script>
