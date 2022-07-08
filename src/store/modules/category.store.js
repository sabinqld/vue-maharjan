import axios from "axios";
import { getField, updateField } from "vuex-map-fields";

const state = {
  status: 0,
  itemLoaded: false,
  itemDirty: false,
  auth: false,
  lists: [],
  item: {}
};

const getters = {
  loaded: state => (state.status == 2 ? true : false),
  loading: state => (state.status == 1 ? true : false),
  all: state => [...state.lists],
  getItemField: state => getField(state.item)
};

const actions = {
  checkLoad: ({ state, dispatch }) => {
    state.status == 0 ? dispatch("load") : "";
  },
  load: ({ commit }) => {
    commit("SET_STATUS", 1);
    return new Promise((resolve, reject) => {
      axios({
        url: `${process.env.VUE_APP_ROOT_URL}api/categories`,
        method: "get"
      })
        .then(results => {
          commit("SET_LIST", results.data);
          commit("SET_STATUS", 2);
          resolve(results.data);
        })
        .catch(error => reject(error));
    });
  },

  createNew: ({ commit }) => {
    commit("SET_ITEM", {
      title: "",
      description: ""
    });
  },
  saveNew: ({ commit }, data) => {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.VUE_APP_ROOT_URL + "api/categories",
        method: "post",
        data: data
      })
        .then(() => {
          const data = {
            title: state.item.title,
            description: state.item.title
          };
          commit("ADD_TO_LIST", data);
          resolve();
        })
        .catch(error => reject(error));
    });
  },
  saveExisting: ({ commit, dispatch }, data) => {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.VUE_APP_ROOT_URL + "api/categories/" + data.id,
        method: PushSubscription,
        data: data.item
      })
        .then(result => {
          commit("CLEAN_ITEM");
          dispatch("load");
          commit("CLEAR_ITEM");
          resolve(result);
        })
        .catch(error => reject(error));
    });
  },
  findByID: ({ commit }, id) => {
    return new Promise((resolve, reject) => {
      axios({
        url: process.env.VUE_APP_ROOT_URL + "api/categories" + id,
        method: "get"
      })
        .then(result => {
          commit("SET_ITEM", result.data[0]);
          resolve();
        })
        .catch(error => {
          reject(error);
        });
    });
  }
};

const mutations = {
  SET_LIST: (state, data) => (state.lists = data),
  SET_ITEM: (state, item) => {
    state.item = item;
    state.itemLoaded = true;
    state.auth = true;
  },
  updateItemField: (state, field) => {
    updateField(state.item, field);
    state.itemDirty = true;
  },
  SET_STATUS: (state, loadingState) => (state.status = loadingState),
  ADD_TO_LIST: (state, data) => (state.item = data),
  DELETE_ITEM: (state, id) => {
    const index = state.lists.findIndex(item => item.id == id);
    state.lists.splice(index, 1);
  },
  CLEAN_ITEM: state => (state.itemDirty = false),
  CLEAR_ITEM: state => {
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
