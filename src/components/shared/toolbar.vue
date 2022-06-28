<template>
  <v-card color="secondary">
    <v-layout row class="mb-2 px-3 py-2">
      <v-layout class="pa-2">
        {{ options.displayName }}
      </v-layout>
      <v-spacer></v-spacer>
      <v-tooltip top v-for="(action, idx) in options.actions" :key="'a_' + idx">
        <template v-slot:activator="{ on }">
          <v-btn class="mx-1" fab dark small color="secondary" @click="$emit(action.event)" v-on="on">
            <v-icon v-on="on">{{ action.icon }}</v-icon>
          </v-btn>
        </template>
        <span>{{ action.hint }}</span>
      </v-tooltip>
    </v-layout>
  </v-card>
</template>
<script>
export default {
  name: "toolbar",
  props: {
    options: {
      type: Object,
      required: true,
      default: () => {
        return {
          displayName: "",
          actions: []
        };
      },
      validator: (options) => {
        if (options.actions.length < 1) {
          console.log("No actions have been defined on toolbar");
        }
        return true;
      }
    }
  },
  computed: {
    sorting() {
      if (this.options.sort) {
        return this.options.sort.map((item) => {
          if (typeof item == "string") {
            return {
              text: item,
              value: item
            };
          } else {
            return item;
          }
        });
      } else {
        return [];
      }
    }
  }
};
</script>
