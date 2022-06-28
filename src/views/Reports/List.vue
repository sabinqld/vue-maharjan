<template>
<v-container fluid v-if="allLoaded">
    <v-row dense>
      <v-col cols="4" v-for="(item, i) in list" :key="i">
        <v-card shaped>
          <v-card-title>{{ item.title }}</v-card-title>
          <v-card-subtitle :min-height="200">{{ item.descr }}</v-card-subtitle>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn color="primary" text @click="runReport(item)">Download</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
</v-container>
</template>
<script>
import { mapGetters } from "vuex";
import { mapState } from "vuex";

export default {
    name: "Reports",
    components: {

    },
    data: () => {
        return {
            dialogData: {
                id: null,
                title: null,
                settings: false,
                data: null,
                options: []
             },
        values: {}
        };
    },
    computed: {
    ...mapGetters("Reports", ["loaded", "getSettings"]),
    ...mapState("Reports", ["list"]),
        allLoaded() {
            if (this.loaded) {
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
        loadReport(report) {
            this.dialogData.id = report.id;
            this.dialogData.title = report.title;
            this.dialogData.settings = report.options.some(
                option => option.code === "settings"
            );
            this.dialogData.options = report.options.reduce((comp, option) => {
                let combinedOption = option;
                if (report.data) {
                combinedOption = {
                    ...option,
                    list: report.data,
                    id: report.id
                };
                }
                comp.push(combinedOption);
                return comp;
            }, []);
            this.values = {};
            report.options.forEach(option => {
                this.$set(this.values, option.code, option.default);
                //this.values[option.code] = option.default;
            });
            this.dialog = true;
        },
        runReport(report) {
            this.dialogData.id = report.id
            this.overlay = true;
            this.$store
                .dispatch("Reports/runReport", {
                id: this.dialogData.id,
                options: this.values
                })
                .then(r => {
                const dataUri = window.URL.createObjectURL(new Blob([r.data]));
                const fileName = r.headers["content-disposition"].split('"')[1];
                const link = document.createElement("a");
                link.setAttribute("href", dataUri);
                link.setAttribute("download", fileName);
                link.setAttribute("type", r.headers["content-type"]);
                document.body.appendChild(link); // Required for FF
                link.click();
                document.body.removeChild(link);
                this.overlay = false;
        });
    },
    },
    beforeCreate() {
        this.$store.dispatch("Reports/checkload");
    }
        
    
};
</script>
