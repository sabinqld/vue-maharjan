import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios'
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    jobs:{},
    selectedJobID:null,
    isLoading:false,

  },
  getters:{
    selectedJob:state=>{
        return state.jobs.find(job=>job.id===state.selectedJobID)
    }
  },
  mutations: {
    SETLOADING(state,bool){
        state.isLoading=bool;
    },
    SETJOBS(state,{jobs}){
        state.jobs=jobs
    },
    SETSELECTEDJOBID(state,id){
        state.selectedJobID=id
    }
  },
  actions: {

    fetchJobs({commit}){
        commit("SETLOADING",true)
        return axios.get("http://localhost:3000/api/jobs")
        .then(res=>{
            setTimeout(()=>{
                commit("SETLOADING",false)
                commit("SETJOBS",{jobs:res.data})
            },2500)
        }).catch(error=>{
            commit("SETLOADING",false)
            console.log(error);
        })
    }
  }
});