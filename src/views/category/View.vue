<template>
  <div>
    <v-container class="my-1">
      <toolbar :options="toolbar" @add-item="addItem" @refresh="refreshData" />
      <template>
        <v-card>
          <v-card-title>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table :headers="headers" :items="lists" :search="search" item-key="id">
            <template v-slot:[`item.actions`]="{ item }">
              <v-icon small @click="editItem(item.id)">mdi-pencil</v-icon>
              <v-icon small @click="deleteItem(item.id)"> mdi-delete </v-icon>
            </template>

            <!-- <template v-slot:[`item.shortName`]="{ item }">
          <a @click.prevent="editCourse(item.id)">{{ item.shortName }}</a>
        </template> -->
          </v-data-table>
        </v-card>
      </template>
    </v-container>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";
import toolbar from "@/components/shared/toolbar";

export default {
  name: "Category",
  components: {
    toolbar
  },
  data: () => ({
    search: "",
    toolbar: {
      displayName: "Category",
      actions: [
        {
          event: "refresh",
          icon: "mdi-refresh",
          hint: "Refresh"
        },
        {
          event: "add-item",
          icon: "mdi-plus",
          hint: "Create"
        }
      ]
    },
    headers: [
      {
        text: "Title",
        align: "start",
        filterable: true,
        sortable: true,
        value: "title"
      },
      {
        text: " % ",
        sortable: true,
        value: "percentage"
      },
      {
        text: "Description",
        sortable: true,
        value: "description"
      },
      {
        text: "Level",
        sortable: true,
        value: "level"
      },
      {
        text: "Experience",
        sortable: true,
        value: "experience"
      },
      {
        text: "Actions",
        value: "actions",
        sortable: false
      }
    ]
  }),

  computed: {
    ...mapState("Category", ["lists", "status"])
  },

  methods: {
    ...mapActions("Category", ["delete"]),

    /**
     * refresh the particular load action from store
     */
    refreshData() {
      this.$store.dispatch("Category/load");
      //this.updateStores();
    },
    /**
     * add button to navigate to route  for adding item
     */
    addItem() {
      this.$router.push({ name: "create-Category", params: { id: null } });
    },
    editItem(id) {
      console.log(this.$store.dispatch("Category/findByID", id));
      this.$router.push({ name: "edit-Category", params: { id: id } });
    },
    deleteItem(id) {
      this.$store.dispatch("Category/delete", id);
    }
  },
  beforeCreate() {
    this.$store.dispatch("Category/checkload");
  }
};
</script>
