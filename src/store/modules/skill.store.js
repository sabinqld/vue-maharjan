import axios from "axios";
import { getField, updateField } from "vuex-map-fields";
const initialState = () => ({
  status: 0,
  itemLoaded: false,
  itemDirty: false,
  auth: false,
  lists: [],
  item: {}
});

const state = initialState();
const getters = {
  loaded(state) {
    return state.status == 2 ? true : false;
  },
  loading(state) {
    return state.status == 1 ? true : false;
  },
  all(state) {
    return state.list;
  },

  getItemField(state) {
    return getField(state.item);
  },
  listAll(state) {
    return state.list.map(item => {
      return item;
    });
  },
  item(state) {
    return state.item;
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
  },
  createNew({ commit }) {
    commit("SET_ITEM", {
      title: "",

      description: "",
      percentage: "",
      level: "",
      experience: ""
    });
  },
  saveNew({ commit }, data) {
    return new Promise((resolve, reject) => {
      let item = Object.assign({}, state.item);
      console.log(item);
      console.log(process.env.VUE_APP_ROOT_URL + "/api/skills");
      axios({
        url: process.env.VUE_APP_ROOT_URL + "/api/skills",
        method: "post",
        data: data
      })
        .then(result => {
          console.log("result" + result);
          commit("ADD_TO_LIST", {
            title: state.item.title,
            description: state.item.description,
            level: state.item.level,
            percentage: state.item.percentage,
            experience: state.item.experience
          });
          commit("CLEAR_ITEM");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  saveExisting({ state, commit }) {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.VUE_APP_ROOT_URL + "api/skills",
        method: "post",
        data: state.item
      })
        .then(() => {
          commit("CLEAN_ITEM");
          for (var x = 0; x < state.list.length; x++) {
            if (state.list[x].id === state.item.id) {
              // this is the one
              commit("MODIFY_LIST_ITEM", {
                title: state.item.title,
                description: state.item.description,
                level: state.item.level,
                percentage: state.item.percentage,
                experience: state.item.experience
              });
              break;
            }
          }
          commit("CLEAR_ITEM");
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  cancelItem({ commit }) {
    commit("CLEAR_ITEM");
  },
  loadSkill({ commit }, id) {
    axios({
      url: process.env.VUE_APP_ROOT_URL + "api/skills/" + id,
      method: "get"
    }).then(r => {
      let item = r.data.lists[0];
      commit("SET_ITEM", item);
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
  },
  ADD_TO_LIST(state, data) {
    state.list = data;
  },
  CLEAR_ITEM(state) {
    state.item = {};
    state.itemLoaded = false;
    state.itemDirty = false;
    state.itemDraft = false;
  }
};

export default {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
};
