<template>
  <v-container>
      <toolbar :options="toolbar" @refresh="refreshData"></toolbar>
      <v-card v-if="allLoaded">
      <div id="flashMessage" v-if="flashMessage">
        <p class="text-md-center">
          {{ flashMessage }}
        </p>
      </div>
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
        :items="displayList"
        :search="search"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small @click="editItem(item.id)">mdi-pencil</v-icon>
          <v-btn
            class="ml-1"
            ripple
            rounded
            x-small
            color="secondary"
            @click="runItem(item.id)"
            >Run Task</v-btn>
        </template>
        <template v-slot:[`item.active`]="{ item }">
          <v-tooltip bottom v-if="item.active">
            <template v-slot:activator="{ on, attrs }">
              <span v-if="item.active == 'Inactive'" class="red--text" v-bind="attrs" v-on="on">{{
                item.active
              }}</span>
              <span v-else class="green--text" v-bind="attrs" v-on="on">{{ item.active }}</span>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card v-show = "!editing">
          <v-card-title>
            <span class="headline">{{ this.edit.name }}</span>
          </v-card-title>
          <v-card-text>
            <span>{{ this.edit.descr }}</span>
          </v-card-text>  
        </v-card>
        <v-card v-show = "editing">
          <v-card-title class="headline">
            <v-col>
              <v-row>
                <v-text-field label="Task Name: " v-model="edit.name" counter="45">
                </v-text-field>
              </v-row>
              <v-row>
                <v-text-field label="Task Description: " v-model="edit.descr" counter="100">
                </v-text-field>
              </v-row>
              <v-row>
                <v-checkbox label="Schedule Active" v-model="edit.active">
                </v-checkbox>
              </v-row>
              <v-row v-show="edit.active">
                <v-menu  
                  ref="menu"
                  v-model="timePicker"
                  :close-on-content-click="false"
                  :nudge-right="40"
                  :return-value.sync="edit.timing"
                  transition="scale-transition"
                  offset-y
                  max-width="290px"
                  min-width="290px"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="edit.timing"
                      label="Scheduled Start Time"
                      prepend-icon="mdi-clock-time-four-outline"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-if="timePicker"
                    v-model="edit.timing"
                    full-width
                    @click:minute="$refs.menu.save(edit.timing)"
                  ></v-time-picker>
                </v-menu>
              </v-row>
            </v-col>
          </v-card-title>
        </v-card>
        <v-card-actions>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn ripple rounded color="error" @click="clear">
              Cancel
            </v-btn>
            <v-btn v-show ="!editing" ripple rounded color="secondary" @click="runScheduledTask(edit.id, edit.eventId)">
              Run Task
            </v-btn>
            <v-btn v-show ="editing" ripple rounded color="secondary" @click="saveUser()">
              Save task
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
  name: "ScheduledTasks",
  components: {
    toolbar
  },
  data: () => ({
    edit: {
      id: null,
      eventId: null,
      name: null,
      descr: null,
      timing: null,
      hour: null,
      minute: null,
      active: null
    },
    dialog: false,
    timePicker: false,
    editing: false,
    flashMessage: "",
    timeout: -1,
   headers: [
/*      
      {
        text: "Task Id",
        align: "center",
        sortable: true,
        value: "id"
      },
      
      {
        text: "Event Id",
        align: "center",
        sortable: true,
        value: "eventId"
      },
*/
      {
        text: "Task Name",
        align: "start",
        sortable: true,
        value: "eventName"
      },
      {
        text: "Task Description",
        align: "start",
        sortable: true,
        value: "eventDescr"
      },
/*
{
        text: "Parameters",
        align: "start",
        sortable: true,
        value: "params"
      },
*/
      {
        text: "Scheduled Start Time (HH:MM)",
        align: "center",
        sortable: true,
        value: "timing"
      },
      {
        text: "Schedule Active",
        align: "center",
        sortable: true,
        value: "active"
      },
      { value: "action" }
    ],
    toolbar: {
      displayName: "Scheduled Tasks",
      actions: [{ event: "refresh", icon: "mdi-refresh", hint: "Refresh" }]
    },
    search: ""
  }),
  computed: {
    ...mapState("Scheduledtasks", ["list"]),
    ...mapGetters("Scheduledtasks", ["byId", "isLoaded", "displayList"]),
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
    ...mapActions("Scheduledtasks", ["saveItem", "scheduleItem" ]),
    refreshData() {
      this.$store.dispatch("Scheduledtasks/load");
    },
    clear() {
      this.dialog = false;
      this.editing = false;
      this.edit.id = null;
      this.edit.eventId = null;
      this.edit.name = null;
      this.edit.descr = null;
      
      this.edit.timing = null;
      this.edit.hour = null;
      this.edit.minute = null;
      this.active = null;
    },
    saveUser() {
      this.saveItem(
        {
          id: this.edit.id,
          eventId: this.edit.eventId,
          name: this.edit.name,
          descr: this.edit.descr,
          hour: parseInt(this.edit.timing.split(':')[0]),
          minute: parseInt(this.edit.timing.split(':')[1]),
          active: this.edit.active
          }
         )
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
      let task = this.byId(id);
      // get the data for this task.
      this.edit.id = task.id;
      this.edit.eventId = task.eventId;
      this.edit.name = task.eventName;
      this.edit.descr = task.eventDescr;
      this.edit.timing = task.timing.start.hour + ":" + task.timing.start.minute.padStart(2,"0");
      this.edit.active = task.active;
      this.editing = true;
      this.dialog = true;
    },
    runItem(id) {
      let task = this.byId(id);
      // get the data for this task.
      this.edit.id = task.id;
      this.edit.eventId = task.eventId;
      this.edit.name = task.eventName;
      this.edit.descr = task.eventDescr;
      this.editing = false;
      this.dialog = true;
    },
    runScheduledTask(id, eventId){
        this.id = id;
        this.eventId = eventId;
        this.scheduleItem({id: this.id, eventId: this.eventId})
        .catch((err) => {
          console.log(err);
          this.clear();
        })
        .then((resp) => {
            if(resp && resp.status===200){
              this.flashMessage = "You have successfully scheduled task - " + this.edit.name;
              setTimeout(() => {this.flashMessage = ""}, 4000);
            }
            this.clear();
        });
    }
  },
  beforeCreate() {
    this.$store.dispatch("Scheduledtasks/checkload");
  },
  beforeMount() {
    this.$store.dispatch("Scheduledtasks/checkload");
  }
};
</script>
<style>
  @keyframes yellowfade {
    from {
      background: #fbaf54;
    }
    to {
      background: transparent;
    }
  }

  #flashMessage {
    text-align: centre;
    animation-name: yellowfade;
    animation-duration: 4s;
  }
</style>