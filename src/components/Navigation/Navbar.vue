<template>
  <nav>
    <v-app-bar dense flat app color="primary" dark>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title class="text-uppercase">Practise Practise</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn @click="signOut()">
        <span>Sign Out</span>
        <v-icon right>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" fixed app>
      <v-list>
        <template v-for="item in itemList">
          <v-layout v-if="item.heading" :key="item.heading" row align-center>
            <v-flex xs6>
              <v-subheader v-if="item.heading">{{ item.heading }}</v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-list-group
            v-else-if="item.children"
            :key="item.text"
            v-model="item.model"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon
          >
            <template v-slot:activator>
              <v-list-item ripple>
                <v-list-item-content>
                  <v-list-item-title>{{ item.text }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            <v-list-item v-for="(child, i) in item.children" :key="i" router :to="child.route" ripple>
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ child.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item v-else :key="item.text" router :to="item.route" ripple>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{ item.text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
  </nav>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      drawer: false,
      items: [
        { icon: "mdi-account", text: "login", route: "/auth/login" },

        {
          icon: "mdi-account-settings-outline",
          "icon-alt": "mdi-account-settings-outline",
          text: "Test",
          restricted: true,
          model: false,
          children: [{ icon: "mdi-menu-right", text: "Skill", route: "/skills" }]
        }
      ]
    };
  },
  methods: {
    ...mapActions("Auth", ["signOut"])
  },
  computed: {
    ...mapState("Auth", ["loaded", "auth", "user"]),
    itemList() {
      if (this.user.admin === true) {
        return [...this.items];
      } else {
        return this.items;
      }
    }
  }
};
</script>

<style></style>
