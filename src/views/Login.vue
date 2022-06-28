<template>
  <v-app>
    <v-layout>
      <v-flex xs12 sm6 offset-sm3>
        <v-card>
          <v-card-title primary-title>
            <div>
              <h3 class="headline mb-0">Login Required</h3>
            </div>
          </v-card-title>
          <v-card-text>
            <v-form v-model="valid" v-on:submit.prevent="onSubmit">
              <v-container>
                <v-text-field v-model="creds.username" label="Novel ID" required autocomplete="username" />
                <v-text-field
                  :type="'password'"
                  v-model="creds.password"
                  :rules="pwordRules"
                  label="Password"
                  required
                  autocomplete="current-password"
                />
                <v-btn class="primary" :disabled="!valid && !busy" type="submit">Login</v-btn>
              </v-container>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
    <v-snackbar v-model="error" top multi-line :timeout="timeout">
      Login Failed
      <v-btn text color="primary" @click="error = false">Close</v-btn>
    </v-snackbar>
  </v-app>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "Login-page",
  data: () => ({
    creds: {
      username: "",
      password: ""
    },
    timeout: -1,
    error: false,
    busy: false,
    valid: false,
    pwordRules: [v => !!v || "Password is required", v => v.length >= 8 || "Password must be at least 8 characters"]
  }),
  computed: {
    ...mapGetters("Auth", {
      processing: "getProcessingStatus"
    })
  },
  methods: {
    ...mapActions("Auth", ["signIn"]),
    onSubmit() {
      this.busy = true;

      console.log(`credentials are :\n ${this.creds.username} \n ${this.creds.password}`);
      this.signIn(this.creds)
        .then(res => {
          console.log(res);
          // don't do anything, the router will take care of it if successful
        })
        .catch(() => {
          this.error = true;
          this.busy = false;
          // this.creds.password = "";
        });
    }
  }
};
</script>
