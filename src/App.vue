<template>
  <div v-if="!loaded" />
  <router-view v-else-if="auth"></router-view>
  <login-view v-else></login-view>
</template>

<script>
import { mapState } from "vuex";

import LoginView from "./views/Login";

export default {
  name: "App",

  components: {
    "login-view": LoginView
  },
  computed: {
    ...mapState("Auth", ["loaded", "auth"])
  },
  beforeCreate() {
    console.log("before");
    this.$store.dispatch("Auth/loadAuth");
  }
};
</script>
