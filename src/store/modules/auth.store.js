import axios from "axios";
export default {
  namespaced: true,
  state: {
    loaded: false,
    processing: false,
    auth: false,
    user: {}
  },
  getters: {
    getProcessingStatus: state => {
      return state.processing;
    },
    getUser: state => {
      return state.user;
    }
  },
  mutations: {
    SET_AUTH(state, auth) {
      state.auth = auth.auth;
      state.user = { ...state.user, ...auth.user };
      state.loaded = true;
    },
    SET_PROCESS_STATE(state, status) {
      state.processing = status;
    }
  },
  actions: {
    clearAuth({ commit }) {
      commit("SET_AUTH", { auth: false, user: {} });
      commit("SET_PROCESS_STATE", false);
    },
    loadAuth({ commit }) {
      axios
        .get("/auth/user")
        .then(r => r.data)
        .then(auth => {
          commit("SET_AUTH", auth);
        })
        .catch(err => {
          console.log(err);
          commit("SET_AUTH", { auth: false, loaded: true });
        });
    },
    signIn({ commit }, data) {
      commit("SET_PROCESS_STATE", true);
      return new Promise((resolve, reject) => {
        axios
          .post("/auth/login", data)
          .then(function (r) {
            if (r.data.auth === true && r.data.success === true) {
              commit("SET_AUTH", r.data);

              resolve();
            } else {
              commit("SET_PROCESS_STATE", false);
              reject();
            }
          })
          .catch(e => {
            console.log(e);
            commit("SET_PROCESS_STATE", false);
            reject();
          });
      });
    },
    signOut({ commit, dispatch }) {
      commit("SET_PROCESS_STATE", true);
      axios
        .get("auth/logout")
        .then(function () {
          dispatch("clearAuth");
        })
        .catch(() => {
          dispatch("clearAuth");
        });
    }
  }
};
