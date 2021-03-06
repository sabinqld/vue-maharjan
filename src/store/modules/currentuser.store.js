import axios from "axios";

const initialState = () => ({
  status: 0,
  auth: false,
  access: {},
  positions: [],
  list: {}
});

const state = initialState();
const getters = {
  isLoaded: state => (state.status == 2 ? true : false)
};
const actions = {
  checkload({ state, dispatch }) {
    if (state.status == 0) {
      dispatch("load");
    }
  },
  load({ commit }) {
    commit("SET_STATUS", 1);
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.VUE_APP_ROOT_URL}api/currentuser/`,
        method: "get"
      })
        .then(r => {
          commit("SET_ITEM", r.data);
          commit("SET_STATUS", 2);
          resolve(r.data);
        })
        .catch(err => reject(err));
    });
  },
  signOut({ dispatch }) {
    axios
      .get(process.env.VUE_APP_ROOT_URL + "logout")
      .then(() => {
        dispatch("reset", null, { root: true });
      })
      .catch(() => {
        dispatch("reset", null, { root: true });
      });
  }
};
const mutations = {
  SET_ITEM(state, currentUser) {
    state.user = currentUser.user;
    state.access = currentUser.access;
    state.positions = currentUser.positions;
    state.auth = true;
  },
  SET_STATUS(state, loadingState) {
    state.status = loadingState;
  },
  RESET(state) {
    const newState = initialState();
    Object.keys(newState).forEach(key => {
      state[key] = newState[key];
    });
  }
};

export default {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
};
