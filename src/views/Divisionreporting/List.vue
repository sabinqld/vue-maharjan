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
        item-key="id"
        :headers="headers"
        :items="displayList"
        :search="search"
      >
        <template v-slot:[`item.action`]="{ item }">
          <v-icon small @click="editItem(item.id)">mdi-pencil</v-icon>
        </template>
      </v-data-table>
      <v-card v-if="printPrep" v-show="false">
      <v-card-title>Preparing Print Data</v-card-title>
      <v-card-text id="renderPrint">
        <v-data-table
          dense
          item-key="id"
          :items="list"
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
          <span class="headline">{{ this.edit.name }}</span>
        </v-card-title>
        <v-card-text>
        <v-text-field :counter="10" label="Division Acronym" v-model="edit.divAcronym"></v-text-field>  
        <v-text-field :counter="10" label="Div Grouping L1" v-model="edit.divReporting"></v-text-field>
        <v-text-field :counter="30" label="Division Short Name" v-model="edit.shortName"></v-text-field>    
        </v-card-text>
        <v-card-actions>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn ripple rounded color="error" @click="clear">
              Cancel
            </v-btn>
            <v-btn ripple rounded color="secondary" @click="saveDivision">
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
  name: "Divisionreporting",
  components: {
    toolbar
    
  },
  data: () => ({
  edit: {
      id: null,
      name: null,
      divAcronym: null,
      divReporting: null,
      shortName: null
    },
dialog: false,
 printPrep: false,
   headers: [
       {
        text: "Div Id",
        align: "center",
        sortable: true,
        value: "id"
      },
      {
        text: "Div Name",
        align: "start",
        sortable: true,
        value: "name"
      },
      {
        text: "Div Short Name",
        align: "start",
        sortable: true,
        value: "shortName"
      },
      {
        text: "Div Acronym",
        align: "start",
        sortable: true,
        value: "divAcronym"
      },
      {
        text: "Div Grouping L1",
        align: "start",
        sortable: true,
        value: "divReporting"
      },
      { value: "action" }
    ], 
    toolbar: {
      displayName: "Division Reporting",
      actions: [{ event: "refresh", icon: "mdi-refresh", hint: "Refresh" },
      { event: "printItems", icon: "mdi-printer", hint: "Print"}]
    },
    search: ""
  }),

  computed: {
    ...mapState("Divisionreporting", ["list"]),
    ...mapGetters("Divisionreporting", ["byId", "isLoaded", "displayList"]),
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
    ...mapActions("Divisionreporting", { storeDivision: "saveItem" }),
    refreshData() {
      this.$store.dispatch("Divisionreporting/load");
    },
    clear() {
      this.dialog = false;
      this.edit.id = null;
      this.edit.divAcronym = null;
      this.edit.divReporting = null;
      this.edit.shortName = null;
    },
    saveDivision() {
      this.storeDivision({ id: this.edit.id, divAcronym: this.edit.divAcronym, divReporting: this.edit.divReporting, shortName: this.edit.shortName })
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
      let division = this.byId(id);

      // get the info for this division.
      this.edit.id = division.id;
      this.edit.name = division.name;
      this.edit.divAcronym = division.divAcronym;
      this.edit.divReporting = division.divReporting;
      this.edit.shortName = division.shortName;
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
    this.$store.dispatch("Divisionreporting/checkload");
  },
  beforeMount() {
    this.$store.dispatch("Divisionreporting/checkload");
  }

};
</script>