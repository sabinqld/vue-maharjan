<template>
  <v-expansion-panels focusable>
    <v-expansion-panel>
      <v-expansion-panel-header>Filters</v-expansion-panel-header>
      <v-expansion-panel-content expand-icon="expand_more">
        <v-layout row wrap>
          <slot></slot>
        </v-layout>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>
<script>
export default {
  name: "listFilter"
};
</script>
