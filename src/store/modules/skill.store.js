import axios from "axios";

const initialState = () => ({
  auth: false,
  list: {}
});

const state = initialState();
const getters = {
  isLoaded(state) {
    return state.status == 2 ? true : false;
  },

  getList: state => {
    return state.user;
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
      axios({
        url: `${process.env.VUE_APP_ROOT_URL}api/skills/`,
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
  SETLOADING(state, bool) {
    state.isLoading = bool;
  },
  SETJOBS(state, { jobs }) {
    state.jobs = jobs;
  },
  SETSELECTEDJOBID(state, id) {
    state.selectedJobID = id;
  },
  SET_ITEM(state, lists) {
    state.lists = lists.user;
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
