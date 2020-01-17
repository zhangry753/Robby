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
  },
  mutations: {
    setConfig(state, {id, config}) {
      state.config[id] = config
    },
  },
  actions: {
  },
  getters: {
    getConfig(state) {
      return id => {
        return state.config[id] ? state.config[id] : {}
      }
    },
  },
  modules: {
  },
  // plugins: [localStorePlugin]
})
