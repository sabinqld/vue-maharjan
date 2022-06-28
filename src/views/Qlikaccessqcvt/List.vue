<template>
  <v-container class="my-1">
    <toolbar :options="toolbar" @refresh="refreshData" @add-item="addItem" @printItems="print(toolbar.displayName)" @downloadItems="downloadFile()"></toolbar>
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
        item-key="empId"
        :headers="headers"
        :items="list"
        :search="search"
      >
        <template v-slot:[`item.action`]="{ item }">
         <v-row>
            <v-col>
              <v-icon small @click="editUser(item.empId)">mdi-pencil</v-icon>
            </v-col>
            <v-col>
              <v-icon small @click="deleteUser(item.empId)">mdi-delete</v-icon>
            </v-col>
          </v-row>
        </template>
        <template v-slot:no-data>
          NO DATA HERE!
        </template>
      </v-data-table>

      <v-card v-if="printPrep" v-show="false">
      <v-card-title>Preparing Print Data</v-card-title>
      <v-card-text id="renderPrint">
        <v-data-table
          dense
          item-key="empId"
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
        <v-card-actions>
          <v-toolbar flat>
            <v-spacer></v-spacer>
            <v-btn ripple rounded color="error" @click="clear">
              Cancel
            </v-btn>
              <v-btn v-show="!deleting" ripple rounded color="secondary" @click="saveUser">
                Save
              </v-btn>
              <v-btn v-show="deleting" ripple rounded color="secondary" @click="deleteSelectedUser">
                Delete User
              </v-btn>
          </v-toolbar>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
import { createHelpers } from "vuex-map-fields";
const { mapFields } = createHelpers({
  getterType: "getItemField",
  mutationType: "updateItemField"
});

import toolbar from "../../components/shared/toolbar";

export default {
  name: "QCVTUsers",
  components: {
    toolbar
  },
  data: () => ({
    edit: {
      
      empId: null,
      
      name: null
    },
    dialog: false,
    printPrep: false,
    reportName: null,
    deleting: false,
    headers: [
      {
        text: "Employee ID",
        align: "start",
        sortable: true,
        value: "empId"
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
      displayName: "QCVT Qlik Dashboard Users",
      actions: [
        { event: "refresh", icon: "mdi-refresh", hint: "Refresh" },
        { event: "add-item", icon: "mdi-plus", hint: "Create" },
        { event: "printItems", icon: "mdi-printer", hint: "Print"},
        { event: "downloadItems", icon: "mdi-file-download", hint: "Download"}
      ]
    },
    search: ""
  }),
  computed: {
    ...mapState("Qlikaccessqcvt", ["list"]),
    ...mapGetters("Qlikaccessqcvt", ["byId", "isLoaded"]),
    ...mapFields("Qlikaccessqcvt", ["empId"]),
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
    ...mapActions("Qlikaccessqcvt", ["saveItem", "deleteItem"]),
    addItem() {
      this.$router.push({ name: "qlikaccessqcvt-add", params: { empId: null } });
    },
    refreshData() {
      this.$store.dispatch("Qlikaccessqcvt/load");
    },
    clear() {
      this.dialog = false;
      this.edit.empId = null;
      this.edit.name = null;
    },
    saveUser() {
      this.saveItem({ empId: this.edit.empId })
        .catch((err) => {
          console.log(err);
          this.clear();
        })
        .then((r) => {
          console.log(r);
          this.clear();
        });
    },
    editUser(empId) {
      let user = this.byId(empId);
      // get the data for this user.
      this.edit.empId = user.empId;
      this.edit.name = user.firstname + " " + user.lastname;
      this.dialog = true;
      this.deleting=false;

      //console.log("This Edit User:", this.edit);
    },
    deleteUser(empId) {
      let user = this.byId(empId);
      // get the data for this user.
      this.edit.empId = user.empId;
      
      this.edit.name = user.firstname + " " + user.lastname;
      this.dialog = true;
      this.deleting=true;

      //console.log("This Edit User:", this.edit);
    },
    deleteSelectedUser(){
      this.deleteItem({empId: this.edit.empId});
      this.dialog = false;
      this.deleting = false;
    },
    convertDate(date) {
      const dateObj = {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
      };
      return dateObj.day + "/" + dateObj.month + "/" + dateObj.year;
    },
    downloadFile() {
      let itemList = this.list.reduce((newList, record) => {
        newList.push({
          empId: record.empId,
          firstName: record.firstname,
          lastName: record.lastname,
          Email: record.email,
          NovelId: record.novelId
        });
        return newList;
      }, []);

      const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
      const header = Object.keys(itemList[0]);
      let csv = itemList.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(","));
      csv.unshift(header.join(","));
      csv = csv.join("\r\n");
      let uri = "data:text/csv;charset=utf-8," + encodeURIComponent(csv);
      var link = document.createElement("a");
      link.setAttribute("href", uri);
      link.setAttribute("download", "Qlikaccessqcvt.csv");
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
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
  beforeMount() {
    this.$store.dispatch("Qlikaccessqcvt/checkload");
  }
};
</script>
