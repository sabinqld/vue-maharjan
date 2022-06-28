<template>
  <v-app>
    <nav-bar />
    <v-main class="mx-2 mb-2">
      <router-view @show-msg="showMsg" @hide-msg="hideMsg" />
    </v-main>
    <v-snackbar :timeout="msg.timeout" :color="msg.color" top multi-line v-model="msg.active" dark>
      <div class="text-xs-center width-override">
        {{ msg.txt }}
        <br />
        <v-progress-linear v-if="msg.showLoader" color="primary" :indeterminate="true" />
      </div>
    </v-snackbar>
  </v-app>
</template>

<script>
import Navbar from "../components/Navigation/Navbar";
export default {
  components: {
    "nav-bar": Navbar
  },
  data: () => ({
    msg: {
      active: false,
      txt: "",
      timeout: -1,
      color: "#bbb",
      showLoader: false
    }
  }),
  methods: {
    showMsg(msgSettings) {
      this.msg.txt = msgSettings.txt;
      if (msgSettings.timeout) this.msg.timeout = msgSettings.timeout;
      if (msgSettings.color) this.msg.color = msgSettings.color;
      if (msgSettings.showLoader) this.msg.showLoader = msgSettings.showLoader;
      this.msg.active = true;
    },
    hideMsg() {
      this.msg.active = false;
      this.msg.color = "#bbb";
      this.msg.timeout = -1;
      this.msg.showLoader = false;
    }
  }
  // beforeCreate() {
  //   this.$store.dispatch("Team/checkload");
  //   this.$store.dispatch("Combos/load");
  // }
};
</script>
<style>
[v-cloak] > * {
  display: none;
}
[v-cloak]::before {
  content: " ";
  display: block;
  width: 16px;
  height: 16px;
  background-image: url("data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==");
}
div.width-override {
  width: 100%;
}
</style>
