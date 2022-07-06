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
  getItemByID: (state, id) => {
    return state.lists.find(item => item.id === id);
  },
  getItem(state) {
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
      console.log(`${process.env.VUE_APP_ROOT_URL}api/skills/`);
      axios({
        url: `${process.env.VUE_APP_ROOT_URL}api/skills`,
        method: "get"
      })
        .then(r => {
          commit("SET_LIST", r.data);
          commit("SET_STATUS", 2);
          resolve(r.data);
        })
        .catch(err => reject(err));
    });
  },
  createNew({ commit }) {
    console.log("I am inside new");
    commit("SET_ITEM", {
      title: "",
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
        url: process.env.VUE_APP_ROOT_URL + "api/skills",
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
  saveExisting({ commit, dispatch }, data) {
    return new Promise((resolve, reject) => {
      console.log("id and data");
      console.log(data.item);
      console.log(data.id);

      axios({
        url: process.env.VUE_APP_ROOT_URL + "api/skills/" + data.id,
        method: "put",
        data: data.item
      })
        .then(r => {
          commit("CLEAN_ITEM");
          dispatch("load");
          commit("CLEAR_ITEM");
          resolve(r);
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  cancelItem({ commit }) {
    commit("CLEAR_ITEM");
  },

  findByID({ commit }, id) {
    console.log("inside findbyid");

    return new Promise(() => {
      // const item = state.lists.find(item => item.id == id);
      // console.log(item);
      // commit("updateItemField", item);
      axios({
        url: process.env.VUE_APP_ROOT_URL + "api/skills/" + id,
        method: "get"
      }).then(result => {
        console.log("reuslt data inside findbyid");
        console.log(result.data[0]);
        commit("SET_ITEM", result.data[0]);
        //        commit("updateItemField", result.data[0]);
      });
    });
  },
  delete({ dispatch }, id) {
    return new Promise(resolve => {
      axios({
        url: process.env.VUE_APP_ROOT_URL + "api/skills/" + id,
        method: "delete"
      }).then(result => {
        resolve(result);
        dispatch("load");
        // commit("REMOVE_ITEM", result);
        // resolve(true);
      });
    });
  }
};
const mutations = {
  SET_LIST(state, data) {
    state.lists = data;
  },
  SET_ITEM: (state, item) => {
    state.item = item;
    state.itemLoaded = true;
    state.auth = true;
  },
  updateItemField: (state, field) => {
    console.log("field data");
    console.log(field);
    console.log(state.item);
    //state.item = field;
    updateField(state.item, field);
    state.itemDirty = true;
  },

  SET_STATUS: (state, loadingState) => {
    state.status = loadingState;
  },

  ADD_TO_LIST(state, data) {
    state.item = data;
  },
  DELETE_ITEM(state, id) {
    const index = state.lists.findIndex(item => item.id == id);
    state.lists.splice(index, 1);
  },
  CLEAN_ITEM(state) {
    state.itemDirty = false;
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
