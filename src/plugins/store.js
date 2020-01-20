import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//持久化
const localStorePlugin = store => {
  // 从localStorage初始化
  if (localStorage.store) {
    store.replaceState(JSON.parse(localStorage.store))
  }
  // 改变时存入localStorage
  store.subscribe((mutation, state) => {
      localStorage.setItem("store",  JSON.stringify(state))
  })
}

export default new Vuex.Store({
  state: {
    config: {}, //{scriptId : {configKey: value} }
    favor: [], //[scriptId]
  },
  mutations: {
    setConfig(state, {scriptId, config}) {
      state.config[scriptId] = config
    },
    changeFavor(state, {scriptId, isAdd}) {
      (!state.favor) && (state.favor = [])
      let index = state.favor.indexOf(scriptId)
      if(isAdd && index<0) {
        state.favor.push(scriptId)
      } else if(!isAdd && index>=0) {
        state.favor.splice(index, 1)
      }
    },
  },
  actions: {
  },
  getters: {
    getConfig(state) {
      return scriptId => {
        return state.config[scriptId] ? state.config[scriptId] : {}
      }
    },
  },
  modules: {
  },
  plugins: [localStorePlugin]
})
