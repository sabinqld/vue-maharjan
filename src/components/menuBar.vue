<template>
  <v-list dense>
    <template v-for="item in items">
      <v-row v-if="item.heading" :key="item.heading" align="center">
        <v-col cols="12">
          <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
        </v-col>
      </v-row>
      <v-list-group
        v-else-if="item.children"
        :key="item.text"
        v-model="item.model"
        :prepend-icon="item.model ? item.icon : item['icon-alt']"
        append-icon
      >
        <template v-slot:activator>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
        <v-list-item v-for="(child, i) in item.children" :key="i" @click="routeTo(child.path)">
          <v-list-item-action v-if="child.icon">
            <v-icon>{{ child.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title>{{ child.text }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item v-else :key="item.text" @click="routeTo(item.path)">
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>
<script>
import { mapGetters } from "vuex";

export default {
  name: "menuBar",
  props: {
    options: {
      type: Object,
      required: false
    }
  },
  data: () => ({
    items: [
      {
        icon: "mdi-face-profile",
        "icon-alt": "mdi-face-profile",
        text: "Users",
        restricted: ["admin"],
        path: "/users",
        model: false
      },
      {
        icon: "mdi-account",
        "icon-alt": "mdi-account-edit-outline",
        text: "My Profile",
        restricted: false,
        path: "/currentuser",
        model: false
      },
      {
        icon: "mdi-wrench",
        "icon-alt": "mdi-wrench",
        text: "Scheduled Tasks",
        restricted: false,
        path: "/scheduledtasks",
        model: false
      },
      {
        icon: "mdi-cog",
        "icon-alt": "mdi-cog",
        text: "Additional Report Groupings",
        restricted: false,
        model: false,
        children: [
          { icon: "mdi-menu-right", text: "Divisions", path: "/divisionreporting" },
          { icon: "mdi-menu-right", text: "Streams", path: "/streams" }
        ]
      },
      {
        icon: "mdi-account-cog",
        "icon-alt": "mdi-account-cog",
        text: "Sub app Users",
        restricted: false,
        model: false,
        children: [
          { icon: "mdi-menu-right", text: "DD Profile", path: "/ddprousers" },
          { icon: "mdi-menu-right", text: "DD RRT", path: "/ddrrtusers" }
        ]
      },
      {
        icon: "mdi-view-dashboard-variant",
        "icon-alt": "mdi-view-dashboard-variant",
        text: "Qlik Dashboard Users",
        restricted: false,
        model: false,
        children: [
          { icon: "mdi-menu-right", text: "(RWM) Responsible Workforce Management", path: "/qlikaccessrwm" },
          { icon: "mdi-menu-right", text: "(QCVT) QLD Covid Vaccination Training", path: "/qlikaccessqcvt" }
        ]
      },
      {
        icon: "mdi-newspaper-variant-outline",
        "icon-alt": "mdi-newspaper-variant-outline",
        text: "Reporting",
        restricted: false,
        path: "/reports",
        model: false
      }
    ]
  }),
  computed: {
    ...mapGetters("Currentuser", ["isLoaded", "isAuthorised", "getUser", "getAccess"]),
    authItems() {
      if (this.isLoaded && this.isAuthorised) {
        if (this.getUser.type == "Admin") {
          return this.items.filter(item => !item.restricted || item.restricted.includes("admin"));
        } else if (this.getAccess.whs.access) {
          return this.items.filter(item => !item.restricted || item.restricted.includes("whs"));
        } else if (this.getAccess.ed.access) {
          return this.items.filter(item => !item.restricted || item.restricted.includes("ed"));
        } else if (this.getAccess.lm.access) {
          return this.items.filter(item => !item.restricted || item.restricted.includes("lm"));
        } else {
          return this.items.filter(item => !item.restricted);
        }
      } else {
        return [];
      }
    }
  },
  methods: {
    routeTo(path) {
      if (this.$route.path !== path) {
        this.$router.push({ path: path });
      }
    }
  }
};
</script>
