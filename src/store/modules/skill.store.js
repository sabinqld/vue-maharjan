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
  loaded: state => (state.status == 2 ? true : false),
  list: state => [...state.list],
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
      title: "auto generated",
      description: "",
      percentage: "",
      level: "",
      experience: "",
      user_id: null
    });
  },
  saveNew({ commit }, data) {
    return new Promise((resolve, reject) => {
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
            type: "programming",
            percentage: state.item.percentage,
            experience: state.item.experience,
            user_id: state.item.user_id
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
      console.log(" i am in save exissting page");
      axios({
        url: process.env.VUE_APP_ROOT_URL + "/api/skills",
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
  delete({ commit }, itemObj) {
    return new Promise(resolve => {
      axios({
        url: process.env.VUE_APP_APIBASEURL + "api/form/" + itemObj.id,
        method: "delete",
        data: itemObj
      }).then(resp => {
        console.log(resp);
        if (resp.data == "In use.") {
          resolve(false);
        } else {
          commit("REMOVE_ITEM", itemObj);
          resolve(true);
        }
      });
    });
  },
  loadSkill({ commit }, id) {
    axios({
      url: process.env.VUE_APP_ROOT_URL + "/api/skills/" + id,
      method: "get"
    }).then(r => {
      let item = r.data.lists[0];
      commit("SET_ITEM_ID", item);
    });
  }
};
const mutations = {
  SET_ITEM(state, lists) {
    state.lists = lists;
    state.itemLoaded = true;
    state.auth = true;
  },
  SET_ITEM_ID(state, item) {
    state.item = item;
    state.itemLoaded = true;
    state.auth = true;
  },

  SET_STATUS(state, loadingState) {
    state.status = loadingState;
  },

  ADD_TO_LIST(state, data) {
    state.list = data;
  },
  CLEAR_ITEM(state) {
    state.item = {};
    state.itemLoaded = false;
    state.itemDirty = false;
  }
};

export default {
  namespaced: true,
  state: state,
  getters: getters,
  actions: actions,
  mutations: mutations
};
