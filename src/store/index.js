import Vue from 'vue'
import Vuex from 'vuex';
import pageButton from './modules/pageButton'
import user from './modules/user'
import getters from './getters'
Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    pageButton,
    user
  },
  getters
});
export default store
