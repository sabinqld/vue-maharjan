<template>
  <v-container>
      <toolbar :options="toolbar" @refresh="refreshData" @printItems="print(toolbar.displayName)"></toolbar>
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
        item-key="streamId"
        :headers="headers"
        :items="displayList"
        :search="search"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small @click="editItem(item.streamId)">mdi-pencil</v-icon>
        </template>
      </v-data-table>
      <v-card v-if="printPrep" v-show="false">
      <v-card-title>Preparing Print Data</v-card-title>
      <v-card-text id="renderPrint">
        <v-data-table
          dense
          item-key="id"
          :items="displayList"
          :headers="headers"
          disable-pagination
          hide-default-footer
        />
      </v-card-text>
    </v-card>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ this.edit.streamName }}</span>
        </v-card-title>
        <v-card-text>
        <v-text-field :counter="10" label="Stream Acronym" v-model="edit.streamAcronym"></v-text-field>  
        </v-card-text>
        <v-card-actions>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn ripple rounded color="error" @click="clear">
              Cancel
            </v-btn>
            <v-btn ripple rounded color="secondary" @click="saveStream">
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
  name: "Streams",
  components: {
    toolbar
    
  },
  data: () => ({
  edit: {
      streamId: null,
      streamName: null,
      streamAcronym: null
    },
dialog: false,
printPrep: false,
   headers: [
       {
        text: "Stream Id",
        align: "center",
        sortable: true,
        value: "streamId"
      },
      {
        text: "Stream Name",
        align: "start",
        sortable: true,
        value: "streamName"
      },
      {
        text: "Stream Acronym",
        align: "center",
        sortable: true,
        value: "streamAcronym"
      },
      
      { value: "action" }
    ], 
    toolbar: {
      displayName: "Streams",
      actions: [{ event: "refresh", icon: "mdi-refresh", hint: "Refresh" },
      { event: "printItems", icon: "mdi-printer", hint: "Print"}]
    },
    search: ""
  }),

  computed: {
    ...mapState("Streams", ["list"]),
    ...mapGetters("Streams", ["byId", "isLoaded", "displayList"]),
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
    ...mapActions("Streams", { storeStream: "saveItem" }),
    refreshData() {
      this.$store.dispatch("Streams/load");
    },
    clear() {
      this.dialog = false;
      this.edit.streamId = null;
      this.edit.streamAcronym = null;
      this.edit.streamName = null;
    },
    saveStream() {
      this.storeStream({ streamId: this.edit.streamId, streamAcronym: this.edit.streamAcronym, streamName: this.edit.streamName })
        .catch((err) => {
          console.log(err);
          this.clear();
        })
        .then((r) => {
          console.log(r);
          this.clear();
        });
    },
    editItem(streamId) {
      let stream = this.byId(streamId);

      // get the info for this stream.
      this.edit.streamId = stream.streamId;
      this.edit.streamName = stream.streamName;
      this.edit.streamAcronym = stream.streamAcronym;
      this.dialog = true;
    },
    print(reportName) {
      this.printPrep = true;
      this.$nextTick(() => {
        const oReq = new XMLHttpRequest();
        oReq.addEventListener("load", function() {
          // Get HTML to print from element
          const prtHtml = document.getElementById("renderPrint").innerHTML;
          let stylesHtml = `<style>${this.responseText}</style>`;

          // Open the print window
          const WinPrint = window.open("", "", "left=0,top=0,width=1200,height=600,toolbar=0,scrollbars=0,status=0");

          WinPrint.document.write(`<!DOCTYPE html>
        <html>
          <head>
            ${stylesHtml}
          </head>
          <h1> ${reportName} </h1>
          <body class="print">
            ${prtHtml}
          </body>
        </html>`);

          WinPrint.document.close();
          WinPrint.focus();
          WinPrint.print();
          WinPrint.close();
          this.printPrep = false;
        });
        oReq.open("GET", "/css/print.css");
        oReq.send();
      });
    }
  },

    beforeCreate() {
    this.$store.dispatch("Streams/checkload");
  },
  beforeMount() {
    this.$store.dispatch("Streams/checkload");
  }

};
</script>