<template>
  <v-app>
    <h1>This is an skill page</h1>
  </v-app>
</template>
<script>
import toolbar from "../../components/shared/toolbar";
export default {
  name: "skill",
  components: {
    toolbar
  },
  beforeCreate() {
    this.$store.dispatch("Skill/checkload");
  }
};
</script>
