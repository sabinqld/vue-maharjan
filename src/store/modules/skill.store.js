import axios from "axios";

const initialState = () => ({
  status: 0,
  auth: false,
  lists: []
});

const state = initialState();
const getters = {
  isLoaded(state) {
    return state.status == 2 ? true : false;
  }
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
      console.log(`${process.env.VUE_APP_ROOT_URL}/api/skills/`);
      axios({
        url: `${process.env.VUE_APP_ROOT_URL}/api/skills`,
        method: "get"
      })
        .then(r => {
          commit("SET_ITEM", r.data);
          commit("SET_STATUS", 2);
          resolve(r.data);
        })
        .catch(err => reject(err));
    });
  }
};
const mutations = {
  SET_ITEM(state, lists) {
    state.lists = lists;
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
